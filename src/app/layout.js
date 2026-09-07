import "./globals.css";
import { Noto_Sans_Tamil, Inter, Amiri } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollTop from "@/components/ScrollTop";

// Self-hosted by next/font: no render-blocking request to fonts.googleapis.com
// and no layout shift, because the metrics are inlined at build time.
const tamil = Noto_Sans_Tamil({
  subsets: ["tamil", "latin"],
  display: "swap",
  variable: "--font-noto-tamil",
});

const ui = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Amiri is not a variable font, so the weights have to be listed.
const arabic = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
});

export const metadata = {
  metadataBase: new URL("https://manbayee.com"),
  title: {
    default: "Ahlul Islam — இஸ்லாமிய அறிவின் வாயில் | manbayee.com",
    template: "%s | Ahlul Islam",
  },
  description:
    "குர்ஆன், ஹதீஸ், கொள்கை, சட்டங்கள், வரலாறு, மதங்கள் — தமிழில் இஸ்லாமிய அறிவை எளிமையாக புரிந்துகொள்ளுங்கள்.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ta_IN",
    siteName: "Ahlul Islam",
    title: "Ahlul Islam — இஸ்லாமிய அறிவின் வாயில்",
    description:
      "குர்ஆன், ஹதீஸ், கொள்கை, சட்டங்கள், வரலாறு, மதங்கள் — தமிழில்.",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F3EE" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1628" },
  ],
};

/**
 * Applies the saved theme before the first paint. Without this the page renders
 * light, then swaps to dark once React hydrates — a visible flash on every load.
 */
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('manbayee-theme');
    if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="ta"
      suppressHydrationWarning
      className={`${tamil.variable} ${ui.variable} ${arabic.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          உள்ளடக்கத்திற்கு செல்ல
        </a>
        <ThemeProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <ScrollTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
