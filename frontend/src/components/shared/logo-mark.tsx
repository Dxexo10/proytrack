import { cn } from '@/lib/utils'

interface LogoMarkProps {
  className?: string
}

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10',
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-5"
        aria-hidden="true"
      >
        <path
          d="M3.5 18.8c3.2-.9 4.8-3.3 6.4-5.9 1.7-2.7 3.4-4.4 6.1-5.1"
          className="text-brand-terracotta"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle
          cx="18"
          cy="6.4"
          r="1.9"
          className="text-brand-ivory"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}
