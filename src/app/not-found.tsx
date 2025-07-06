import Image from 'next/image';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <Image
        src="/40Frog.png"
        alt="Frog mascot"
        width={128}
        height={128}
        className="w-32 h-32 mb-6 object-contain"
      />
      <h1 className="text-7xl font-extrabold text-black mb-4">404</h1>
      <h2 className="text-2xl font-bold text-black mb-2">Page Not Found</h2>
      <p className="text-black mb-8 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      {/* <Link
        href="/"
        className="inline-block px-6 py-2 rounded-lg bg-sky-400 text-white font-semibold shadow hover:bg-sky-500 transition-colors"
      >
        Go Home
      </Link> */}
    </main>
  );
}
