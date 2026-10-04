import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, Play, Headphones, FileText } from "lucide-react";
import { supabase } from "../lib/supabase";
import MediaCard from "../components/MediaCard";
import { mediaUrl, type Row } from "../lib/content";

export default function CollectionPage({ kind, title, description }: { kind: "video"|"audio"|"article"; title: string; description: string }) {
  const table = kind === "video" ? "videos" : kind === "audio" ? "audio_talks" : "posts";
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    let query: any = supabase.from(table).select("*");
    if (table !== "posts") query = query.eq("published", true);
    else query = query.eq("published", true);
    const { data, error: e } = await query.order("published_at", { ascending: false, nullsFirst: false });
    if (e) { setError(e.message); setRows([]); } else setRows(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [table]);

  const filtered = useMemo(() => rows.filter(r => `${r.title || ""} ${r.description || ""} ${r.content || ""}`.toLowerCase().includes(q.toLowerCase())), [rows,q]);
  const icon = kind === "video" ? <Play size={28}/> : kind === "audio" ? <Headphones size={28}/> : <FileText size={28}/>;

  return <main className="collection-page">
    <div className="container">
      <div className="page-hero"><span className="section-label">PUNUTIE HEALTH TEACHER</span><div className="page-hero-icon">{icon}</div><h1>{title}</h1><p>{description}</p></div>
      <div className="talks-toolbar"><div className="talks-search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`}/></div><button className="btn btn-secondary" onClick={load}><RefreshCw size={16}/> Refresh</button></div>
      {loading && <div className="content-state">Loading content…</div>}
      {!loading && error && <div className="content-state error"><p>We couldn't load this section.</p><small>{error}</small><button className="btn btn-primary" onClick={load}>Try again</button></div>}
      {!loading && !error && !filtered.length && <div className="content-state"><h2>No content yet</h2><p>Published {title.toLowerCase()} will appear here.</p></div>}
      {!loading && !error && filtered.length > 0 && <div className="media-grid">{filtered.map(row => <MediaCard key={row.id} row={row} kind={kind==="article"?"post":kind}/>)}</div>}
      {kind === "video" && filtered.map(row => mediaUrl(row,"video_url","media_url","url") && <div className="inline-player" key={`player-${row.id}`}><video controls preload="metadata" src={mediaUrl(row,"video_url","media_url","url")} poster={mediaUrl(row,"thumbnail_url","image_url")}/></div>)}
      {kind === "audio" && filtered.map(row => mediaUrl(row,"audio_url","media_url","url") && <div className="audio-row" key={`audio-${row.id}`}><strong>{row.title}</strong><audio controls src={mediaUrl(row,"audio_url","media_url","url")}/></div>)}
    </div>
  </main>;
}
