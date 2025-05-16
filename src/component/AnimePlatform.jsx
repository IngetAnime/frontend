import ButtonLink from "./ButtonLink";

export default function AnimePlatform({ platforms }) {
  return (
    <ul className="flex flex-nowrap overflow-x-auto gap-1">
      {platforms.map((platform, index) => {
        const icon = 
          platform.platform.name.includes('AniOne') ? <img src='/images/anione.png' className="h-full w-full object-contain"/> :
          platform.platform.name.includes('Muse') ? <img src='/images/muse.jpg' className="h-full w-full object-contain p-1"/> :
          platform.platform.name.includes('Bstation') ? <img src='/images/bilibili.svg' className="h-full w-full object-contain"/>
         : <></>;
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