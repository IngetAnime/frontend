import ButtonLink from "./ButtonLink";

export default function AnimePlatform({ platforms }) {
  return (
    <ul className="flex flex-wrap overflow-hidden">
      {platforms.map((platform, index) => (
        <li key={index}>
          <ButtonLink sx={{ height: '2rem', minWidth: 'unset' }}>
            <img src={platform.icon} className="h-full object-contain" />
          </ButtonLink>
        </li>
      ))}
    </ul>
  )
}