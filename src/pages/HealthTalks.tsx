import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, HeartPulse, RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabase";
import HealthTalkCard from "../components/HealthTalkCard";

export default function HealthTalks() {
  const [posts,setPosts]=useState<any[]>([]); const [categories,setCategories]=useState<any[]>([]);
  const [params]=useSearchParams(); const [search,setSearch]=useState(""); const [category,setCategory]=useState(params.get("category")||""); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  async function load(){setLoading(true);setError("");const [p,c]=await Promise.all([supabase.from("posts").select("*").eq("published",true).order("published_at",{ascending:false,nullsFirst:false}),supabase.from("categories").select("*").order("name")]);if(p.error)setError(p.error.message);else setPosts(p.data||[]);if(!c.error)setCategories(c.data||[]);setLoading(false);}
  useEffect(()=>{load()},[]);
  const filtered=useMemo(()=>posts.filter(p=>{const text=`${p.title||""} ${p.excerpt||""} ${p.content||""}`.toLowerCase();return (!search||text.includes(search.toLowerCase()))&&(!category||p.category_id===category)}),[posts,search,category]);
  return <main className="collection-page"><div className="container"><div className="page-hero"><span className="section-label">PUNUTIE HEALTH TEACHER</span><div className="page-hero-icon"><HeartPulse size={30}/></div><h1>Health Talks</h1><p>Practical health education, prevention advice and community health information.</p></div>
  <div className="talks-toolbar"><div className="talks-search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search health talks…"/></div><div className="talks-filter"><SlidersHorizontal size={17}/><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div><button className="btn btn-secondary" onClick={load}><RefreshCw size={16}/> Refresh</button></div>
  {loading&&<div className="content-state">Loading health talks…</div>}{!loading&&error&&<div className="content-state error"><p>We couldn't load the health talks.</p><small>{error}</small><button className="btn btn-primary" onClick={load}>Try again</button></div>}{!loading&&!error&&!filtered.length&&<div className="content-state"><h2>No health talks found</h2><p>Published health talks will appear here.</p></div>}{!loading&&!error&&filtered.length>0&&<div className="health-talk-grid">{filtered.map(p=><HealthTalkCard key={p.id} post={{...p,categories:p.category_id?categories.filter(c=>c.id===p.category_id):[]}}/>)}</div>}</div></main>;
}
