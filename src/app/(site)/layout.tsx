import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyOrderBar } from "@/components/sections/StickyOrderBar";
import { MotionProvider } from "@/providers/MotionProvider";
import { CartProvider } from "@/context/CartContext";
import { AccountProvider } from "@/providers/AccountProvider";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <CartProvider>
        <AccountProvider>
          <div className="pb-[89px] md:pb-0">
            <Navbar />
            <main>{children}</main>
            <Footer />
            <StickyOrderBar />
          </div>
        </AccountProvider>
      </CartProvider>
    </MotionProvider>
  );
}
