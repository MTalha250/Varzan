import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const bookman = localFont({
  src: "../fonts/bookman.ttf",
  variable: "--font-bookman",
});
const engravers = localFont({
  src: "../fonts/engravers.ttf",
  variable: "--font-engravers",
});
const embassy = localFont({
  src: "../fonts/embassy.ttf",
  variable: "--font-embassy",
});

export const metadata: Metadata = {
  title: "Varzan",
  description:
    "We bring your attention to Varzan, a name known for symbolizing elegance and luxury since the 1980s.The company offers manufacturing and whole sale for an immense range of eastern luxury, formals, Haute Couture, and bridal dresses delivered worldwide. We have not only gained trust among the retailers of Pakistan but also among retailers internationally. Our designs are a unique blend of feminine fragility and power that reflect traditional craftsmanship in a modern way. Our brand is known for the high-quality fabric, rich organic color story, and magnificent designs fused with sublime cuts and silhouettes defining the modern era through traditional manner. We have an ample amount of production capacity along with a vast variety of designs for all our categories with the best quality standards around. Our main variety includes bridal, maxi, gown, balochi, frock, shirt, cape, shari, talpatt, Dhaka Sharara, Gharara set, Uptan, mehndi, Peshwas with matha pati and semi stitch lite category.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${engravers.variable} ${bookman.variable} ${embassy.variable}`}
    >
      <body className={`${bookman.className} antialiased`}>
        <Navbar />
        {children}
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "",
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
