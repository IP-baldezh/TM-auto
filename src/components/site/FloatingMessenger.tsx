'use client';

export function FloatingMessenger({
  telegramUrl,
  maxUrl,
  email,
}: {
  telegramUrl: string | null;
  maxUrl: string | null;
  email: string | null;
}) {
  const items = [
    telegramUrl && { href: telegramUrl, label: 'Написать в Telegram', icon: <TelegramIcon />, bg: '#229ED9' },
    maxUrl     && { href: maxUrl,      label: 'Написать в Макс',     icon: <MaxIcon />,      bg: '#0077FF' },
    email      && { href: `mailto:${email}`, label: 'Написать на почту', icon: <MailIcon />, bg: '#FF6900' },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode; bg: string }[];

  if (!items.length) return null;

  return (
    <div className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-3">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          target={item.href.startsWith('mailto') ? undefined : '_blank'}
          rel="noopener noreferrer"
          aria-label={item.label}
          style={{ backgroundColor: item.bg }}
          className="flex size-12 items-center justify-center rounded-full shadow-lg shadow-black/25 transition-transform duration-200 hover:scale-110 focus-visible:scale-110"
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-white" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function MaxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-white" aria-hidden="true">
      {/* Логотип Макс / Mail.ru Messenger — буква M */}
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14h-1.75v-5.586l-2.375 3.211h-.75L9.25 10.414V16H7.5V8h1.563l2.937 4.016L14.938 8H16.5v8z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-white" aria-hidden="true">
      <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a1 1 0 0 0 1.228 0L20 9.044 20.002 18H4z" />
    </svg>
  );
}
