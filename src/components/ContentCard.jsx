import Link from "next/link";
import { excerpt, formatDate } from "@/lib/format";

/** The article card used on the home page and the divisions page. */
export default function ContentCard({ item }) {
  return (
    <article className="content-card">
      {item.image && (
        <div className="content-card-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} loading="lazy" />
          <span className="content-card-badge">{item.category}</span>
        </div>
      )}
      <div className="content-card-body">
        <p className="content-card-meta">{formatDate(item.date)}</p>
        <h3>
          <Link href={`/katurai/${encodeURIComponent(item.id)}`}>{item.title}</Link>
        </h3>
        <p>{excerpt(item)}</p>
        <div className="content-card-footer">
          <span className="content-card-author">{item.author}</span>
          {item.views > 0 && <span className="content-card-views">👁 {item.views}</span>}
        </div>
      </div>
    </article>
  );
}
