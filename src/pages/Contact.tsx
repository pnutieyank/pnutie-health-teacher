import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Row } from "../lib/content";

export default function Contact() {
  const [settings,setSettings]=useState<Row|null>(null);
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [question,setQuestion]=useState("");
  const [status,setStatus]=useState(""); const [saving,setSaving]=useState(false);
  useEffect(()=>{supabase.from("contact_settings").select("*").limit(1).maybeSingle().then(({data})=>setSettings(data));},[]);
  async function submit(e:FormEvent){e.preventDefault(); if(!name.trim()||!question.trim())return setStatus("Please enter your name and question."); setSaving(true); setStatus("");
    const {error}=await supabase.from("health_questions").insert({name:name.trim(),email:email.trim()||null,question:question.trim()});
    setSaving(false); if(error)setStatus(error.message); else {setStatus("Your question has been sent privately.");setName("");setEmail("");setQuestion("");}
  }
  const phone=settings?.phone||settings?.phone_number||""; const emailAddress=settings?.email||settings?.email_address||""; const whatsapp=settings?.whatsapp||settings?.whatsapp_number||""; const google=settings?.google_business_url||settings?.google_business_profile_url||"";
  return <main className="simple-page contact-page"><div className="container"><span className="section-label">Get in touch</span><h1>Contact PUNUTIE HEALTH TEACHER</h1><p>Reach out for health education information or send a private question.</p>
    <div className="contact-grid"><div className="contact-cards">
      {whatsapp&&<a className="contact-card" href={whatsapp.startsWith("http")?whatsapp:`https://wa.me/${whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noreferrer"><MessageCircle/><span><strong>WhatsApp</strong>Chat with us</span></a>}
      {phone&&<a className="contact-card" href={`tel:${phone}`}><Phone/><span><strong>Phone</strong>{phone}</span></a>}
      {emailAddress&&<a className="contact-card" href={`mailto:${emailAddress}`}><Mail/><span><strong>Email</strong>{emailAddress}</span></a>}
      {google&&<a className="contact-card" href={google} target="_blank" rel="noreferrer"><span><strong>Google Business Profile</strong>View on Google</span></a>}
    </div>
    <form className="question-form" onSubmit={submit}><h2>Ask the Health Teacher</h2><p>Your question is sent privately to the admin.</p><label>Name<input value={name} onChange={e=>setName(e.target.value)} required/></label><label>Email (optional)<input type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Your question<textarea rows={7} value={question} onChange={e=>setQuestion(e.target.value)} required/></label>{status&&<div className="form-status">{status}</div>}<button className="btn btn-primary" disabled={saving}><Send size={17}/>{saving?"Sending…":"Send Question"}</button></form>
    </div></div></main>;
}
