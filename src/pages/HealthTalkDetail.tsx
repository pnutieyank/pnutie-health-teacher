import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, HeartPulse } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { dateLabel, type Row } from "../lib/content";

export default function HealthTalkDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const { data } = await supabase.from("posts").select("*").eq("id", id).eq("published", true).maybeSingle();
      setPost(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <main className="simple-page"><div className="container"><div className="content-state">Loading health talk…</div></div></main>;
  if (!post) return <main className="simple-page"><div className="container"><div className="content-state"><HeartPulse size={34}/><h2>Health talk not found</h2><Link className="btn btn-primary" to="/talks">Back to Health Talks</Link></div></div></main>;

  return (
    <main className="article-page">
      <div className="container narrow">
        <Link to="/talks" className="back-link"><ArrowLeft size={17}/> All Health Talks</Link>
        <span className="section-label">PUNUTIE HEALTH TEACHER</span>
        <h1>{post.title}</h1>
        <div className="article-meta"><CalendarDays size={16}/> {dateLabel(post.published_at || post.created_at)}</div>
        {post.image_url && <img className="article-hero-image" src={post.image_url} alt={post.title}/>}
        {post.excerpt && <p className="article-lead">{post.excerpt}</p>}
        <div className="article-content">{post.content}</div>
      </div>
    </main>
  );
}
