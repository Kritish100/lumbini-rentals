'use client'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-xl font-bold text-slate-900">Property Rentals</div>
        <div className="flex items-center gap-1 text-sm text-slate-900">
          <span>Verified</span>
          <span>✓</span>
        </div>
      </div>
    </header>
  )
}
