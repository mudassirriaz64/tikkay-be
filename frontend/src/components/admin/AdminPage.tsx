"use client";

import { useState } from "react";
import { AdminTabId } from "@/types/admin";
import { AdminShell } from "./AdminShell";
import { OverviewModule } from "./modules/OverviewModule";
import { SettingsModule } from "./modules/SettingsModule";
import { MenuModule } from "./modules/MenuModule";
import { ReviewsModule } from "./modules/ReviewsModule";
import { GalleryModule, GalleryTabKey } from "./modules/GalleryModule";
import { SocialModule } from "./modules/SocialModule";
import { AboutModule } from "./modules/AboutModule";
import { ContactModule } from "./modules/ContactModule";
import { OrdersModule } from "./modules/OrdersModule";

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTabId>("dashboard");

  // Determine Gallery subtab if navigating directly from sidebar
  const gallerySubTab: GalleryTabKey =
    activeTab === "gallery-customers"
      ? "customers"
      : activeTab === "gallery-kitchen"
      ? "kitchen"
      : activeTab === "gallery-journey"
      ? "journey"
      : "media";

  return (
    <AdminShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && <OverviewModule onNavigate={setActiveTab} />}
      {activeTab === "settings" && <SettingsModule />}
      {activeTab === "menu" && <MenuModule />}
      {activeTab === "reviews" && <ReviewsModule />}
      {(activeTab === "gallery" ||
        activeTab === "gallery-customers" ||
        activeTab === "gallery-kitchen" ||
        activeTab === "gallery-journey" ||
        activeTab === "gallery-media") && (
        <GalleryModule
          key={gallerySubTab}
          initialSubTab={gallerySubTab}
          onSubTabChange={(sub) => setActiveTab(`gallery-${sub}` as AdminTabId)}
        />
      )}
      {activeTab === "social" && <SocialModule />}
      {activeTab === "about" && <AboutModule />}
      {activeTab === "contact" && <ContactModule />}
      {activeTab === "orders" && <OrdersModule />}
    </AdminShell>
  );
}
