import ButtonLink from "./ButtonLink";

export default function AnimePlatform({ platforms }) {
  return (
    <ul className="flex flex-nowrap overflow-x-auto">
      {platforms.map((platform, index) => (
        <li key={index} className="shrink-0 pb-2 sm:pb-0">
          <ButtonLink sx={{ height: '2rem', minWidth: 'unset' }}>
            <img src={platform.icon} className="h-full object-contain" />
          </ButtonLink>
        </li>
      ))}
    </ul>
  )
}