export default function Wrapper({ children, className }) {
  return (
    <div className={`relative min-h-dvh ${className}`}>
      {children}
    </div>
  )
}