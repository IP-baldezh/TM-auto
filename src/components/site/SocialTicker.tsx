import { VK_URL, TG_CHANNEL_URL, MAX_URL, PHONES } from '@/content/contacts';

const WA_PHONE =
  PHONES.find((p) => p.messengers.includes('whatsapp'))?.phone.replace(/\D/g, '') ??
  '79082350845';

const BRAND_ITEMS = Array.from({ length: 10 }, (_, i) => (
  <span key={i} className="social-ticker-item">
    <LogoMark />
    ТМ АВТО
    <span className="social-ticker-dot">✦</span>
  </span>
));

const CTA_ITEMS = Array.from({ length: 6 }, (_, i) => (
  <span key={i} className="social-ticker-item">
    БОЛЬШЕ АВТО И ЦЕН В НАШИХ СОЦ СЕТЯХ
    <span className="social-ticker-dot">→</span>
  </span>
));

export function SocialTicker() {
  return (
    <div className="social-ticker-root">
      <style>{`
        .social-ticker-root {
          position: relative;
          overflow: hidden;
          background: #0e1117;
          height: 180px;
        }

        /* Strips */
        .social-ticker-strip {
          position: absolute;
          left: -25%;
          right: -25%;
          overflow: hidden;
          padding: 9px 0;
        }
        .s1 { top: 12%;  background: #c60f13; transform: rotate(-5deg); }
        .s2 { top: 42%;  background: #ffffff; transform: rotate(0deg); }
        .s3 { top: 68%;  background: #c60f13; transform: rotate(5deg); }

        /* Tracks */
        .social-ticker-track {
          display: flex;
          white-space: nowrap;
          width: max-content;
        }
        .go-left  { animation: go-left  22s linear infinite; }
        .go-right { animation: go-right 28s linear infinite; }
        .go-left2 { animation: go-left  16s linear infinite; }

        @keyframes go-left  { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
        @keyframes go-right { from { transform: translateX(-50%); } to { transform: translateX(0);    } }

        /* Items */
        .social-ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0 28px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .s1 .social-ticker-item,
        .s3 .social-ticker-item { color: #fff; }
        .s2 .social-ticker-item { color: #0e1117; }

        .social-ticker-dot { opacity: 0.6; }

        /* Social icons panel */
        .social-ticker-icons {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          z-index: 20;
          background: linear-gradient(to right, transparent, #0e1117 35%);
          padding-right: 16px;
        }
        .social-ticker-icon {
          display: flex;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .social-ticker-icon:hover { transform: scale(1.15); }
        .social-ticker-icon svg { width: 14px; height: 14px; fill: white; }
      `}</style>

      {/* Strip 1 — brand red, tilted left, ТМ Авто */}
      <div className="social-ticker-strip s1">
        <div className="social-ticker-track go-left">
          {BRAND_ITEMS}{BRAND_ITEMS}
        </div>
      </div>

      {/* Strip 2 — white, straight, ТМ Авто reverse */}
      <div className="social-ticker-strip s2">
        <div className="social-ticker-track go-right">
          {BRAND_ITEMS}{BRAND_ITEMS}
        </div>
      </div>

      {/* Strip 3 — brand red, tilted right, CTA */}
      <div className="social-ticker-strip s3">
        <div className="social-ticker-track go-left2">
          {CTA_ITEMS}{CTA_ITEMS}
        </div>
      </div>

      {/* Social icons */}
      <div className="social-ticker-icons">
        <a href={VK_URL} target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте"
          className="social-ticker-icon" style={{ background: '#0077FF' }}>
          <VkIcon />
        </a>
        <a href={TG_CHANNEL_URL} target="_blank" rel="noopener noreferrer" aria-label="Telegram"
          className="social-ticker-icon" style={{ background: '#229ED9' }}>
          <TgIcon />
        </a>
        <a href={MAX_URL} target="_blank" rel="noopener noreferrer" aria-label="MAX"
          className="social-ticker-icon" style={{ background: '#7B3FC4' }}>
          <MaxIcon />
        </a>
        <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
          className="social-ticker-icon" style={{ background: '#25D366' }}>
          <WaIcon />
        </a>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 24 10" style={{ width: 28, height: 12, fill: 'currentColor', opacity: 0.85 }} aria-hidden="true">
      <text x="0" y="9" style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.05em' }}>ТМ</text>
    </svg>
  );
}

function VkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.714-1.033-1.01-1.49-.9-1.49.32v1.394c0 .463-.148.74-1.372.74-2.019 0-4.26-1.223-5.834-3.504C5.014 11.535 4.4 9.18 4.4 8.756c0-.24.096-.463.58-.463h1.744c.432 0 .596.2.764.67.84 2.43 2.252 4.56 2.832 4.56.217 0 .317-.1.317-.65V10.41c-.067-1.17-.685-1.27-.685-1.686 0-.2.164-.4.426-.4h2.743c.365 0 .496.196.496.626v3.37c0 .365.164.496.267.496.217 0 .4-.131.8-.533 1.237-1.385 2.12-3.52 2.12-3.52.117-.24.317-.463.747-.463h1.744c.525 0 .64.27.525.63-.22.996-2.33 4.02-2.33 4.02-.184.296-.25.43 0 .76.185.25.79.77 1.193 1.234.74.84 1.307 1.545 1.46 2.03.152.48-.093.724-.573.724z" />
    </svg>
  );
}

function TgIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function MaxIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14h-1.75v-5.586l-2.375 3.211h-.75L9.25 10.414V16H7.5V8h1.563l2.937 4.016L14.938 8H16.5v8z" />
    </svg>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}
