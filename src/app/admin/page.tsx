import { MotionConfig } from "framer-motion";
import { getAdminPageData } from "@/lib/data/getAdminPageData";
import { AdminDataProvider } from "@/providers/AdminDataProvider";
import { AdminPage } from "@/components/admin/AdminPage";
import { CartProvider } from "@/context/CartContext";
import { AccountProvider } from "@/providers/AccountProvider";

export const metadata = {
  title: "Admin Studio - Tikkay Shikkay",
  description:
    "Manage every plate, post and promise at Tikkay Shikkay from one dashboard.",
};

export default async function AdminRoute() {
  const data = await getAdminPageData();

  return (
    <div className="bg-[var(--bg-base)]">
      <MotionConfig reducedMotion="user">
        <CartProvider>
          <AccountProvider>
            <AdminDataProvider initialData={data}>
              <AdminPage />
            </AdminDataProvider>
          </AccountProvider>
        </CartProvider>
      </MotionConfig>
    </div>
  );
}
