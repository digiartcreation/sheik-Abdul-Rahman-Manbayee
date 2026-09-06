import CategoryTabs from "@/components/CategoryTabs";
import { divisions } from "@/lib/divisions";
import { getAllContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "பிரிவுகள் — Ahlul Islam",
  description:
    "குர்ஆன், ஹதீஸ், கொள்கை, சட்டங்கள், வரலாறு, மதங்கள் — பிரிவுகள் படி கட்டுரைகளை படிக்கலாம்.",
};

export default async function PirivugalPage({ searchParams }) {
  // ?cat= lets the home page deep-link straight to a division.
  const { cat } = await searchParams;
  const requested = divisions.some((d) => d.key === cat) ? cat : divisions[0].key;
  const articles = await getAllContent();

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: "relative" }}>
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>Browse by Category</p>
          <h1>பிரிவுகள் படி தேடுக</h1>
          <p>குர்ஆன், ஹதீஸ், கொள்கை, சட்டங்கள் மற்றும் பல பிரிவுகளில் கட்டுரைகளை படிக்கலாம்.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <CategoryTabs articles={articles} initialDivision={requested} />
        </div>
      </section>
    </>
  );
}
