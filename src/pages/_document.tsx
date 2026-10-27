import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />

        {/* Inline Critical CSS: Immune to caching issues, CDN outages, or server restarts */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --primary-red: #cc0000;
                --brand-maroon: #801b0d;
                --countdown-bg: #7F0401;
                --bg-dark: #0a0a0a;
              }
              html { scroll-behavior: smooth; }
              body {
                font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background-color: #FAFBFC;
                color: #1a1a1a;
                margin: 0;
                padding: 0;
                overflow-x: hidden;
              }
              .snav-btn {
                position: fixed;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                z-index: 99999;
                background: #7F0401;
                border: none;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 12px;
                padding: 16px 10px;
                border-radius: 10px 0 0 10px;
                box-shadow: -2px 0 14px rgba(127,4,1,0.4);
              }
              .snav-label {
                writing-mode: vertical-rl;
                transform: rotate(180deg);
                color: #fff;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: .13em;
                text-transform: uppercase;
                font-family: 'DM Sans', sans-serif;
                white-space: nowrap;
              }
              .snav-icon span {
                display: block;
                width: 14px;
                height: 2px;
                background: #fff;
                border-radius: 1px;
                margin-bottom: 4px;
              }
            `,
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
