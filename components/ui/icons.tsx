import React from 'react'

export function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.525.02c1.31-.01 2.61-.01 3.91-.01.08 1.53.64 2.99 1.63 4.11a7.08 7.08 0 0 0 4.26 2.22v3.91a10.87 10.87 0 0 1-5.89-2.01v6.91a7.17 7.17 0 0 1-2.45 5.37 7.27 7.27 0 0 1-10.45-.61 7.17 7.17 0 0 1-1.39-5.49 7.26 7.26 0 0 1 6.54-6.17c.06 1.31.41 2.59 1.02 3.73a3.35 3.35 0 0 0-3.66 3.1c-.24 1.34.42 2.7 1.6 3.32a3.37 3.37 0 0 0 4.61-1.92c.15-.44.22-.91.21-1.37V0h-.13z" />
    </svg>
  )
}

// Clean, transparent cutout glyph that dynamically lets the background pass through
export function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
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
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}