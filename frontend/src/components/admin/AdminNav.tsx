import {
  ChefHat,
  Compass,
  Film,
  Globe,
  Images,
  LayoutDashboard,
  MessageSquare,
  Phone,
  Settings,
  ShoppingBag,
  Star,
  UserRound,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { AdminTabId } from "@/types/admin";

export interface AdminSubTabItem {
  id: AdminTabId;
  label: string;
  icon?: LucideIcon;
}

export interface AdminTabItem {
  id: AdminTabId;
  label: string;
  icon: LucideIcon;
  children?: AdminSubTabItem[];
}

export const ADMIN_TABS: AdminTabItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "settings", label: "Site Settings", icon: Settings },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "reviews", label: "Reviews", icon: Star },
  {
    id: "gallery",
    label: "Gallery",
    icon: Images,
    children: [
      { id: "gallery-customers", label: "Customers", icon: Users },
      { id: "gallery-kitchen", label: "Kitchen", icon: ChefHat },
      { id: "gallery-journey", label: "Journey", icon: Compass },
      { id: "gallery-media", label: "Gallery Media", icon: Film },
    ],
  },
  { id: "social", label: "Social", icon: Globe },
  { id: "about", label: "About", icon: UserRound },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "contact-messages", label: "Contact Messages", icon: MessageSquare },
  { id: "orders", label: "Orders", icon: ShoppingBag },
];
