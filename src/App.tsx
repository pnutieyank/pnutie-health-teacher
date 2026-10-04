import PunutiAI from "./components/PunutiAI";
import { BrowserRouter, Routes, Route, NavLink, useLocation, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { HeartPulse, Menu, X, MessageCircle, ArrowRight, ShieldCheck, Activity, Stethoscope, Apple, Baby, Brain, Siren, Play, Sparkles } from "lucide-react";
import AdminGuard from "./admin/components/AdminGuard";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import HealthTalks from "./pages/HealthTalks";
import HealthTalkDetail from "./pages/HealthTalkDetail";
import Videos from "./pages/Videos";
import AudioTalks from "./pages/AudioTalks";
import Articles from "./pages/Articles";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { supabase } from "./lib/supabase";
import { mediaUrl, type Row } from "./lib/content";
import "./index.css";

const categoryIcons=[ShieldCheck,Apple,Activity,HeartPulse,Baby,Brain,Siren,Stethoscope];
const fallbackCategories=["Malaria Prevention","Nutrition & Diet","Diabetes","Hypertension","Child Health","Mental Health","First Aid","Community Health"];

function Header(){
 const [open,setOpen]=useState(false); const [whatsapp,setWhatsapp]=useState("");
 useEffect(()=>{supabase.from("contact_settings").select("*").limit(1).maybeSingle().then(({data})=>{const v=data?.whatsapp||data?.whatsapp_number||"";setWhatsapp(v?String(v):"");});},[]);
 const wa=whatsapp.startsWith("http")?whatsapp:`https://wa.me/${whatsapp.replace(/\D/g,"")}`;
 return <header className="site-header"><div className="container nav-container"><NavLink to="/" className="brand" onClick={()=>setOpen(false)}><span className="brand-icon"><HeartPulse size={24}/></span><span><strong>PUNUTIE</strong><small>HEALTH TEACHER</small></span></NavLink><button className="mobile-menu" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button><nav className={open?"main-nav open":"main-nav"}>{[["Home","/"],["Health Talks","/talks"],["Videos","/videos"],["Audio Talks","/audio"],["Articles","/articles"],["About","/about"],["Contact","/contact"]].map(([l,p])=><NavLink key={p} to={p} onClick={()=>setOpen(false)} className={({isActive})=>isActive?"active":""}>{l}</NavLink>)}</nav>{whatsapp&&<a className="header-whatsapp" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={18}/>WhatsApp</a>}</div></header>;
}

function Home(){
 const [posts,setPosts]=useState<Row[]>([]); const [videos,setVideos]=useState<Row[]>([]); const [tip,setTip]=useState<Row|null>(null); const [cats,setCats]=useState<Row[]>([]);
 useEffect(()=>{Promise.all([supabase.from("posts").select("*").eq("published",true).order("published_at",{ascending:false,nullsFirst:false}).limit(3),supabase.from("videos").select("*").eq("published",true).order("published_at",{ascending:false,nullsFirst:false}).limit(3),supabase.from("health_tips").select("*").order("created_at",{ascending:false,nullsFirst:false}).limit(1),supabase.from("categories").select("*").order("name")]).then(([p,v,t,c])=>{setPosts(p.data||[]);setVideos(v.data||[]);setTip(t.data?.[0]||null);setCats(c.data||[]);});},[]);
 return <><section className="hero"><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow"><HeartPulse size={17}/>Community Health Education</div><h1>Better health begins with <span>better knowledge.</span></h1><p>Welcome to PUNUTIE HEALTH TEACHER — a community-focused platform sharing practical health education, prevention tips, wellness guidance and trusted health information.</p><div className="hero-actions"><NavLink to="/talks" className="btn btn-primary">Explore Health Talks<ArrowRight size={18}/></NavLink><NavLink to="/about" className="btn btn-secondary">Meet the Health Teacher</NavLink></div><div className="hero-trust"><div><ShieldCheck size={20}/><span>Education-focused</span></div><div><Activity size={20}/><span>Prevention-focused</span></div></div></div><div className="hero-profile"><div className="profile-ring"><div className="profile-placeholder"><HeartPulse size={90}/><span>Punutie</span><small>Health Teacher</small></div></div><div className="floating-card floating-card-one"><Sparkles size={20}/><span><strong>Today's Health Tip</strong>Fresh educational guidance.</span></div><div className="floating-card floating-card-two"><ShieldCheck size={20}/>Trusted Health Education</div></div></div></section>
 <section className="stats-section"><div className="container stats-grid"><div><strong>{posts.length}</strong><span>Recent Health Talks</span></div><div><strong>{cats.length||8}+</strong><span>Health Categories</span></div><div><strong>{videos.length}</strong><span>Featured Videos</span></div><div><strong>Community</strong><span>Focused Education</span></div></div></section>
 <section className="section"><div className="container"><div className="section-heading"><div><span className="section-label">Explore</span><h2>Health topics that matter</h2></div><p>Simple educational resources designed to help you understand important health topics.</p></div><div className="category-grid">{(cats.length?cats:fallbackCategories.map((name,i)=>({id:String(i),name}))).map((c,i)=>{const Icon=categoryIcons[i%categoryIcons.length];return <NavLink to={`/talks?category=${encodeURIComponent(c.id)}`} className="category-card" key={c.id}><span className="category-icon"><Icon size={23}/></span><span>{c.name}</span><ArrowRight size={17}/></NavLink>})}</div></div></section>
 <section className="section featured-section"><div className="container"><div className="section-heading"><div><span className="section-label">Latest</span><h2>Health talks</h2></div><NavLink to="/talks" className="text-link">View all talks <ArrowRight size={16}/></NavLink></div>{posts.length?<div className="health-talk-grid">{posts.map(p=><article className="health-talk-card" key={p.id}><div className="health-talk-image">{p.image_url?<img src={p.image_url} alt="" loading="lazy"/>:<div className="health-talk-image-placeholder"><HeartPulse size={42}/></div>}</div><div className="health-talk-content"><span className="tag">Health Education</span><h2>{p.title}</h2><p>{p.excerpt||String(p.content||"").replace(/<[^>]*>/g,"").slice(0,150)}</p><NavLink className="text-link" to={`/talks/${p.id}`}>Read talk <ArrowRight size={16}/></NavLink></div></article>)}</div>:<div className="content-state"><h2>Health talks are coming soon</h2><p>Published content will automatically appear here.</p></div>}</div></section>
 <section className="section video-section"><div className="container"><div className="section-heading"><div><span className="section-label">Watch & Learn</span><h2>Health videos</h2></div><NavLink to="/videos" className="text-link">View videos <ArrowRight size={16}/></NavLink></div>{videos.length?<div className="media-grid">{videos.map(v=><article className="media-card" key={v.id}><div className="media-card-cover">{v.thumbnail_url?<img src={v.thumbnail_url} alt="" loading="lazy"/>:<div className="media-cover-fallback"><Play size={26}/></div>}</div><div className="media-card-body"><span className="tag">Health Video</span><h3>{v.title}</h3><p>{v.description||"Health education video."}</p>{mediaUrl(v,"video_url","media_url","url")&&<video className="mini-video" controls src={mediaUrl(v,"video_url","media_url","url")}/>}</div></article>)}</div>:<div className="content-state"><h2>Videos are coming soon</h2></div>}</div></section>
 <section className="tip-section"><div className="container tip-box"><div className="tip-icon"><HeartPulse size={30}/></div><div><span>Today's Health Tip</span><h2>{tip?.title||"Don't ignore changes in your health."}</h2><p>{tip?.content||"If something concerns you, seek advice from a qualified healthcare professional."}</p></div></div></section>
 <section className="cta-section"><div className="container cta-box"><div><span className="section-label">Have a question?</span><h2>Ask the Health Teacher</h2><p>Send your health education question privately through our question form.</p></div><NavLink to="/contact" className="btn btn-light">Ask a Question<ArrowRight size={18}/></NavLink></div></section></>;
}

function Tracker(){
 const location=useLocation(); useEffect(()=>{supabase.from("page_views").insert({path:location.pathname, user_agent:navigator.userAgent}).then(()=>{});},[location.pathname]); return null;
}
function FloatingWhatsApp(){const [wa,setWa]=useState("");useEffect(()=>{supabase.from("contact_settings").select("*").limit(1).maybeSingle().then(({data})=>{const v=data?.whatsapp||data?.whatsapp_number||"";setWa(v?String(v):"");});},[]);if(!wa)return null;const href=wa.startsWith("http")?wa:`https://wa.me/${wa.replace(/\D/g,"")}`;return <a className="floating-whatsapp" href={href} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle size={25}/></a>}
function Footer(){return <footer className="footer"><div className="container footer-grid"><div><div className="brand footer-brand"><span className="brand-icon"><HeartPulse size={22}/></span><span><strong>PUNUTIE</strong><small>HEALTH TEACHER</small></span></div><p>Community health education and consultancy focused on helping people make informed health decisions.</p></div><div><h3>Explore</h3><NavLink to="/talks">Health Talks</NavLink><NavLink to="/videos">Videos</NavLink><NavLink to="/audio">Audio Talks</NavLink><NavLink to="/articles">Articles</NavLink></div><div><h3>Important</h3><NavLink to="/about">About</NavLink><NavLink to="/contact">Contact</NavLink></div></div><div className="container footer-bottom"><p>Information provided on this website is for educational purposes only and should not replace professional medical diagnosis, treatment, or emergency care.</p><span>© {new Date().getFullYear()} PUNUTIE HEALTH TEACHER</span></div></footer>}

function PublicLayout(){
  return (
    <>
      <Header/>
      <Outlet/>
      <FloatingWhatsApp/>
      <Footer/>
      <PunutiAI/>
    </>
  );
}
export default function App(){return <BrowserRouter><Tracker/><Routes><Route path="/admin/login" element={<AdminLogin/>}/><Route element={<AdminGuard/>}><Route path="/admin" element={<AdminDashboard/>}/></Route><Route element={<PublicLayout/>}><Route path="/" element={<Home/>}/><Route path="/talks" element={<HealthTalks/>}/><Route path="/talks/:id" element={<HealthTalkDetail/>}/><Route path="/videos" element={<Videos/>}/><Route path="/audio" element={<AudioTalks/>}/><Route path="/articles" element={<Articles/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/></Route></Routes></BrowserRouter>}
