import { useEffect, useState } from "react";
import { HeartPulse, ShieldCheck, Target } from "lucide-react";
import { supabase } from "../lib/supabase";
import { mediaUrl, type Row } from "../lib/content";

export default function About() {
  const [profile,setProfile]=useState<Row|null>(null);
  useEffect(()=>{supabase.from("health_profile").select("*").limit(1).maybeSingle().then(({data})=>setProfile(data));},[]);
  const photo=profile&&mediaUrl(profile,"avatar_url","photo_url","image_url");
  return <main className="simple-page about-page"><div className="container">
    <span className="section-label">About the Health Teacher</span>
    <div className="about-grid">
      <div className="about-photo">{photo?<img src={photo} alt={profile?.full_name||"Punutie Health Teacher"}/>:<HeartPulse size={80}/>}</div>
      <div><h1>{profile?.full_name||"PUNUTIE HEALTH TEACHER"}</h1><p className="about-role">{profile?.title||"Community Health Education & Consultancy"}</p><p>{profile?.bio||profile?.biography||"A community-focused platform sharing practical health education, prevention advice and trusted health information."}</p>
      <div className="about-points"><div><ShieldCheck/><span><strong>Mission</strong>{profile?.mission||"Make useful health education easier to understand and access."}</span></div><div><Target/><span><strong>Goals</strong>{profile?.goals||"Promote prevention, informed choices and healthier communities."}</span></div></div></div>
    </div>
  </div></main>;
}
