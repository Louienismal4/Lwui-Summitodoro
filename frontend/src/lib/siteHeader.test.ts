import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

type Element = { props: Record<string, unknown> }
type Click = { button: number; ctrlKey?: boolean; preventDefault: () => void }
type ScrollAnimation = {
  duration: number
  onUpdate: (top: number) => void
  onComplete: () => void
}

const source = ts.transpileModule(
  readFileSync(new URL('../components/layout/SiteHeader.tsx', import.meta.url), 'utf8'),
  { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS } },
).outputText

function findLink(element: Element): Element | undefined {
  if (element.props.href === '#how-it-works') return element
  const children = element.props.children
  for (const child of Array.isArray(children) ? children : [children]) {
    if (child && typeof child === 'object' && 'props' in child) {
      const found = findLink(child)
      if (found) return found
    }
  }
}

test('How it works scrolls gently to the section, updates the URL and moves focus', () => {
  let reducedMotion = false
  let prevented = false
  let stopped = false
  const animations: ScrollAnimation[] = []
  let position = 200
  let hash = ''
  let focused = false
  const historyState = { idx: 2 }
  const jsx = (_type: unknown, props: Element['props']) => ({ props })
  const exports: { SiteHeader?: (props: Record<string, unknown>) => Element } = {}
  runInNewContext(source, {
    exports,
    document: { getElementById: () => ({
      getBoundingClientRect: () => ({ top: 600 }),
      focus: ({ preventScroll }: { preventScroll: boolean }) => { focused = preventScroll },
    }) },
    window: {
      scrollY: 200,
      scrollTo: ({ top, behavior }: { top: number; behavior: string }) => {
        assert.equal(behavior, 'instant')
        position = top
      },
      history: { state: historyState, pushState: (state: unknown, _title: string, url: string) => {
        assert.equal(state, historyState)
        hash = url
      } },
    },
    require: (name: string) => {
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx }
      if (name === 'motion/react') return {
        useReducedMotion: () => reducedMotion,
        useAnimate: () => [{ animations: [{ stop: () => { stopped = true } }] },
          (from: number, to: number, options: ScrollAnimation) => {
            assert.equal(from, 200)
            assert.equal(to, 800)
            animations.push(options)
          }],
      }
      if (name === '@/lib/utils') return { cn: () => '' }
      return {}
    },
  })
  const click = (event: Click) => {
    const tree = exports.SiteHeader!({ activeView: 'home' })
    ;(findLink(tree)!.props.onClick as (event: Click) => void)(event)
  }
  const event = { button: 0, preventDefault: () => { prevented = true } }

  click({ ...event, ctrlKey: true })
  assert.equal(animations.length, 0)
  reducedMotion = true
  click(event)
  assert.equal(animations.length, 0)
  assert.equal(prevented, false)

  reducedMotion = false
  click(event)
  assert.equal(prevented, true)
  assert.equal(stopped, true)
  assert.equal(animations.length, 1)
  const animation = animations[0]
  assert.equal(animation.duration, 1.2)
  animation.onUpdate(500)
  assert.equal(position, 500)
  animation.onUpdate(800)
  animation.onComplete()
  assert.equal(position, 800)
  assert.equal(hash, '#how-it-works')
  assert.equal(focused, true)
})
