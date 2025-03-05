interface StaxlessLogoProps {
  size?: number
}

export default function StaxlessLogo({ size = 20 }: StaxlessLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="group-hover:[&>rect]:fill-[color:var(--color-primary)] group-hover:[&>path]:stroke-[color:var(--color-background)]"
    >
      <rect width="40" height="40" fill="var(--color-background)" />
      <path d="M10 30L30 10" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
      <path d="M10 20L20 10" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
      <path d="M20 30L30 20" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

