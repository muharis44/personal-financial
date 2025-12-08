"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

let NProgress: any = null
if (typeof window !== "undefined") {
  NProgress = require("nprogress")
  NProgress.configure({
    showSpinner: false,
    trickleSpeed: 100,
    minimum: 0.2,
  })
}

export function ProgressBarProvider() {
  const pathname = usePathname()

  useEffect(() => {
    if (NProgress) {
      NProgress.done()
    }

    return () => {
      if (NProgress) {
        NProgress.start()
      }
    }
  }, [pathname])

  return null
}
