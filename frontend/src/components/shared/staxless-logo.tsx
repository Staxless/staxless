interface StaxlessLogoProps {
  size?: number;
}

export default function StaxlessLogo({ size = 20 }: StaxlessLogoProps) {
  return (
    <svg
      aria-label="Staxless logo"
      className="group-hover:[&>path]:stroke-background group-hover:[&>rect]:fill-primary"
      fill="none"
      height={size}
      viewBox="0 0 40 40"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Staxless logo</title>
      <rect fill="var(--color-background)" height="40" width="40" />
      <path
        d="M10 30L30 10"
        stroke="var(--color-primary)"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M10 20L20 10"
        stroke="var(--color-primary)"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M20 30L30 20"
        stroke="var(--color-primary)"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}
