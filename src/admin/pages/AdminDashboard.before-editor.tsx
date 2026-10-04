import { useEffect, useState } from "react";
import { BarChart3, FileText, Film, Headphones, Lightbulb, FolderTree, UserRound, MessageSquare, Settings, LogOut, LayoutDashboard, Plus, Trash2, Edit3, RefreshCw, Upload } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Menu = {label:string; icon:any; table?:string; fields?:string[]};
const menu:Menu[]=[
 {label:"Dashboard",icon:LayoutDashboard},
 {label:"Health Talks",icon:FileText,table:"posts",fields:["title","excerpt","content","image_url","category_id"]},
 {label:"Videos",icon:Film,table:"videos",fields:["title","description","video_url","thumbnail_url","category_id"]},
 {label:"Audio Talks",icon:Headphones,table:"audio_talks",fields:["title","description","audio_url","category_id"]},
 {label:"Health Tips",icon:Lightbulb,table:"health_tips",fields:["title","content"]},
 {label:"Categories",icon:FolderTree,table:"categories",fields:["name","description"]},
 {label:"Health Profile",icon:UserRound,table:"health_profile",fields:["full_name","title","bio","mission","goals","avatar_url"]},
 {label:"Questions",icon:MessageSquare,table:"health_questions",fields:["name","email","question"]},
 {label:"Analytics",icon:BarChart3,table:"page_views"},
 {label:"Settings",icon:Settings,table:"contact_settings"},
];

function MediaUpload({field,value,onChange,setMessage}:{field:string;value:string;onChange:(v:string)=>void;setMessage:(v:string)=>void}){
 const [busy,setBusy]=useState(false);
 const bucket=field==="video_url"?"videos":field==="audio_url"?"audio":field==="avatar_url"?"avatars":"images";
 async function upload(file:File){
   setBusy(true);setMessage("");
   const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"-");
   const path=`${Date.now()}-${safe}`;
   const {error}=await supabase.storage.from(bucket).upload(path,file,{upsert:false});
   if(error){setMessage(`Upload failed: ${error.message}. Make sure the ${bucket} storage bucket and its admin upload policy exist.`);setBusy(false);return;}
   const {data}=supabase.storage.from(bucket).getPublicUrl(path);
   onChange(data.publicUrl);setBusy(false);
 }
 return <div className="media-upload"><input value={value??""} onChange={e=>onChange(e.target.value)} placeholder="Paste a URL or upload a file"/><label className="upload-button"><Upload size={15}/>{busy?"Uploading…":"Upload"}<input type="file" accept={field==="video_url"?"video/*":field==="audio_url"?"audio/*":"image/*"} onChange={e=>{const f=e.target.files?.[0];if(f)upload(f)}} hidden/></label></div>;
}

