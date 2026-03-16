declare module "canvas-confetti" {
  export type Origin = { x?: number; y?: number }

  export type Options = {
    particleCount?: number
    spread?: number
    origin?: Origin
    [key: string]: unknown
  }

  export default function confetti(options?: Options): Promise<undefined> | null
}

