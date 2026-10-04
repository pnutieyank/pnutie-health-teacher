import { Play, Headphones, ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { cleanText, dateLabel, mediaUrl, type Row } from "../lib/content";

export default function MediaCard({ row, kind }: { row: Row; kind: "video" | "audio" | "post" }) {
  const image = mediaUrl(row, "thumbnail_url", "image_url", "cover_url");
  const media = mediaUrl(row, "video_url", "audio_url", "media_url", "url");
  const title = row.title || "Health education";
  const category = row.categories?.name || row.category_name || "Health Education";
  const icon = kind === "video" ? <Play size={22} fill="currentColor" /> : kind === "audio" ? <Headphones size={22} /> : <ArrowRight size={22} />;
  return (
    <article className="media-card">
      <div className="media-card-cover">
        {image ? <img src={image} alt="" loading="lazy" /> : <div className="media-cover-fallback">{icon}</div>}
        {kind !== "post" && media && <span className="media-kind">{kind === "video" ? "Video" : "Audio"}</span>}
      </div>
      <div className="media-card-body">
        <span className="tag">{category}</span>
        <h3>{title}</h3>
        <p>{row.excerpt || cleanText(row.description || row.content).slice(0, 150) || "Educational health information from PUNUTIE HEALTH TEACHER."}</p>
        <div className="media-card-footer">
          <span><CalendarDays size={14} /> {dateLabel(row.published_at || row.created_at)}</span>
          {kind === "post" && <Link className="text-link" to={`/talks/${row.id}`}>Read <ArrowRight size={15} /></Link>}
        </div>
      </div>
    </article>
  );
}
