import discordIcon from '@/public/discord.svg'
import Image from 'next/image'

export default function Page() {
  return (
    <div className="flex flex-col items-center text-white font-bold text-xl">
      <p className='text-4xl text-amber mt-8'>Contact us!</p>
      <a href="https://twitter.com/ThriveAudioLLC" target="_blank" className="flex w-[350px] h-[70px] mt-[100px] p-[15px] rounded-xl bg-coolgraydark border-[2px] border-coolgraylight justify-start items-center hover:scale-105 transition duration-100 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,1)] shadow-[0_4px_6px_-1px_rgba(0,0,0,1)]">
        <div className='w-[30px] h-[30px]'>
          <svg viewBox="0 0 24 24">
            <path className="fill-white" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </div>
        <p className='ml-2'>Twitter</p>
      </a>
      <a href="https://discord.gg/AxWZj2mPJ2" target='_blank' className='flex w-[350px] h-[70px] mt-[30px] p-[15px] rounded-xl bg-coolgraydark border-[2px] border-coolgraylight justify-start items-center hover:scale-105 transition duration-100 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,1)] shadow-[0_4px_6px_-1px_rgba(0,0,0,1)]'>
        <Image src={discordIcon} alt="discord"></Image>
      </a>
    </div>
  )
}