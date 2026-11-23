import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="font-display text-7xl font-bold text-brand-200">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-ink-soft">The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.</p>
      <Link href="/" className="btn-primary mt-8">Go to homepage</Link>
    </div>
  );
}