function Manager({item}:{item:Menu}) {
 const table=item.table!; const [rows,setRows]=useState<any[]>([]); const [loading,setLoading]=useState(true); const [editing,setEditing]=useState<any|null>(null); const [message,setMessage]=useState(""); const [saving,setSaving]=useState(false);
 async function load(){setLoading(true);let query:any=supabase.from(table).select("*");if(["posts","videos","audio_talks","health_tips","health_questions","page_views"].includes(table))query=query.order("created_at",{ascending:false,nullsFirst:false});const {data,error}=await query;if(error)setMessage(error.message);else setRows(data||[]);setLoading(false);}
 useEffect(()=>{load()},[table]);
 async function save(){if(!editing)return;setSaving(true);setMessage("");const payload={...editing};delete payload.id;delete payload.created_at;delete payload.updated_at;
   if(["posts","videos","audio_talks"].includes(table)){payload.published=Boolean(payload.published);if(payload.published&&!payload.published_at)payload.published_at=new Date().toISOString();}
   const result=editing.id?await supabase.from(table).update(payload).eq("id",editing.id):await supabase.from(table).insert(payload);
   if(result.error)setMessage(result.error.message);else{setMessage("Saved successfully.");setEditing(null);await load();}setSaving(false);
 }
 async function remove(id:string){if(!confirm("Delete this item permanently?"))return;const {error}=await supabase.from(table).delete().eq("id",id);if(error)setMessage(error.message);else await load();}
 if(table==="page_views") return <div className="admin-module"><div className="admin-module-header"><div><h1>Analytics</h1><p>Recent page-view records from the public site.</p></div><button className="admin-secondary-button" onClick={load}><RefreshCw size={16}/>Refresh</button></div>{loading?<div className="admin-loading">Loading…</div>:<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Page</th><th>Created</th><th>Visitor</th></tr></thead><tbody>{rows.slice(0,100).map(r=><tr key={r.id}><td>{r.path||r.page_path||"—"}</td><td>{r.created_at?new Date(r.created_at).toLocaleString("en-GH"):"—"}</td><td>{r.user_agent?String(r.user_agent).slice(0,60):"Anonymous"}</td></tr>)}</tbody></table></div>}</div>;
 const fields=item.fields||[];
 return <div className="admin-module"><div className="admin-module-header"><div><h1>{item.label}</h1><p>Manage {item.label.toLowerCase()} and publish changes to the public website.</p></div><div className="admin-actions"><button className="admin-secondary-button" onClick={load}><RefreshCw size={16}/>Refresh</button><button className="admin-primary-button" onClick={()=>setEditing({})}><Plus size={17}/>New</button></div></div>{message&&<div className="admin-message">{message}</div>}
 {loading?<div className="admin-loading">Loading…</div>:<div className="admin-table-wrap"><table className="admin-table"><thead><tr>{fields.slice(0,4).map(f=><th key={f}>{f.replaceAll("_"," ")}</th>)}<th>Actions</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}>{fields.slice(0,4).map(f=><td key={f}>{typeof r[f]==="boolean"?(r[f]?"Yes":"No"):String(r[f]??"—").slice(0,90)}</td>)}<td><div className="admin-row-actions"><button className="icon-action" onClick={()=>setEditing({...r})}><Edit3 size={16}/></button><button className="icon-action danger" onClick={()=>remove(r.id)}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div>}
 {editing&&<div className="admin-modal-backdrop"><div className="admin-modal"><div className="admin-modal-header"><div><h2>{editing.id?"Edit":"Create"} {item.label}</h2><p>Changes are saved directly to Supabase.</p></div><button className="icon-action" onClick={()=>setEditing(null)}>×</button></div><div className="admin-form">{fields.map(f=><label key={f}>{f.replaceAll("_"," ")}{["image_url","thumbnail_url","video_url","audio_url","avatar_url"].includes(f)?<MediaUpload field={f} value={editing[f]??""} onChange={v=>setEditing({...editing,[f]:v})} setMessage={setMessage}/>:f==="content"||f==="description"||f==="bio"||f==="mission"||f==="goals"||f==="question"?<textarea rows={f==="content"||f==="question"?8:4} value={editing[f]??""} onChange={e=>setEditing({...editing,[f]:e.target.value})}/>:<input value={editing[f]??""} onChange={e=>setEditing({...editing,[f]:e.target.value})}/>}</label>)}{["posts","videos","audio_talks"].includes(table)&&<><label className="checkbox-label"><input type="checkbox" checked={Boolean(editing.published)} onChange={e=>setEditing({...editing,published:e.target.checked})}/> Published</label><label className="checkbox-label"><input type="checkbox" checked={Boolean(editing.featured)} onChange={e=>setEditing({...editing,featured:e.target.checked})}/> Featured</label></>}<div className="admin-form-actions"><button className="admin-secondary-button" onClick={()=>setEditing(null)}>Cancel</button><button className="admin-primary-button" disabled={saving} onClick={save}>{saving?"Saving…":"Save changes"}</button></div></div></div></div>}
 </div>;
}

export default function AdminDashboard(){
 const [active,setActive]=useState("Dashboard"); const [stats,setStats]=useState<Record<string,number>>({});
 useEffect(()=>{Promise.all(["posts","videos","audio_talks","health_questions","categories"].map(async t=>{const {count}=await supabase.from(t).select("*",{count:"exact",head:true});return [t,count||0] as const})).then(v=>setStats(Object.fromEntries(v)));},[]);
 async function logout(){await supabase.auth.signOut();location.href="/admin/login";}
 const item=menu.find(m=>m.label===active)!;
 return <div className="admin-shell"><aside className="admin-sidebar"><div className="admin-brand"><span className="brand-icon">♥</span><div><strong>PUNUTIE</strong><small>HEALTH TEACHER</small></div></div><nav>{menu.map(m=><button key={m.label} className={active===m.label?"active":""} onClick={()=>setActive(m.label)}><m.icon size={18}/>{m.label}</button>)}</nav><button className="admin-logout" onClick={logout}><LogOut size={17}/>Sign out</button></aside><main className="admin-main"><div className="admin-topbar"><div><span className="section-label">Admin Portal</span><h1>{active}</h1></div><a href="/" target="_blank" rel="noreferrer" className="admin-secondary-button">View website</a></div>{active==="Dashboard"?<div className="admin-dashboard-home"><div className="admin-stat-grid">{[["Health Talks","posts"],["Videos","videos"],["Audio Talks","audio_talks"],["Questions","health_questions"],["Categories","categories"]].map(([label,key])=><div className="admin-stat-card" key={key}><span>{label}</span><strong>{stats[key]??0}</strong></div>)}</div><div className="admin-panel"><h2>Quick actions</h2><div className="quick-actions">{menu.filter(m=>m.table&&m.label!=="Analytics").map(m=><button key={m.label} onClick={()=>setActive(m.label)}><m.icon size={20}/><span>{m.label}<small>Open manager</small></span></button>)}</div></div></div>:item.table?<Manager item={item}/>:null}</main></div>;
}
