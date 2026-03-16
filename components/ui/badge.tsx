import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap border px-3 py-1 text-xs font-semibold tabular-nums transition-colors",
  {
    variants: {
      variant: {
        level1:
          "rounded-full border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200",
        level2:
          "rounded-full border-blue-200 bg-blue-100 text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/60 dark:text-blue-200",
        level3:
          "rounded-full border-green-200 bg-green-100 text-green-900 dark:border-green-900/40 dark:bg-green-950/60 dark:text-green-200",
        level4:
          "rounded-full border-amber-200 bg-amber-100 text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/60 dark:text-amber-200",
      },
    },
    defaultVariants: {
      variant: "level1",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
