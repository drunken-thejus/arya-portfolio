import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-center">
      <p className="label-mono mb-4">Error 404</p>
      <h1 className="font-display text-display-lg text-bone">Lost the plot.</h1>
      <p className="mt-4 max-w-md text-bone-muted">
        This page doesn&apos;t exist — or it was never written.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back home
      </Link>
    </main>
  );
}
