import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Seite nicht gefunden — Infinite Sphere" },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
@font-face{font-family:'Cormorant Garamond';font-style:normal;font-weight:400;font-display:swap;src:url('/assets/fonts/CormorantGaramond-Regular.woff2') format('woff2')}
@font-face{font-family:'Cormorant Garamond';font-style:normal;font-weight:600 700;font-display:swap;src:url('/assets/fonts/CormorantGaramond-Bold.woff2') format('woff2')}
html{background:#0B0B0C}
body{margin:0;background:#0B0B0C;color:rgba(233,215,174,0.72);font-family:Georgia,'Times New Roman',serif}
.nf{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px}
.nf h1{font-family:'Cormorant Garamond',Georgia,serif;font-weight:400;font-size:clamp(2.4rem,7vw,4rem);line-height:1.05;color:#E9D7AE;margin:0 0 18px}
.nf p{max-width:34em;font-size:1.0625rem;line-height:1.8;margin:0 0 32px}
.nf a{color:#B8894B;text-decoration:none}
.nf a:hover{color:#E9D7AE}
`,
        }}
      />
      <div className="nf">
        <h1>Diese Seite gibt es nicht</h1>
        <p>
          Der Link führt ins Leere. Falls du über einen gedruckten QR-Code hierher
          gekommen bist, prüfe die Adresse Zeichen für Zeichen.
        </p>
        <p>
          <a href="/">Zur Startseite</a>
        </p>
      </div>
    </>
  );
}
