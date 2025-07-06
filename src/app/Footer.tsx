interface Link {
  _id: string;
  displayName: string;
  url: string;
  icon?: string;
}

const footerLinkClass =
  'text-gray-500 hover:text-black hover:no-underline transition-colors';

export default function Footer({ links }: { links: Link[] }) {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <footer className="w-full sticky bottom-0 bg-white border-t border-gray-200 mt-12 z-50 animate-slide-up shadow-sm">
      <div className="max-w-2xl mx-auto flex flex-row items-center gap-6 py-4 px-2 text-base">
        {links.map((link) => {
          const isMailto = link.url.startsWith('mailto:');
          return (
            <a
              key={link._id}
              href={link.url}
              target={isMailto ? undefined : '_blank'}
              rel={isMailto ? undefined : 'noopener noreferrer'}
              className={footerLinkClass}
            >
              {link.displayName}
            </a>
          );
        })}
      </div>
    </footer>
  );
}
