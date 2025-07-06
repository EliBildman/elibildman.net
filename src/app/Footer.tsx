const footerLinkClass =
  'text-gray-500 hover:text-black hover:no-underline transition-colors';

export default function Footer() {
  return (
    <footer className="w-full sticky bottom-0 bg-white border-t border-gray-200 mt-12 z-50">
      <div className="max-w-2xl mx-auto flex flex-row items-center gap-6 py-4 px-2 text-base">
        <a href="mailto:esbildman@gmail.com" className={footerLinkClass}>
          Email
        </a>
        <a
          href="https://linkedin.com/in/your-linkedin"
          target="_blank"
          rel="noopener noreferrer"
          className={footerLinkClass}
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/EliBildman"
          target="_blank"
          rel="noopener noreferrer"
          className={footerLinkClass}
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
