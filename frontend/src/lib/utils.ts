// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassValue = any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cn(...inputs: ClassValue[]): any {
  const hasFn = inputs.some((i) => typeof i === 'function')
  if (hasFn) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (state: any) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cn(...inputs.map((i) => (typeof i === 'function' ? (i as any)(state) : i)))
  }

  const classes: string[] = []
  for (const input of inputs) {
    if (!input) continue
    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      const inner = cn(...input)
      if (typeof inner === 'string' && inner) classes.push(inner)
    } else if (typeof input === 'object') {
      for (const [key, val] of Object.entries(input)) {
        if (val) classes.push(key)
      }
    }
  }
  return classes.join(' ')
}
