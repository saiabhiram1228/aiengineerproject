import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.45L3 3m18 0l-2.45 2.45" />
      <path d="M12 2v6" />
      <path d="M22 17l-3.5-3.5" />
      <path d="M2 17l3.5-3.5" />
    </svg>
  ),
  google: (props: SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.98-4.58 1.98-3.62 0-6.5-3-6.5-6.62s2.88-6.62 6.5-6.62c2.05 0 3.36.83 4.15 1.58l2.72-2.65C18.22 1.62 15.6.83 12.48.83c-5.2 0-9.4 4.1-9.4 9.25s4.2 9.25 9.4 9.25c2.8 0 4.93-1 6.33-2.43 1.45-1.4 2.18-3.6 2.18-5.65 0-.5-.05-1-.1-1.5z" />
    </svg>
  )
};
