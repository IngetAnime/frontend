import ButtonLink from "./ButtonLink";

export default function AnimePlatform({ platforms }) {
  return (
    <ul className="flex flex-nowrap overflow-x-auto gap-1">
      {platforms.map((platform, index) => {
        const icon = 
          platform.platform.name.includes('AniOne') ? <img src='/images/platforms/anione.png' className="h-full w-full object-contain"/> :
          platform.platform.name.includes('Muse') ? <img src='/images/platforms/muse.jpg' className="h-full w-full object-contain p-1"/> :
          platform.platform.name.includes('Bstation') ? <img src='/images/platforms/bilibili.svg' className="h-full w-full object-contain"/> :
          platform.platform.name.includes('Catchplay') ? <img src='/images/platforms/catchplay.png' className="h-full w-full object-contain p-1"/> :
          platform.platform.name.includes('Crunchyroll') ? <img src='/images/platforms/crunchyroll.svg' className="h-full w-full object-contain p-1"/> :
          platform.platform.name.includes('Netflix') ? <img src='/images/platforms/netflix.png' className="h-full w-full object-contain px-0.75 py-1.25"/> :
          platform.platform.name.includes('Prime') ? <img src='/images/platforms/prime.png' className="h-full w-full object-contain px-0.75 py-1.5"/> : 
          <></>;
        return (
          <li key={index} className="shrink-0 sm:pb-0">
            <ButtonLink sx={{ height: '2rem', minWidth: 'unset', p: 0 }} to={platform.link} target="blank">
              {icon}
            </ButtonLink>
          </li>
        )
      })}
    </ul>
  )
}