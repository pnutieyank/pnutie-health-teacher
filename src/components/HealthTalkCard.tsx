import { ArrowRight, CalendarDays, HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";
import { cleanText, dateLabel } from "../lib/content";

export default function HealthTalkCard({ post }: { post: any }) {
  const category=post.categories?.[0]?.name||post.category_name||"Health Education";
  return <article className="health-talk-card"><div className="health-talk-image">{post.image_url?<img src={post.image_url} alt={post.title} loading="lazy"/>:<div className="health-talk-image-placeholder"><HeartPulse size={42}/></div>}{post.featured&&<span className="health-talk-featured">Featured</span>}</div><div className="health-talk-content"><span className="tag">{category}</span><h2>{post.title}</h2><p>{post.excerpt||cleanText(post.content).slice(0,150)||"Read this health education talk from PUNUTIE HEALTH TEACHER."}{cleanText(post.content).length>150?"…":""}</p><div className="health-talk-meta"><span><CalendarDays size={15}/>{dateLabel(post.published_at||post.created_at)}</span><Link to={`/talks/${post.id}`} className="text-link">Read talk<ArrowRight size={16}/></Link></div></div></article>;
}
