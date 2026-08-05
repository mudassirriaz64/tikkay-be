import { MotionConfig } from "framer-motion";
import { getGalleryPageData } from "@/lib/data/getGallery";
import { GalleryHero } from "@/components/sections/gallery/GalleryHero";
import { GalleryNavigation } from "@/components/sections/gallery/GalleryNavigation";
import { CustomerStories } from "@/components/sections/gallery/CustomerStories";
import { KitchenStories } from "@/components/sections/gallery/KitchenStories";
import { BrandJourney } from "@/components/sections/gallery/BrandJourney";
import { PhotoGallery } from "@/components/sections/gallery/PhotoGallery";
import { GalleryCTA } from "@/components/sections/gallery/GalleryCTA";

export const metadata = {
  title: "Gallery & Stories - Tikkay Shikkay",
  description:
    "Step inside Tikkay Shikkay - customer stories, behind the scenes, the journey of Pakistan's first BBQ brand, and a gallery of every memory made at the coals.",
};

export default async function GalleryPage() {
  const data = await getGalleryPageData();

  return (
    <div className="bg-[var(--bg-base)]">
      <MotionConfig reducedMotion="user">
        <GalleryHero data={data.hero} />
        <GalleryNavigation tabs={data.tabs} />
        <CustomerStories
          videos={data.videos}
          instagram={data.instagram}
          googleReviews={data.googleReviews}
          stories={data.stories}
        />
        <KitchenStories kitchen={data.kitchen} />
        <BrandJourney journey={data.journey} />
        <PhotoGallery gallery={data.gallery} categories={data.galleryCategories} />
        <GalleryCTA data={data.cta} />
      </MotionConfig>
    </div>
  );
}
