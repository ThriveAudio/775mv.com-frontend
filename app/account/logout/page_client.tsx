'use client'

import { useRouter } from 'next/navigation'

export default function LogoutClient({redirect}) {
  const router = useRouter()
  if (redirect == "redirect") {
    router.back()
  }
}