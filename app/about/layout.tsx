'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AboutLayout({ children }: { children: React.ReactNode }) {


  // TODO change account navigation to cart navigation
  const links = [
    { 'route': '/about', 'name': 'About' },
    { 'route': '/about/faq', 'name': 'FAQ' },
    { 'route': '/about/privacy', 'name': 'Privacy Policy' },
    { 'route': '/about/terms', 'name': 'Terms & Cond.' }
  ]
  const currentRoute = usePathname()

  const linkComponents = links.map((link) => {
    if (link['route'] == currentRoute) {
      return <Link href={link['route']} className="px-2 py-[1px] hover:bg-coolgraydark border-l-2 border-amber rounded-r-md text-amber font-bold">{link['name']}</Link>
    } else {
      return <Link href={link['route']} className="px-2 py-[1px] hover:bg-coolgraydark border-l-2 border-ochre rounded-r-md text-ochre">{link['name']}</Link>
    }
  })

  return (
    <div className="flex flex-row">
      <div className="flex flex-col w-[150px] h-fit mt-[50px]">
        {linkComponents}
      </div>
      <div className="relative mt-[50px] flex flex-row border-2 h-[800px] w-[1000px] border-coolgraylight bg-coolgraydark rounded-lg text-amber">
        {children}
      </div>
    </div>
  )
}