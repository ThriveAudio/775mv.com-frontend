'use client'

import { useRouter } from 'next/navigation'
import { useAtom } from 'jotai'
import { pageBackAtom } from '../../../utils/atoms'

export default function LogoutClient({redirect}) {
  const router = useRouter()
  const [pageBack, setPageBack] = useAtom(pageBackAtom)
  if (redirect == "redirect") {
    setPageBack(true)
    router.back()
  }
}