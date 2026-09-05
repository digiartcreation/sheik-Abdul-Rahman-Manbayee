import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Ahlul Islam — இஸ்லாமிய அறிவின் வாயில் | manbayee.com",
  description:
    "குர்ஆன், ஹதீஸ், கொள்கை, சட்டங்கள், வரலாறு, மதங்கள் — தமிழில் இஸ்லாமிய அறிவை எளிமையாக புரிந்துகொள்ளுங்கள்.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ta" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
