"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
  minimum: 0.2,
})

export function ProgressBarProvider() {
  const pathname = usePathname()

  useEffect(() => {
    NProgress.done()

    return () => {
      NProgress.start()
    }
  }, [pathname])

  return null
}
