import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

type Element = { props: Record<string, unknown> }

const source = ts.transpileModule(
  readFileSync(new URL('../components/hike/MissionPanel.tsx', import.meta.url), 'utf8'),
  { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS } },
).outputText

function findElement(element: Element, label: string): Element | undefined {
  if (element.props['aria-label'] === label) return element
  const children = element.props.children
  for (const child of Array.isArray(children) ? children : [children]) {
    if (child && typeof child === 'object' && 'props' in child) {
      const found = findElement(child, label)
      if (found) return found
    }
  }
}

for (const scenario of [
  { left: 24, top: 160, mobile: false },
  { left: 520, top: 240, mobile: false },
  { left: 1056, top: 680, mobile: false },
  { left: 12, top: 160, mobile: true },
  { left: 262, top: 680, mobile: true },
]) {
  test(`expanding a moved task widget follows its position (${scenario.left}, ${scenario.top}, mobile=${scenario.mobile})`, () => {
    const bounds = { ...scenario, right: scenario.left + 120, width: 120 }
    const viewportWidth = scenario.mobile ? 390 : 1200
    const panelWidth = scenario.mobile ? 366 : 340
    const panelLeft = scenario.mobile ? 12 : 844
    const values: { get: () => number; set: (next: number) => void; stop: () => void }[] = []
    const states: unknown[] = []
    let stateIndex = 0
    let expanded = false
    let focused = false
    const jsx = (_type: unknown, props: Element['props']) => ({ props })
    const exports: { MissionPanel?: (props: Record<string, unknown>) => Element } = {}
    runInNewContext(source, {
      exports,
      window: { innerWidth: viewportWidth, innerHeight: 800 },
      require: (name: string) => {
        switch (name) {
          case 'react/jsx-runtime': return { jsx, jsxs: jsx }
          case 'react': return {
            useState: (initial: unknown) => {
              const index = stateIndex++
              if (!(index in states)) states[index] = index === 0 ? true : initial
              return [states[index], (next: unknown) => {
                states[index] = typeof next === 'function' ? next(states[index]) : next
                if (index === 0 && next === false) expanded = true
              }]
            },
            useRef: (current: unknown) => ({ current }),
            useEffect: () => {},
            useId: () => 'tasks',
          }
          case 'react-dom': return { flushSync: (callback: () => void) => callback() }
          case 'motion/react': return {
            motion: { button: 'button', aside: 'aside' },
            AnimatePresence: 'presence',
            useReducedMotion: () => true,
            useDragControls: () => ({}),
            useMotionValue: (initial: number) => {
              let value = initial
              const motionValue = { get: () => value, set: (next: number) => { value = next }, stop: () => {} }
              values.push(motionValue)
              return motionValue
            },
          }
          case '@/hooks/useIsMobile': return { useIsMobile: () => scenario.mobile }
          case '@/lib/trailMission': return { calculateMissionProgress: () => ({ completed: 0, total: 0 }) }
          case '@/lib/utils': return { cn: () => '' }
          case 'lucide-react': return {}
          default: throw new Error(`Unexpected import: ${name}`)
        }
      },
    })
    const props = { checkpoints: [], isReady: true, isGuest: true, saveStatus: 'saved' }
    const tree = exports.MissionPanel!(props)
    const widget = findElement(tree, 'Expand task panel')!
    const panel = findElement(tree, 'Task manager')!
    const minimize = findElement(tree, 'Minimize task panel')!
    ;(widget.props.ref as { current: unknown }).current = { getBoundingClientRect: () => bounds }
    ;(panel.props.ref as { current: unknown }).current = {
      offsetLeft: panelLeft, offsetTop: 88, offsetWidth: panelWidth, offsetHeight: 520,
    }
    ;(minimize.props.ref as { current: unknown }).current = { focus: () => { focused = true } }
    ;(widget.props.onTap as () => void)()

    const left = bounds.left + bounds.width / 2 < viewportWidth / 2 ? bounds.left : bounds.right - panelWidth
    const expectedLeft = Math.max(8, Math.min(viewportWidth - panelWidth - 8, left))
    const expectedTop = Math.max(8, Math.min(272, bounds.top))
    assert.equal(panelLeft + values[0].get(), expectedLeft)
    assert.equal(88 + values[1].get(), expectedTop)
    assert.equal(expanded, true)
    assert.equal(focused, true)
    if (scenario.mobile) {
      stateIndex = 0
      const style = findElement(exports.MissionPanel!(props), 'Task manager')!.props.style as Record<string, unknown>
      assert.equal(style.position, 'fixed')
      assert.equal(style.left, expectedLeft)
      assert.equal(style.top, expectedTop)
    }
  })
}
