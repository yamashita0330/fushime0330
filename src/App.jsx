import { useState, useEffect, useRef } from "react";

const GOALS = ["全身脱毛","部分脱毛","フェイシャル","ボディメイク","ダイエット","筋肉量アップ","ネイルケア","ブライダル準備","リフレッシュ"];
const HOW = ["口コミ・レビュー","紹介（紹介者あり）","SNS（Instagram・TikTok）","Google検索","チラシ・看板","家から近い","値段が安い","なんでもよかった","その他"];
const OCCUPATIONS = ["会社員（正社員）","会社員（派遣・契約）","公務員","自営業・フリーランス","経営者・役員","パート・アルバイト","学生","主婦・主夫","無職・求職中","その他"];
const TC = {
  gym:      { label:"ジム",        color:"#6C9E6E", light:"#EBF3EB", icon:"💪" },
  esthetic: { label:"エステ・脱毛", color:"#C9899A", light:"#F9EEF1", icon:"✨" },
  nail:     { label:"ネイル",      color:"#9B8EC4", light:"#F0EEF8", icon:"💅" },
};
const td = () => new Date().toISOString().slice(0,10);
const tt = () => new Date().toTimeString().slice(0,5);
const ts = () => new Date().toLocaleString("ja-JP");

const PRIVACY = `当店は、お客様からお預かりする個人情報を以下の目的のみに使用いたします。\n\n■ 利用目的\n・施術・トレーニングの提供および品質向上\n・スタッフ間での情報共有（お客様のお体への配慮）\n・ご予約・ご連絡のため\n\n■ 第三者提供\nお客様の同意なく、第三者へ個人情報を提供することはありません。\n\n■ 安全管理\n適切なセキュリティ対策を実施し、個人情報の漏洩・紛失・改ざんを防止します。`;
const CONSENT_TEXT = `私は以下の内容に同意します。\n\n① 提供した個人情報が上記プライバシーポリシーに従って取り扱われること\n② 施術・トレーニングにあたり、スタッフが私の健康情報・アレルギー情報を確認・共有すること\n③ 施術中に撮影された写真が、私の施術記録としてシステム内に保存されること（外部公開はしません）\n④ 体調不良・アレルギー反応等が生じた場合、スタッフの指示に従うこと`;

const INIT_CUSTOMERS = [
  {
    id:"C001", name:"田中 美咲", phone:"090-1234-5678", memberNo:"MEM-0042", joinDate:"2023-04-15", avatar:"田",
    counseling:{
      completedAt:"2023-04-15", lastName:"田中", firstName:"美咲", lastNameKana:"タナカ", firstNameKana:"ミサキ",
      dob:"1992-07-14", age:32, gender:"女性", occupation:"会社員", serviceType:"esthetic",
      height:160, weight:55, medicalHistory:"特になし", medications:"なし", allergies:"ラテックスアレルギー",
      skinType:"混合肌", pregnant:"該当なし", recentSurgery:"no",
      hairRemovalExp:"no", desiredAreas:["全身","ワキ"], hairRemovalPurpose:"完全になくしたい",
      otherMenuInterest:["フェイシャル"], hairType:"普通", selfCareMethod:["カミソリ"], selfCareFreq:"2〜3日に1回",
      sunburn:"していない", menstrualStatus:"no", medicalConditions:["特になし"],
      allergyTypes:["その他"], vaccineStatus:"10日以上前に接種あり",
      restrictedAreas:["特になし"], cautionItems:["特になし"],
      goals:["全身脱毛","ボディメイク"], ngTopics:"適度", ngTreatments:"強い刺激は避けたい", concerns:"肩の古傷（右肩）あり",
      agreePrivacy:true, agreeConsent:true, signatureName:"田中 美咲", signedAt:"2023-04-15 10:30",
    },
    timeline:[
      { id:"T001", date:"2025-03-01", time:"14:30", type:"nail", staff:"鈴木 奈々", title:"ジェルネイル施術", detail:{ color:"OPI #NL L60", parts:"ストーン×3", condition:"右中指に微細な浮き確認。" }, memo:"春らしいピンクベージュ。" },
      { id:"T002", date:"2025-02-22", time:"11:00", type:"gym",  staff:"中村 健太", title:"パーソナルトレーニング（第3回）", detail:{ weight:54.2, fat:22.1, training:"下半身強化：スクワット4×12" }, memo:"先月比-1.5kgで本人もニコニコ。" },
      { id:"T003", date:"2025-02-14", time:"16:00", type:"esthetic", staff:"山田 さくら", title:"全身脱毛（第4回）", detail:{ areas:"両腕・両脚・ワキ", output:"腕18J/脚20J", skin:"良好。", reaction:"軽微な赤み（30分で消退）" }, memo:"次回は顔脱毛の相談あり。" },
      { id:"T004", date:"2025-02-01", time:"10:00", type:"gym",  staff:"中村 健太", title:"パーソナルトレーニング（第2回）", detail:{ weight:55.7, fat:23.0, training:"上半身：ベンチプレス3×10" }, memo:"食事管理も開始。" },
    ]
  },
  {
    id:"C002", name:"佐藤 優花", phone:"080-9876-5432", memberNo:"MEM-0107", joinDate:"2024-01-20", avatar:"佐",
    counseling:{
      completedAt:"2024-01-20", lastName:"佐藤", firstName:"優花", serviceType:"esthetic",
      dob:"1998-03-22", age:27, gender:"女性", height:158, weight:50,
      skinType:"敏感肌", pregnant:"該当なし", desiredAreas:["全身","VIO"],
      hairRemovalExp:"no", otherMenuInterest:[], selfCareMethod:[], allergyTypes:["特になし"],
      medicalConditions:["特になし"], restrictedAreas:["特になし"], cautionItems:["特になし"],
      goals:["全身脱毛","ブライダル準備"], ngTopics:"話したい",
      agreePrivacy:true, agreeConsent:true, signatureName:"佐藤 優花", signedAt:"2024-01-20 14:00",
    },
    timeline:[
      { id:"T006", date:"2025-02-28", time:"15:00", type:"esthetic", staff:"山田 さくら", title:"顔・VIO脱毛（第2回）", detail:{ areas:"顔全体・VIO", output:"顔12J/VIO14J", skin:"問題なし。", reaction:"軽微な赤みのみ" }, memo:"ドレス選びの話で楽しそうだった。" }
    ]
  },
  {
    id:"C003", name:"小林 麻衣", phone:"070-5555-1234", memberNo:"MEM-0089", joinDate:"2023-09-01", avatar:"小",
    counseling: null,
    timeline:[
      { id:"T007", date:"2025-03-03", time:"11:30", type:"gym", staff:"中村 健太", title:"パーソナルトレーニング（第1回）", detail:{ weight:58.1, fat:25.3, training:"有酸素：バイク30min" }, memo:"ストレスが溜まっているとのこと。" }
    ]
  }
];

// ═══ Supabase ═══
class SupabaseClient {
  constructor(url, key) {
    this.url = url.replace(/\/$/, "");
    this.key = key;
  }
  headers() {
    return { "Content-Type":"application/json", "apikey":this.key, "Authorization":`Bearer ${this.key}` };
  }
  async getCustomers() {
    const res = await fetch(`${this.url}/rest/v1/customers?select=*,records(*)&order=created_at.desc`, { headers: this.headers() });
    if (!res.ok) throw new Error(await res.text());
    const rows = await res.json();
    // Supabase形式 → アプリ形式に変換
    return rows.map(r => ({
      id: r.id, name: r.name, phone: r.phone,
      memberNo: r.member_no, joinDate: r.join_date, avatar: r.avatar,
      counseling: r.counseling,
      timeline: (r.records||[]).sort((a,b)=>b.date.localeCompare(a.date)).map(rec=>({
        id: rec.id, date: rec.date, time: rec.time, type: rec.type,
        staff: rec.staff, title: rec.title, detail: rec.detail||{},
        memo: rec.memo||"", images: rec.images||[],
      }))
    }));
  }
  async upsertCustomer(c) {
    const body = { id:c.id, name:c.name, phone:c.phone, member_no:c.memberNo, join_date:c.joinDate, avatar:c.avatar, counseling:c.counseling };
    const res = await fetch(`${this.url}/rest/v1/customers`, {
      method:"POST", headers:{ ...this.headers(), "Prefer":"resolution=merge-duplicates" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
  }
  async upsertRecord(customerId, rec) {
    const body = { id:rec.id, customer_id:customerId, date:rec.date, time:rec.time, type:rec.type, staff:rec.staff, title:rec.title, detail:rec.detail||{}, memo:rec.memo||"", images:rec.images||[] };
    const res = await fetch(`${this.url}/rest/v1/records`, {
      method:"POST", headers:{ ...this.headers(), "Prefer":"resolution=merge-duplicates" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
  }
  async testConnection() {
    const res = await fetch(`${this.url}/rest/v1/customers?limit=1`, {
      headers: this.headers(),
      mode: "cors",
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  }
}

// Supabase 固定設定
const SB_URL_FIXED = "https://vcqfgkypsljgpxhsnfxv.supabase.co";
const SB_KEY_FIXED = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2Y3hienN4dmJvZWFwaW9pbHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyODgxMDgsImV4cCI6MjA5MDg2NDEwOH0.JI-dNBXwu2JxZZ1BvqOhwiTnwtDmfn6iQzEcN9LiZM4";

const SB_URL_KEY = "sb_url";
const SB_KEY_KEY = "sb_key";
const LOCAL_KEY  = "salon_suite_customers";

async function loadSbConfig() {
  try {
    const [u, k] = await Promise.all([
      window.storage.get(SB_URL_KEY, true),
      window.storage.get(SB_KEY_KEY, true),
    ]);
    return { url: u?.value||"", key: k?.value||"" };
  } catch { return { url:"", key:"" }; }
}
async function saveSbConfig(url, key) {
  await window.storage.set(SB_URL_KEY, url, true);
  await window.storage.set(SB_KEY_KEY, key, true);
}
async function saveLocalCustomers(customers) {
  try { await window.storage.set(LOCAL_KEY, JSON.stringify(customers), true); } catch {}
}
async function loadLocalCustomers() {
  try { const r = await window.storage.get(LOCAL_KEY, true); if(r?.value) return JSON.parse(r.value); } catch {}
  return null;
}

// ═══ 共通CSS ═══
const BASE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Noto+Sans+JP:wght@300;400;500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#F7F5F2;--sf:#FFF;--bd:#E8E4DF;
  --t1:#1A1714;--t2:#6B6460;--t3:#9E9894;
  --ac:#8B6F5E;--acl:#F2EBE6;
  --ok:#6C9E6E;--err:#C0392B;
  --r:14px;--sh:0 2px 20px rgba(0,0,0,.06);--sh2:0 8px 32px rgba(0,0,0,.12);
}
body,#root{font-family:'Noto Sans JP',sans-serif;background:var(--bg);color:var(--t1);min-height:100vh}
input,select,textarea,button{font-family:inherit}
.fg{display:flex;flex-direction:column;gap:5px;margin-bottom:14px}
.fg label{font-size:11px;font-weight:500;color:var(--t2);letter-spacing:.06em;text-transform:uppercase}
.fg input,.fg select,.fg textarea{padding:10px 12px;border:1.5px solid var(--bd);border-radius:10px;font-size:14px;background:var(--bg);color:var(--t1);outline:none;transition:border .2s;-webkit-appearance:none;resize:vertical}
.fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--ac)}
.fg .err-inp{border-color:var(--err)!important}
.errtxt{font-size:11px;color:var(--err);margin-top:2px}
.req{color:var(--err);margin-left:2px}
.hint{font-size:11px;color:var(--t3);line-height:1.5;margin-bottom:2px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}
.rgroup{display:flex;flex-wrap:wrap;gap:7px}
.rlbl{display:flex;align-items:center;gap:6px;padding:9px 13px;border:1.5px solid var(--bd);border-radius:10px;cursor:pointer;font-size:13px;transition:all .15s;background:var(--bg)}
.rlbl:has(input:checked){border-color:var(--ac);background:var(--acl);color:var(--ac);font-weight:500}
.rlbl input{display:none}
.btn-cancel{padding:9px 18px;border-radius:10px;border:1px solid var(--bd);background:none;font-size:13px;cursor:pointer;color:var(--t2)}
.btn-save{padding:9px 22px;border-radius:10px;border:none;background:var(--t1);color:#fff;font-size:13px;cursor:pointer;font-weight:500;transition:opacity .2s}
.btn-save:hover{opacity:.8}
.btn-ol{background:none;border:1px solid var(--bd);border-radius:10px;padding:8px 13px;font-size:12px;cursor:pointer;color:var(--t2);white-space:nowrap;transition:all .2s}
.btn-ol:hover{border-color:var(--ac);color:var(--ac)}
@media(max-width:600px){.g2{grid-template-columns:1fr}}
`;

// ── IME対応テキスト入力 ──
function TextInput({ defaultValue="", onCommit, placeholder, type="text", className="", style={} }) {
  const composing = useRef(false);
  return (
    <input type={type} className={className} style={style} placeholder={placeholder} defaultValue={defaultValue}
      onCompositionStart={()=>{ composing.current=true; }}
      onCompositionEnd={e=>{ composing.current=false; onCommit(e.target.value); }}
      onChange={e=>{ if(!composing.current) onCommit(e.target.value); }}
      onBlur={e=>onCommit(e.target.value)}
    />
  );
}

// ═══ Supabase設定モーダル ═══
function SupabaseSettingsModal({ onClose, onSave, currentUrl="", currentKey="" }) {
  const [url, setUrl] = useState(currentUrl);
  const [key, setKey] = useState(currentKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // null | "ok" | "error"
  const [testMsg, setTestMsg] = useState("");

  const test = async () => {
    if (!url || !key) return;
    setTesting(true); setTestResult(null);
    try {
      const sb = new SupabaseClient(url, key);
      await sb.testConnection();
      setTestResult("ok"); setTestMsg("接続成功！データベースに接続できました ✅");
    } catch(e) {
      setTestResult("error"); setTestMsg("接続失敗：" + e.message);
    }
    setTesting(false);
  };

  const save = async () => {
    await saveSbConfig(url, key);
    onSave(url, key);
    onClose();
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div style={{background:"var(--sf)",borderRadius:20,width:"100%",maxWidth:500,boxShadow:"var(--sh2)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{background:"linear-gradient(135deg,#1A1714,#3D2B1F)",padding:"22px 24px 18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#fff",letterSpacing:".06em"}}>Supabase 連携設定</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.6)",marginTop:3}}>データベースに接続してマルチデバイス同期を有効化</div>
            </div>
            <button style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,width:30,height:30,color:"#fff",cursor:"pointer",fontSize:16}} onClick={onClose}>✕</button>
          </div>
        </div>
        <div style={{padding:"20px 24px"}}>
          {/* 手順ガイド */}
          <div style={{background:"#F0EEF8",borderRadius:12,padding:"12px 16px",marginBottom:18,fontSize:12,color:"#5C4F8A",lineHeight:1.8}}>
            <div style={{fontWeight:700,marginBottom:4}}>📋 設定手順</div>
            <div>1. <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{color:"#7B68EE"}}>supabase.com</a> でプロジェクト作成</div>
            <div>2. SQL Editorで前述のテーブル作成SQLを実行</div>
            <div>3. Settings → API からURL・キーをコピー</div>
          </div>

          <div className="fg">
            <label>Project URL</label>
            <input placeholder="https://xxxxxxxxxxxx.supabase.co" value={url} onChange={e=>setUrl(e.target.value)} style={{fontFamily:"monospace",fontSize:12}}/>
          </div>
          <div className="fg">
            <label>anon public key</label>
            <input placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." value={key} onChange={e=>setKey(e.target.value)} style={{fontFamily:"monospace",fontSize:11}}/>
            <div className="hint">Settings → API → "anon public" のキーを貼り付けてください</div>
          </div>

          {testResult&&(
            <div style={{padding:"10px 14px",borderRadius:10,marginBottom:14,fontSize:12,fontWeight:600,
              background:testResult==="ok"?"#EBF3EB":"#FFF0F0",
              color:testResult==="ok"?"#2E7D32":"var(--err)"}}>
              {testMsg}
            </div>
          )}

          <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
            <button className="btn-cancel" onClick={onClose}>キャンセル</button>
            <button className="btn-ol" style={{borderColor:testing?"var(--bd)":"#7B68EE",color:testing?"var(--t3)":"#7B68EE"}} disabled={!url||!key||testing} onClick={test}>
              {testing?"接続テスト中…":"🔌 接続テスト"}
            </button>
            <button className="btn-save" disabled={!url||!key} onClick={save} style={{background:"#7B68EE"}}>
              💾 保存して接続
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ カウンセリングフォーム ═══
const INIT_FORM = {
  serviceType:"",
  lastName:"", firstName:"", lastNameKana:"", firstNameKana:"",
  phone:"", dob:"", age:"", gender:"", occupation:"",
  emergency:"", emergencyRel:"", emergencyPhone:"", howFound:"", referralName:"",
  familyStructure:"", relationshipStatus:"",
  height:"", weight:"",
  medicalHistory:"なし", medications:"なし", allergies:"なし",
  recentSurgery:"no", recentSurgeryNote:"",
  skinType:"", sensitivity:"",
  hairRemovalExp:"", hairRemovalPurpose:"",
  desiredAreas:[], otherMenuInterest:[], hairType:"",
  selfCareMethod:[], selfCareFreq:"", sunburn:"", pregnant:"", menstrualStatus:"",
  medicalConditions:[], allergyTypes:[], vaccineStatus:"",
  restrictedAreas:[], cautionItems:[],
  exerciseExp:"", exerciseFreq:"", dietStyle:"", targetWeight:"", targetFat:"",
  injuryHistory:"なし", sleepHours:"",
  nailExp:"", nailProblems:[], nailProblemsOther:"", fingerProblems:[], fingerProblemsOther:"",
  workRestriction:"", nailStyle:"", dominantHand:"",
  goals:[], visitReason:"", ngTopics:"", ngTreatments:"なし", concerns:"なし",
  agreePrivacy:false, agreeConsent:false, signatureName:"", signedAt:"",
};

function CounselingFormPage({ onSubmit, onBack, existingCustomers=[] }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({...INIT_FORM});
  const [errors, setErrors] = useState({});
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  const [linkedCustomer, setLinkedCustomer] = useState(null);
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);

  const linkCustomer = (c) => {
    const cs = c.counseling; if(!cs) return;
    setForm(p=>({...p,
      lastName:cs.lastName||"", firstName:cs.firstName||"",
      lastNameKana:cs.lastNameKana||"", firstNameKana:cs.firstNameKana||"",
      phone:c.phone||"", dob:cs.dob||"", age:cs.age||"",
      gender:cs.gender||"", occupation:cs.occupation||"",
      emergency:cs.emergency||"", emergencyRel:cs.emergencyRel||"",
      emergencyPhone:cs.emergencyPhone||"", howFound:cs.howFound||"",
      referralName:cs.referralName||"", familyStructure:cs.familyStructure||"",
      relationshipStatus:cs.relationshipStatus||"",
      height:cs.height||"", weight:cs.weight||"",
      medicalHistory:cs.medicalHistory||"なし", medications:cs.medications||"なし",
      allergies:cs.allergies||"なし",
    }));
    setLinkedCustomer(c); setShowCustomerPicker(false);
  };

  const s = (k,v) => setForm(p=>({...p,[k]:v}));
  const tg = g => s("goals", form.goals.includes(g)?form.goals.filter(x=>x!==g):[...form.goals,g]);
  const tgArr = (key,v) => setForm(p=>({...p,[key]:Array.isArray(p[key])?(p[key].includes(v)?p[key].filter(x=>x!==v):[...p[key],v]):[v]}));
  const arr = key => Array.isArray(form[key])?form[key]:[];

  const STEPS = ["業態選択","基本情報","専門情報","ご要望","同意書"];
  const validate = (i) => {
    const e={};
    if(i===0&&!form.serviceType) e.serviceType="業態を選択してください";
    if(i===1){
      if(!form.lastName) e.lastName="入力してください";
      if(!form.firstName) e.firstName="入力してください";
      if(!form.lastNameKana) e.lastNameKana="入力してください";
      if(!form.firstNameKana) e.firstNameKana="入力してください";
      if(!form.phone) e.phone="入力してください";
      if(!form.dob) e.dob="入力してください";
      if(!form.gender) e.gender="選択してください";
      if(!form.relationshipStatus) e.relationshipStatus="選択してください";
    }
    if(i===2){
      if(!form.height) e.height="入力してください";
      if(form.serviceType==="esthetic"){if(!form.skinType)e.skinType="選択してください";if(!form.hairRemovalExp)e.hairRemovalExp="選択してください";if(arr("desiredAreas").length===0)e.desiredAreas="1つ以上選択してください";}
      if(form.serviceType==="gym"&&!form.exerciseExp) e.exerciseExp="選択してください";
      if(form.serviceType==="nail"){if(!form.nailExp)e.nailExp="選択してください";if(!form.dominantHand)e.dominantHand="選択してください";}
    }
    if(i===3&&form.goals.length===0) e.goals="1つ以上選択してください";
    if(i===4){
      if(!form.agreePrivacy) e.agreePrivacy="同意が必要です";
      if(!form.agreeConsent) e.agreeConsent="同意が必要です";
      if(!form.signatureName) e.signatureName="お名前を入力してください";
    }
    setErrors(e); return Object.keys(e).length===0;
  };
  const next=()=>{ if(!validate(step))return; if(step===4){onSubmit({...form,signedAt:ts(),completedAt:td()});}else{setStep(s=>s+1);window.scrollTo(0,0);}};
  const prev=()=>{ if(step===0)onBack();else setStep(s=>s-1);window.scrollTo(0,0); };
  const FG=({label,req,err,hint,children})=>(<div className="fg"><label>{label}{req&&<span className="req">*</span>}</label>{hint&&<div className="hint">{hint}</div>}{children}{err&&<div className="errtxt">⚠ {err}</div>}</div>);

  return (
    <>
      <style>{BASE_CSS+`
        .cf-wrap{max-width:520px;margin:0 auto;padding:16px 16px 60px}
        .cf-topbar{background:var(--sf);border-bottom:1px solid var(--bd);padding:14px 20px;text-align:center;position:sticky;top:0;z-index:50;margin-bottom:18px}
        .cf-logo{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;letter-spacing:.08em}
        .cf-logo em{font-style:italic;color:var(--ac)}
        .cf-prog-bg{height:3px;background:var(--bd);border-radius:99px;margin-bottom:14px;overflow:hidden}
        .cf-prog{height:3px;background:linear-gradient(90deg,var(--ac),#C4A882);border-radius:99px;transition:width .4s}
        .cf-steps{display:flex;justify-content:space-between;margin-bottom:18px}
        .cfs{font-size:11px;color:var(--t3);opacity:.5;font-weight:500}
        .cfs.cur{opacity:1;color:var(--ac)}
        .cfs.done{opacity:.7}
        .cf-card{background:var(--sf);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;margin-bottom:12px}
        .cf-card-hd{padding:22px 22px 0}
        .cf-sttl{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;margin-bottom:6px}
        .cf-ssub{font-size:13px;color:var(--t2);line-height:1.6;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--bd)}
        .cf-card-bd{padding:6px 22px 22px}
        .cf-nav{display:flex;gap:10px;padding:16px 22px 22px;border-top:1px solid var(--bd)}
        .cf-back{flex:1;padding:13px;border-radius:11px;border:1px solid var(--bd);background:none;font-size:14px;cursor:pointer;color:var(--t2);font-weight:500}
        .cf-next{flex:2;padding:13px;border-radius:11px;border:none;background:var(--t1);color:#fff;font-size:14px;cursor:pointer;font-weight:700}
        .cf-next.green{background:var(--ok)}
        .cf-next.solo{flex:1}
        .note-box{background:#FFF8E7;border:1px solid #F0D98C;border-radius:10px;padding:11px 14px;font-size:12px;color:#7A6010;line-height:1.7;margin-bottom:14px}
        .warn-box{background:#FFF0F0;border:1px solid #F5C6C6;border-radius:10px;padding:10px 14px;font-size:12px;color:#7A2020;line-height:1.7;margin-bottom:12px}
        .sec-hd{font-size:12px;font-weight:700;color:#C9899A;margin:16px 0 12px;letter-spacing:.04em}
        .sec-div{height:1px;background:var(--bd);margin:20px 0}
        .gsel{display:flex;flex-wrap:wrap;gap:8px}
        .gsbtn{padding:9px 14px;border-radius:11px;border:1.5px solid var(--bd);font-size:13px;cursor:pointer;background:var(--bg);color:var(--t2);font-weight:500;transition:all .15s}
        .gsbtn.on{background:var(--ac);color:#fff;border-color:var(--ac)}
        .ptoggle{display:flex;align-items:center;justify-content:space-between;padding:12px 15px;background:var(--bg);border:1.5px solid var(--bd);border-radius:10px;cursor:pointer;font-size:13px;color:var(--t2);margin-bottom:8px}
        .pbox{background:#F9F7F4;border:1px solid var(--bd);border-radius:10px;padding:14px;font-size:12px;line-height:1.8;color:var(--t2);margin-bottom:10px;white-space:pre-line;max-height:200px;overflow-y:auto}
        .agree-row{display:flex;align-items:flex-start;gap:10px;padding:13px 15px;border:1.5px solid var(--bd);border-radius:10px;cursor:pointer;transition:all .2s;margin-bottom:8px}
        .agree-row.ck{border-color:var(--ok);background:#EBF3EB}
        .agree-row input[type=checkbox]{width:20px;height:20px;flex-shrink:0;margin-top:2px;accent-color:var(--ok);cursor:pointer}
        .agree-row span{font-size:13px;line-height:1.6}
        .sig-wrap{background:linear-gradient(135deg,#F2EBE6,#FAF8F5);border-radius:12px;padding:16px;margin-top:8px}
        .sig-inp{width:100%;padding:13px;border:1.5px solid var(--bd);border-radius:10px;font-size:16px;background:#fff;outline:none;text-align:center;letter-spacing:.04em}
      `}</style>
      <div className="cf-topbar">
        <div className="cf-logo">SALON <em>Suite</em></div>
        <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>初回カウンセリングシート</div>
      </div>
      <div className="cf-wrap">
        <div className="cf-prog-bg"><div className="cf-prog" style={{width:`${(step/4)*100}%`}}/></div>
        <div className="cf-steps">{STEPS.map((l,i)=><div key={i} className={`cfs${i===step?" cur":i<step?" done":""}`}>{i<step?"✅ ":""}{l}</div>)}</div>

        {/* 既存顧客引き継ぎ */}
        {step===0&&existingCustomers.filter(c=>c.counseling).length>0&&(
          <div style={{background:"var(--sf)",borderRadius:"var(--r)",boxShadow:"var(--sh)",padding:"16px 20px",marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>🔄 他業態もご利用中ですか？</div>
            <div style={{fontSize:12,color:"var(--t2)",marginBottom:12,lineHeight:1.6}}>すでに当店のカルテがある方は、基本情報の再入力を省略できます。</div>
            {linkedCustomer
              ?<div style={{display:"flex",alignItems:"center",gap:10,background:"#EBF3EB",borderRadius:10,padding:"10px 14px"}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:"#6C9E6E",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0}}>{linkedCustomer.avatar}</div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#2E7D32"}}>{linkedCustomer.name} さんの情報を引き継ぎ中</div><div style={{fontSize:11,color:"#4A7A4C"}}>基本情報がセットされました</div></div>
                <button onClick={()=>{setLinkedCustomer(null);setForm({...INIT_FORM});}} style={{background:"none",border:"1px solid #6C9E6E",borderRadius:8,padding:"5px 10px",fontSize:11,color:"#4A7A4C",cursor:"pointer"}}>解除</button>
              </div>
              :<button onClick={()=>setShowCustomerPicker(true)} style={{width:"100%",padding:"11px",borderRadius:11,border:"1.5px dashed var(--ac)",background:"var(--acl)",color:"var(--ac)",fontSize:13,fontWeight:600,cursor:"pointer"}}>👤 既存のカルテから引き継ぐ</button>
            }
          </div>
        )}
        {showCustomerPicker&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20,backdropFilter:"blur(4px)"}} onClick={()=>setShowCustomerPicker(false)}>
            <div style={{background:"var(--sf)",borderRadius:18,width:"100%",maxWidth:400,maxHeight:"70vh",overflowY:"auto",boxShadow:"var(--sh2)"}} onClick={e=>e.stopPropagation()}>
              <div style={{padding:"18px 18px 12px",borderBottom:"1px solid var(--bd)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600}}>カルテを選択</div>
                <button style={{background:"none",border:"none",fontSize:16,cursor:"pointer",color:"var(--t3)"}} onClick={()=>setShowCustomerPicker(false)}>✕</button>
              </div>
              <div style={{padding:"10px 12px"}}>
                {existingCustomers.filter(c=>c.counseling).map(c=>(
                  <div key={c.id} onClick={()=>linkCustomer(c)} style={{display:"flex",alignItems:"center",gap:11,padding:"11px 12px",borderRadius:11,cursor:"pointer",marginBottom:4,transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--acl)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,var(--ac),#C4A882)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0}}>{c.avatar}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:600}}>{c.name}</div>
                      <div style={{fontSize:11,color:"var(--t3)"}}>{c.phone} ／ {c.memberNo}</div>
                      <div style={{display:"flex",gap:5,marginTop:3,flexWrap:"wrap"}}>
                        {c.timeline.map(t=>t.type).filter((v,i,a)=>a.indexOf(v)===i).map(t=>(
                          <span key={t} style={{fontSize:10,padding:"2px 7px",borderRadius:20,background:TC[t].light,color:TC[t].color,fontWeight:500}}>{TC[t].icon} {TC[t].label}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{fontSize:18,color:"var(--ac)"}}>→</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 0 */}
        {step===0&&(
          <div className="cf-card">
            <div className="cf-card-hd"><div className="cf-sttl">ご利用の業態を選択</div><div className="cf-ssub">ご利用予定のサービスを選んでください。</div></div>
            <div className="cf-card-bd">
              {[["gym","💪","ジム・パーソナルトレーニング","ボディメイク・ダイエット・筋トレ"],["esthetic","✨","エステ・脱毛","全身脱毛・部分脱毛・フェイシャル"],["nail","💅","ネイル","ジェルネイル・ケア・アート"]].map(([k,ico,ttl,sub])=>(
                <div key={k} onClick={()=>s("serviceType",k)} style={{display:"flex",alignItems:"center",gap:16,padding:"18px 20px",border:`2px solid ${form.serviceType===k?TC[k].color:"var(--bd)"}`,borderRadius:14,cursor:"pointer",transition:"all .2s",background:form.serviceType===k?TC[k].light:"var(--bg)",marginBottom:10}}>
                  <div style={{fontSize:36}}>{ico}</div>
                  <div><div style={{fontSize:16,fontWeight:700,color:form.serviceType===k?TC[k].color:"var(--t1)",marginBottom:3}}>{ttl}</div><div style={{fontSize:12,color:"var(--t3)"}}>{sub}</div></div>
                  {form.serviceType===k&&<div style={{marginLeft:"auto",fontSize:20}}>✅</div>}
                </div>
              ))}
              {errors.serviceType&&<div className="errtxt">⚠ {errors.serviceType}</div>}
            </div>
            <div className="cf-nav"><button className="cf-next solo" onClick={next}>次へ →</button></div>
          </div>
        )}

        {/* STEP 1 */}
        {step===1&&(
          <div className="cf-card">
            <div className="cf-card-hd"><div className="cf-sttl">👤 基本情報</div><div className="cf-ssub">基本情報をご入力ください。</div></div>
            <div className="cf-card-bd">
              <div className="g2">
                <FG label="姓" req err={errors.lastName}><TextInput className={errors.lastName?"err-inp":""} placeholder="山田" defaultValue={form.lastName} onCommit={v=>s("lastName",v)}/></FG>
                <FG label="名" req err={errors.firstName}><TextInput className={errors.firstName?"err-inp":""} placeholder="花子" defaultValue={form.firstName} onCommit={v=>s("firstName",v)}/></FG>
                <FG label="セイ" req err={errors.lastNameKana}><TextInput className={errors.lastNameKana?"err-inp":""} placeholder="ヤマダ" defaultValue={form.lastNameKana} onCommit={v=>s("lastNameKana",v)}/></FG>
                <FG label="メイ" req err={errors.firstNameKana}><TextInput className={errors.firstNameKana?"err-inp":""} placeholder="ハナコ" defaultValue={form.firstNameKana} onCommit={v=>s("firstNameKana",v)}/></FG>
              </div>
              <div className="g2">
                <FG label="生年月日" req err={errors.dob}>
                  <input type="date" className={errors.dob?"err-inp":""} defaultValue={form.dob} onChange={e=>{const dob=e.target.value;s("dob",dob);if(dob){const t=new Date(),b=new Date(dob);let age=t.getFullYear()-b.getFullYear();const m=t.getMonth()-b.getMonth();if(m<0||(m===0&&t.getDate()<b.getDate()))age--;s("age",String(age));}}}/>
                </FG>
                <FG label="年齢"><div style={{padding:"10px 12px",border:"1.5px solid var(--bd)",borderRadius:10,background:"#F0EEF8",fontSize:15,color:"#6E5FA8",fontWeight:600,minHeight:42,display:"flex",alignItems:"center"}}>{form.age?`${form.age} 歳`:"生年月日を選択"}</div></FG>
              </div>
              <FG label="性別" req err={errors.gender}><div className="rgroup">{["女性","男性","その他","回答しない"].map(g=><label key={g} className="rlbl"><input type="radio" name="gender" checked={form.gender===g} onChange={()=>s("gender",g)}/>{g}</label>)}</div></FG>
              <FG label="電話番号" req err={errors.phone}><TextInput type="tel" className={errors.phone?"err-inp":""} placeholder="090-0000-0000" defaultValue={form.phone} onCommit={v=>s("phone",v)}/></FG>
              <FG label="ご職業"><div className="rgroup">{OCCUPATIONS.map(v=><label key={v} className="rlbl"><input type="radio" name="occ" checked={form.occupation===v} onChange={()=>s("occupation",v)}/>{v}</label>)}</div></FG>
              <FG label="交際・婚姻状況" req err={errors.relationshipStatus}><div className="rgroup">{["未婚・独身","交際中","既婚","離婚・別居中","その他・回答しない"].map(v=><label key={v} className="rlbl"><input type="radio" name="rel" checked={form.relationshipStatus===v} onChange={()=>s("relationshipStatus",v)}/>{v}</label>)}</div></FG>
              <FG label="家族構成"><div className="rgroup">{["1人暮らし","パートナーと2人","子どもと同居","親・家族と同居","その他"].map(v=><label key={v} className="rlbl"><input type="radio" name="fam" checked={form.familyStructure===v} onChange={()=>s("familyStructure",v)}/>{v}</label>)}</div></FG>
              <FG label="緊急連絡先">
                <div className="g2"><TextInput placeholder="氏名" defaultValue={form.emergency} onCommit={v=>s("emergency",v)}/><TextInput placeholder="続柄" defaultValue={form.emergencyRel} onCommit={v=>s("emergencyRel",v)}/></div>
                <div style={{marginTop:8}}><TextInput type="tel" placeholder="電話番号" defaultValue={form.emergencyPhone} onCommit={v=>s("emergencyPhone",v)}/></div>
              </FG>
              <FG label="当店をお知りになったきっかけ"><div className="rgroup">{HOW.map(h=><label key={h} className="rlbl"><input type="radio" name="how" checked={form.howFound===h} onChange={()=>s("howFound",h)}/>{h}</label>)}</div></FG>
              {form.howFound==="紹介（紹介者あり）"&&<FG label="紹介者のお名前"><TextInput placeholder="山田 太郎" defaultValue={form.referralName} onCommit={v=>s("referralName",v)}/></FG>}
            </div>
            <div className="cf-nav"><button className="cf-back" onClick={prev}>← 戻る</button><button className="cf-next" onClick={next}>次へ →</button></div>
          </div>
        )}

        {/* STEP 2 */}
        {step===2&&(
          <div className="cf-card">
            <div className="cf-card-hd">
              <div className="cf-sttl">{form.serviceType==="gym"&&"💪 健康・トレーニング情報"}{form.serviceType==="esthetic"&&"✨ 脱毛カウンセリング"}{form.serviceType==="nail"&&"💅 ネイル情報"}</div>
              <div className="cf-ssub">担当スタッフが確認します。正確にお答えください。</div>
            </div>
            <div className="cf-card-bd">
              <div className="note-box">ここでご入力いただいた情報は担当スタッフのみが確認します。</div>
              <div className="g2">
                <FG label="身長 (cm)" req err={errors.height}><input type="number" className={errors.height?"err-inp":""} placeholder="160" value={form.height} onChange={e=>s("height",e.target.value)}/></FG>
                {form.serviceType!=="nail"&&<FG label="体重 (kg)"><input type="number" placeholder="55" value={form.weight} onChange={e=>s("weight",e.target.value)}/></FG>}
              </div>

              {form.serviceType==="esthetic"&&<>
                <div className="sec-div"/>
                <div className="sec-hd">✨ 1. 脱毛経験・ご希望</div>
                <FG label="脱毛サロン・クリニックのご利用経験" req err={errors.hairRemovalExp}><div className="rgroup">{[["no","初めて"],["yes","あり（他サロン・クリニック）"],["self","自己処理のみ"]].map(([v,l])=><label key={v} className="rlbl"><input type="radio" name="hrexp" checked={form.hairRemovalExp===v} onChange={()=>s("hairRemovalExp",v)}/>{l}</label>)}</div></FG>
                <FG label="ご希望の脱毛部位（複数選択可）" req err={errors.desiredAreas}><div className="rgroup">{["全身","顔","フェイシャル","ヒゲ","ワキ","腕","脚","VIO","うなじ","背中","その他"].map(v=><label key={v} className="rlbl"><input type="checkbox" checked={arr("desiredAreas").includes(v)} onChange={()=>tgArr("desiredAreas",v)}/>{v}</label>)}</div></FG>
                <FG label="脱毛の目的"><div className="rgroup">{["完全になくしたい","薄くしたい","自己処理を楽にしたい","医療的な理由","その他"].map(v=><label key={v} className="rlbl"><input type="radio" name="hrpur" checked={form.hairRemovalPurpose===v} onChange={()=>s("hairRemovalPurpose",v)}/>{v}</label>)}</div></FG>
                <FG label="他メニューへのご興味（複数選択可）"><div className="rgroup">{["フェイシャル","ダイエット","ネイル","まつげデザイン","ボディメイク","特になし"].map(v=><label key={v} className="rlbl"><input type="checkbox" checked={arr("otherMenuInterest").includes(v)} onChange={()=>tgArr("otherMenuInterest",v)}/>{v}</label>)}</div></FG>
                <div className="sec-div"/>
                <div className="sec-hd">✨ 2. 肌・毛・自己処理の状況</div>
                <FG label="肌質" req err={errors.skinType}><div className="rgroup">{["普通肌","乾燥肌","脂性肌","混合肌","敏感肌","アトピー肌"].map(t=><label key={t} className="rlbl"><input type="radio" name="skin" checked={form.skinType===t} onChange={()=>s("skinType",t)}/>{t}</label>)}</div></FG>
                <FG label="毛質・毛量"><div className="rgroup">{["薄い","普通","濃い","剛毛"].map(v=><label key={v} className="rlbl"><input type="radio" name="hairtype" checked={form.hairType===v} onChange={()=>s("hairType",v)}/>{v}</label>)}</div></FG>
                <FG label="自己処理方法（複数選択可）"><div className="rgroup">{["カミソリ","電気シェーバー","毛抜き","除毛クリーム","ワックス","していない"].map(v=><label key={v} className="rlbl"><input type="checkbox" checked={arr("selfCareMethod").includes(v)} onChange={()=>tgArr("selfCareMethod",v)}/>{v}</label>)}</div></FG>
                <FG label="自己処理の頻度"><div className="rgroup">{["毎日","2〜3日に1回","週1回","月1回程度","していない"].map(v=><label key={v} className="rlbl"><input type="radio" name="selffreq" checked={form.selfCareFreq===v} onChange={()=>s("selfCareFreq",v)}/>{v}</label>)}</div></FG>
                <FG label="日焼けの状態" hint="施術直前1週間以内の強い日焼けは施術をお断りする場合があります"><div className="rgroup">{["していない","少し日焼けあり","かなり日焼けしている"].map(v=><label key={v} className="rlbl"><input type="radio" name="sun" checked={form.sunburn===v} onChange={()=>s("sunburn",v)}/>{v}</label>)}</div></FG>
                <div className="sec-div"/>
                <div className="sec-hd">✨ 3. 体調・通院・服薬情報</div>
                <FG label="妊娠・授乳の状況"><div className="rgroup">{["該当なし","妊娠中","授乳中"].map(v=><label key={v} className="rlbl"><input type="radio" name="preg" checked={form.pregnant===v} onChange={()=>s("pregnant",v)}/>{v}</label>)}</div></FG>
                <FG label="本日、生理中ですか？"><div className="rgroup">{[["no","いいえ"],["yes","はい"],["na","該当なし"]].map(([v,l])=><label key={v} className="rlbl"><input type="radio" name="mens" checked={form.menstrualStatus===v} onChange={()=>s("menstrualStatus",v)}/>{l}</label>)}</div></FG>
                <FG label="持病・通院歴（複数選択可）"><div className="rgroup">{["特になし","高血圧","糖尿病","心臓病","てんかん","がん（治療中または既往）","その他"].map(v=><label key={v} className="rlbl"><input type="checkbox" checked={arr("medicalConditions").includes(v)} onChange={()=>tgArr("medicalConditions",v)}/>{v}</label>)}</div></FG>
                <FG label="服用中のお薬" hint="薬名・用途をご記入ください（なし可）"><TextInput placeholder="例：降圧剤（アムロジピン）、なし" defaultValue={form.medications} onCommit={v=>s("medications",v)}/></FG>
                <FG label="⚠️ アレルギー（複数選択可）"><div className="rgroup">{["特になし","薬アレルギー","食物アレルギー","金属アレルギー","日光アレルギー","その他"].map(v=><label key={v} className="rlbl"><input type="checkbox" checked={arr("allergyTypes").includes(v)} onChange={()=>tgArr("allergyTypes",v)}/>{v}</label>)}</div>{arr("allergyTypes").some(a=>a!=="特になし")&&<TextInput style={{marginTop:8}} placeholder="詳細をご記入ください" defaultValue={form.allergies} onCommit={v=>s("allergies",v)}/>}</FG>
                <FG label="直近のワクチン接種" hint="予防接種後 約10日間は施術をお控えいただく場合があります"><div className="rgroup">{["直近10日以内に接種あり","10日以上前に接種あり","接種の予定なし／該当なし"].map(v=><label key={v} className="rlbl"><input type="radio" name="vaccine" checked={form.vaccineStatus===v} onChange={()=>s("vaccineStatus",v)}/>{v}</label>)}</div></FG>
                <div className="sec-div"/>
                <div className="sec-hd">✨ 4. 施術制限チェック</div>
                <div className="warn-box">⚠️ 以下に該当する箇所への施術はお断りする場合があります。正確にお答えください。</div>
                <FG label="施術不可部位・状態（複数選択可）"><div className="rgroup">{["特になし","まぶた付近","タトゥー・刺青がある","シリコン（豊胸等）インプラント","ペースメーカーを使用中","甲状腺付近","手術後の金属が入っている","首（うなじ除く）"].map(v=><label key={v} className="rlbl"><input type="checkbox" checked={arr("restrictedAreas").includes(v)} onChange={()=>tgArr("restrictedAreas",v)}/>{v}</label>)}</div></FG>
                <FG label="疾患・注意状態（複数選択可）"><div className="rgroup">{["特になし","HIV・エイズ","がん（現在治療中）","重度の全身疾患","てんかん発作の既往","皮膚の炎症・傷・ニキビ（施術部位）","鎮痛剤を服用中","光感作用を高める薬を服用中","直近1週間以内の強い日焼け","ヘルペスの既往","体調不良（発熱・倦怠感など）"].map(v=><label key={v} className="rlbl"><input type="checkbox" checked={arr("cautionItems").includes(v)} onChange={()=>tgArr("cautionItems",v)}/>{v}</label>)}</div></FG>
              </>}

              {form.serviceType==="gym"&&<>
                <div className="sec-div"/>
                <FG label="既往歴・現在治療中の病気"><input placeholder="なし" value={form.medicalHistory} onChange={e=>s("medicalHistory",e.target.value)}/></FG>
                <FG label="服用中のお薬"><input placeholder="なし" value={form.medications} onChange={e=>s("medications",e.target.value)}/></FG>
                <FG label="⚠️ アレルギー"><input placeholder="なし" value={form.allergies} onChange={e=>s("allergies",e.target.value)}/></FG>
                <FG label="運動経験" req err={errors.exerciseExp}><div className="rgroup">{["ほぼ未経験","たまにやる程度","定期的にやっている","本格的にやっていた"].map(v=><label key={v} className="rlbl"><input type="radio" name="expg" checked={form.exerciseExp===v} onChange={()=>s("exerciseExp",v)}/>{v}</label>)}</div></FG>
                <FG label="現在の運動頻度"><div className="rgroup">{["ほぼしていない","週1回","週2〜3回","週4回以上"].map(v=><label key={v} className="rlbl"><input type="radio" name="freq" checked={form.exerciseFreq===v} onChange={()=>s("exerciseFreq",v)}/>{v}</label>)}</div></FG>
                <FG label="食事スタイル"><div className="rgroup">{["特に気にしていない","カロリー管理している","タンパク質を意識している","間食が多い","食事が不規則"].map(v=><label key={v} className="rlbl"><input type="radio" name="diet" checked={form.dietStyle===v} onChange={()=>s("dietStyle",v)}/>{v}</label>)}</div></FG>
                <div className="g2">
                  <FG label="目標体重 (kg)"><input type="number" placeholder="50" value={form.targetWeight} onChange={e=>s("targetWeight",e.target.value)}/></FG>
                  <FG label="目標体脂肪率 (%)"><input type="number" placeholder="20" value={form.targetFat} onChange={e=>s("targetFat",e.target.value)}/></FG>
                </div>
                <FG label="ケガ・腰痛などの既往"><TextInput placeholder="例：右膝の古傷、なし" defaultValue={form.injuryHistory} onCommit={v=>s("injuryHistory",v)}/></FG>
                <FG label="平均睡眠時間"><div className="rgroup">{["4時間未満","4〜6時間","6〜8時間","8時間以上"].map(v=><label key={v} className="rlbl"><input type="radio" name="sleep" checked={form.sleepHours===v} onChange={()=>s("sleepHours",v)}/>{v}</label>)}</div></FG>
              </>}

              {form.serviceType==="nail"&&<>
                <div className="sec-div"/>
                <FG label="⚠️ アレルギー"><input placeholder="なし" value={form.allergies} onChange={e=>s("allergies",e.target.value)}/></FG>
                <FG label="ネイルサロンのご利用経験" req err={errors.nailExp}><div className="rgroup">{["初めて","たまに行く","定期的に通っている"].map(v=><label key={v} className="rlbl"><input type="radio" name="nexp" checked={form.nailExp===v} onChange={()=>s("nailExp",v)}/>{v}</label>)}</div></FG>
                <FG label="爪のお悩み（複数選択可）"><div className="rgroup">{["特になし","割れやすい","薄い・弱い","二枚爪","変色","噛み癖がある","深爪","横長爪"].map(v=><label key={v} className="rlbl"><input type="checkbox" checked={arr("nailProblems").includes(v)} onChange={()=>tgArr("nailProblems",v)}/>{v}</label>)}</div><TextInput style={{marginTop:8}} placeholder="その他" defaultValue={form.nailProblemsOther} onCommit={v=>s("nailProblemsOther",v)}/></FG>
                <FG label="手指のお悩み（複数選択可）"><div className="rgroup">{["特になし","乾燥","ひび割れ","ささくれ","くすみ","皺"].map(v=><label key={v} className="rlbl"><input type="checkbox" checked={arr("fingerProblems").includes(v)} onChange={()=>tgArr("fingerProblems",v)}/>{v}</label>)}</div></FG>
                <FG label="お仕事上の制限"><TextInput placeholder="例：透明・ヌードのみOK" defaultValue={form.workRestriction} onCommit={v=>s("workRestriction",v)}/></FG>
                <FG label="ご希望スタイル"><div className="rgroup">{["シンプル・ナチュラル","フレンチ","アート系","ストーン・パーツ多め","季節に合わせたい","おまかせ"].map(v=><label key={v} className="rlbl"><input type="radio" name="nstyle" checked={form.nailStyle===v} onChange={()=>s("nailStyle",v)}/>{v}</label>)}</div></FG>
                <FG label="利き手" req err={errors.dominantHand}><div className="rgroup">{["右手","左手","両利き"].map(v=><label key={v} className="rlbl"><input type="radio" name="dhand" checked={form.dominantHand===v} onChange={()=>s("dominantHand",v)}/>{v}</label>)}</div></FG>
              </>}
            </div>
            <div className="cf-nav"><button className="cf-back" onClick={prev}>← 戻る</button><button className="cf-next" onClick={next}>次へ →</button></div>
          </div>
        )}

        {/* STEP 3 */}
        {step===3&&(
          <div className="cf-card">
            <div className="cf-card-hd"><div className="cf-sttl">🎯 ご要望・ご希望</div><div className="cf-ssub">スタッフがより良いご提案をするために教えてください。</div></div>
            <div className="cf-card-bd">
              <FG label="ご希望・目標（複数選択可）" req err={errors.goals}>
                <div className="gsel">{GOALS.filter(g=>form.serviceType==="nail"?!["全身脱毛","部分脱毛","ボディメイク","ダイエット","筋肉量アップ"].includes(g):true).map(g=><button key={g} type="button" className={`gsbtn${form.goals.includes(g)?" on":""}`} onClick={()=>tg(g)}>{g}</button>)}</div>
              </FG>
              <FG label="来店のきっかけ・ご要望"><TextInput placeholder="例：来年の結婚式に向けて始めたいです。" defaultValue={form.visitReason} onCommit={v=>s("visitReason",v)}/></FG>
              <FG label="施術中の会話はいかがですか？">
                <div className="rgroup">{[["話したい","💬 たくさん話したい"],["適度","🙂 適度に話す程度"],["静か","🤫 静かに過ごしたい"],["任せる","😌 スタッフにおまかせ"]].map(([v,l])=><label key={v} className="rlbl"><input type="radio" name="talkpref" checked={form.ngTopics===v} onChange={()=>s("ngTopics",v)}/>{l}</label>)}</div>
              </FG>
              {form.serviceType!=="nail"&&<FG label="受けたくない施術・刺激（任意）"><TextInput placeholder="例：強い刺激のある施術は避けたい" defaultValue={form.ngTreatments} onCommit={v=>s("ngTreatments",v)}/></FG>}
              <FG label="その他ご配慮いただきたいこと（任意）"><TextInput placeholder="例：右肩に古傷があります。" defaultValue={form.concerns} onCommit={v=>s("concerns",v)}/></FG>
            </div>
            <div className="cf-nav"><button className="cf-back" onClick={prev}>← 戻る</button><button className="cf-next" onClick={next}>次へ →</button></div>
          </div>
        )}

        {/* STEP 4 */}
        {step===4&&(
          <div className="cf-card">
            <div className="cf-card-hd"><div className="cf-sttl">📝 同意書・署名</div><div className="cf-ssub">内容をお読みいただき、同意の上でご署名ください。</div></div>
            <div className="cf-card-bd">
              <div>
                <div className="ptoggle" onClick={()=>setPrivacyOpen(!privacyOpen)}><span>📄 プライバシーポリシー</span><span style={{fontSize:12}}>{privacyOpen?"▲ 閉じる":"▼ 確認する"}</span></div>
                {privacyOpen&&<div className="pbox">{PRIVACY}</div>}
                <label className={`agree-row${form.agreePrivacy?" ck":""}`} onClick={()=>s("agreePrivacy",!form.agreePrivacy)}><input type="checkbox" readOnly checked={form.agreePrivacy}/><span>プライバシーポリシーを読み、同意します</span></label>
                {errors.agreePrivacy&&<div className="errtxt" style={{marginBottom:8}}>⚠ {errors.agreePrivacy}</div>}
              </div>
              <div style={{marginTop:8}}>
                <div className="ptoggle" onClick={()=>setConsentOpen(!consentOpen)}><span>📋 施術・個人情報に関する同意書</span><span style={{fontSize:12}}>{consentOpen?"▲ 閉じる":"▼ 確認する"}</span></div>
                {consentOpen&&<div className="pbox">{CONSENT_TEXT}</div>}
                <label className={`agree-row${form.agreeConsent?" ck":""}`} onClick={()=>s("agreeConsent",!form.agreeConsent)}><input type="checkbox" readOnly checked={form.agreeConsent}/><span>施術・個人情報に関する同意書のすべての内容に同意します</span></label>
                {errors.agreeConsent&&<div className="errtxt" style={{marginBottom:8}}>⚠ {errors.agreeConsent}</div>}
              </div>
              <div className="sig-wrap">
                <div style={{fontSize:12,color:"var(--t2)",fontWeight:500,marginBottom:8}}>✍️ お名前を入力して署名してください</div>
                <TextInput className={`sig-inp${errors.signatureName?" err-inp":""}`} placeholder="山田 花子" defaultValue={form.signatureName} onCommit={v=>s("signatureName",v)}/>
                {errors.signatureName&&<div className="errtxt" style={{textAlign:"center",marginTop:4}}>⚠ {errors.signatureName}</div>}
                <div style={{fontSize:11,color:"var(--t3)",marginTop:6,textAlign:"center"}}>入力内容が電子署名として記録されます</div>
              </div>
            </div>
            <div className="cf-nav"><button className="cf-back" onClick={prev}>← 戻る</button><button className="cf-next green" onClick={next}>✅ 送信する</button></div>
          </div>
        )}
      </div>
    </>
  );
}

// ═══ 完了画面 ═══
function CompletePage({ form }) {
  return (
    <div style={{maxWidth:480,margin:"40px auto",padding:"0 16px",textAlign:"center"}}>
      <style>{BASE_CSS}</style>
      <div style={{fontSize:56,marginBottom:16}}>✅</div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,marginBottom:10}}>ご記入ありがとうございます！</div>
      <div style={{fontSize:14,color:"var(--t2)",lineHeight:1.8,marginBottom:24}}>カウンセリングシートの送信が完了しました。<br/>タブレットをスタッフにお返しください。<br/>まもなくご案内いたします。</div>
      <div style={{background:"var(--acl)",borderRadius:12,padding:"16px 20px",textAlign:"left",marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:700,color:"var(--ac)",marginBottom:10}}>📋 送信内容の確認</div>
        {[["お名前",`${form.lastName} ${form.firstName}`],["電話番号",form.phone],["目標",(form.goals||[]).join("・")],["署名日時",form.signedAt]].map(([l,v])=>(
          <div key={l} style={{display:"flex",gap:12,fontSize:13,marginBottom:5}}>
            <div style={{color:"var(--t3)",minWidth:70}}>{l}</div><div style={{color:"var(--t1)",fontWeight:500}}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ 体重グラフ ═══
function Chart({ timeline }) {
  const d=timeline.filter(t=>t.type==="gym"&&t.detail?.weight).reverse();
  if(d.length<2) return null;
  const ws=d.map(x=>x.detail.weight);
  const mn=Math.min(...ws),mx=Math.max(...ws),pad=Math.max((mx-mn)*0.3,1.5);
  const yMin=mn-pad,yMax=mx+pad;
  const W=500,H=140,LEFT=42,RIGHT=16,TOP=20,BOTTOM=32,gW=W-LEFT-RIGHT,gH=H-TOP-BOTTOM;
  const px=i=>LEFT+i/(d.length-1)*gW, py=v=>TOP+gH-(v-yMin)/(yMax-yMin)*gH;
  const tickStep=Math.ceil((yMax-yMin)/4*2)/2,tickStart=Math.ceil(yMin/tickStep)*tickStep;
  const ticks=[];for(let t=tickStart;t<=yMax+.01;t=Math.round((t+tickStep)*10)/10)ticks.push(t);
  const linePts=d.map((_,i)=>`${px(i)},${py(ws[i])}`).join(" L ");
  const latest=d[d.length-1]?.detail,prev=d[d.length-2]?.detail;
  const diff=(a,b,key)=>a&&b&&a[key]!=null&&b[key]!=null?Math.round((a[key]-b[key])*10)/10:null;
  const Stat=({label,value,unit,d,color})=>(
    <div style={{flex:1,background:"var(--bg)",borderRadius:11,padding:"11px 13px",minWidth:0}}>
      <div style={{fontSize:10,color:"var(--t3)",fontWeight:500,marginBottom:4,letterSpacing:".05em"}}>{label}</div>
      <div style={{fontSize:20,fontWeight:700,color:color||"var(--t1)",lineHeight:1}}>{value!=null?value:"—"}<span style={{fontSize:11,fontWeight:400,color:"var(--t3)",marginLeft:2}}>{unit}</span></div>
      {d!=null&&<div style={{fontSize:10,marginTop:4,color:d<0?"#6C9E6E":d>0?"#C9899A":"var(--t3)",fontWeight:600}}>{d>0?"▲ +":d<0?"▼ ":""}{d} 前回比</div>}
    </div>
  );
  return (
    <div style={{background:"var(--sf)",borderRadius:"var(--r)",padding:"18px 20px 14px",marginBottom:16,boxShadow:"var(--sh)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",letterSpacing:".12em",textTransform:"uppercase"}}>ボディ記録</div>
        <div style={{fontSize:11,color:"var(--t3)"}}>{d[0].date} 〜 {d[d.length-1].date}</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
        <Stat label="体重" value={latest?.weight} unit="kg" d={diff(latest,prev,"weight")} color="#6C9E6E"/>
        <Stat label="体脂肪率" value={latest?.fat} unit="%" d={diff(latest,prev,"fat")} color="#C9899A"/>
        <Stat label="筋肉量" value={latest?.muscle} unit="kg" d={diff(latest,prev,"muscle")} color="#6C9E6E"/>
        <Stat label="BMI" value={latest?.bmi} unit="" d={diff(latest,prev,"bmi")} color="#9B8EC4"/>
      </div>
      <div style={{fontSize:11,fontWeight:600,color:"#4A7A4C",marginBottom:6}}>📈 体重推移 (kg)</div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
        <defs><linearGradient id="wg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6C9E6E" stopOpacity="0.25"/><stop offset="100%" stopColor="#6C9E6E" stopOpacity="0.02"/></linearGradient></defs>
        {ticks.map(t=><g key={t}><line x1={LEFT} y1={py(t)} x2={LEFT+gW} y2={py(t)} stroke="#E8E4DF" strokeWidth="1" strokeDasharray="4 3"/><text x={LEFT-6} y={py(t)+4} textAnchor="end" fontSize="9" fill="#aaa" fontWeight="500">{t}</text></g>)}
        <line x1={LEFT} y1={TOP+gH} x2={LEFT+gW} y2={TOP+gH} stroke="#E8E4DF" strokeWidth="1.5"/>
        <line x1={LEFT} y1={TOP} x2={LEFT} y2={TOP+gH} stroke="#E8E4DF" strokeWidth="1.5"/>
        <path d={`M ${linePts} L ${px(d.length-1)},${TOP+gH} L ${px(0)},${TOP+gH} Z`} fill="url(#wg1)"/>
        <path d={`M ${linePts}`} fill="none" stroke="#6C9E6E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {d.map((e,i)=>{const cx=px(i),cy=py(ws[i]),isEnd=i===0||i===d.length-1,labelY=cy>TOP+16?cy-10:cy+18;return(
          <g key={i}>
            <text x={cx} y={TOP+gH+13} textAnchor="middle" fontSize="9" fill="#bbb">{e.date.slice(5)}</text>
            <circle cx={cx} cy={cy} r={isEnd?7:5} fill="white" stroke="#6C9E6E" strokeWidth="2"/>
            <circle cx={cx} cy={cy} r={isEnd?3.5:2.5} fill="#6C9E6E"/>
            <rect x={cx-18} y={labelY-11} width={36} height={14} rx="4" fill={i===d.length-1?"#6C9E6E":"white"} stroke={i===d.length-1?"#6C9E6E":"#E0E0E0"} strokeWidth="1"/>
            <text x={cx} y={labelY} textAnchor="middle" fontSize="9.5" fill={i===d.length-1?"white":"#4A7A4C"} fontWeight="700">{ws[i]}</text>
          </g>
        );})}
      </svg>
    </div>
  );
}

// ═══ タイムラインアイテム ═══
function TLItem({ item, isLast }) {
  const cfg=TC[item.type],[open,setOpen]=useState(false);
  return (
    <div style={{display:"flex",gap:13}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:cfg.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{cfg.icon}</div>
        {!isLast&&<div style={{width:2,flex:1,background:"var(--bd)",minHeight:18,margin:"4px 0"}}/>}
      </div>
      <div style={{flex:1,paddingBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:9,background:"var(--bg)",borderRadius:10,padding:"10px 12px",cursor:"pointer",marginBottom:6}} onClick={()=>setOpen(!open)}>
          <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
            <span style={{fontSize:11,padding:"3px 8px",borderRadius:20,background:cfg.light,color:cfg.color,fontWeight:500}}>{cfg.label}</span>
            <span style={{fontSize:14,fontWeight:500}}>{item.title}</span>
            {item.detail?.ticketUsed&&item.detail?.ticketTotal&&(()=>{const rem=item.detail.ticketTotal-item.detail.ticketUsed;return<span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:rem<=2?"#FFF0F0":"#EBF3EB",color:rem<=2?"var(--err)":"#4A7A4C",fontWeight:700}}>🎟️ 残り{rem}回</span>;})()}
            {item.detail?.mood!=null&&(()=>{const m=item.detail.mood;return<span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:m<=3?"#FFEBEE":m<=6?"#FFF8E7":"#EBF3EB",color:m<=3?"#C62828":m<=6?"#E65100":"#2E7D32",fontWeight:700}}>{m<=3?"😞":m<=5?"😐":m<=7?"🙂":m<=9?"😊":"🤩"} {m}/10</span>;})()}
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",flexShrink:0}}>
            <span style={{fontSize:11,color:"var(--t3)"}}>{item.date} {item.time}</span>
            <span style={{fontSize:11,color:"var(--t3)"}}>by {item.staff}</span>
          </div>
        </div>
        {item.memo&&<div style={{fontSize:13,color:"var(--t2)",lineHeight:1.7,padding:"0 3px",marginBottom:3}}>💬 {item.memo}</div>}
        {open&&(
          <div style={{display:"grid",gridTemplateColumns:"max-content 1fr",gap:"6px 12px",background:"var(--bg)",borderRadius:10,padding:"11px 13px"}}>
            {item.type==="gym"&&<>{item.detail.weight&&<><div style={{fontSize:11,color:"var(--t3)"}}>体重</div><div style={{fontSize:13,fontWeight:500}}>{item.detail.weight} kg</div></>}{item.detail.fat&&<><div style={{fontSize:11,color:"var(--t3)"}}>体脂肪率</div><div style={{fontSize:13,fontWeight:500}}>{item.detail.fat} %</div></>}{item.detail.muscle&&<><div style={{fontSize:11,color:"var(--t3)"}}>筋肉量</div><div style={{fontSize:13,fontWeight:500,color:"#6C9E6E"}}>{item.detail.muscle} kg</div></>}{item.detail.bmi&&<><div style={{fontSize:11,color:"var(--t3)"}}>BMI</div><div style={{fontSize:13,fontWeight:500,color:"#9B8EC4"}}>{item.detail.bmi}</div></>}{item.detail.training&&<><div style={{fontSize:11,color:"var(--t3)"}}>メニュー</div><div style={{fontSize:13}}>{item.detail.training}</div></>}</>}
            {item.type==="esthetic"&&<><div style={{fontSize:11,color:"var(--t3)"}}>照射部位</div><div style={{fontSize:13}}>{item.detail.areas}</div><div style={{fontSize:11,color:"var(--t3)"}}>出力設定</div><div style={{fontSize:13}}>{item.detail.output}</div><div style={{fontSize:11,color:"var(--t3)"}}>肌の状態</div><div style={{fontSize:13}}>{item.detail.skin}</div><div style={{fontSize:11,color:"var(--t3)"}}>反応</div><div style={{fontSize:13}}>{item.detail.reaction}</div></>}
            {item.type==="nail"&&<><div style={{fontSize:11,color:"var(--t3)"}}>カラー</div><div style={{fontSize:13}}>{item.detail.color}</div><div style={{fontSize:11,color:"var(--t3)"}}>パーツ</div><div style={{fontSize:13}}>{item.detail.parts}</div><div style={{fontSize:11,color:"var(--t3)"}}>爪の状態</div><div style={{fontSize:13}}>{item.detail.condition}</div></>}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ CSビュー ═══
function CSView({ c, onEdit }) {
  const cs=c.counseling;
  const R=({l,v,alert})=>(<div style={{display:"grid",gridTemplateColumns:"90px 1fr",gap:"0 10px",marginBottom:7,fontSize:13}}><div style={{fontSize:11,color:"var(--t3)",paddingTop:2}}>{l}</div><div style={{color:alert&&v&&v!=="なし"&&v!=="特になし"?"var(--err)":"var(--t1)",fontWeight:alert&&v&&v!=="なし"&&v!=="特になし"?600:"400",lineHeight:1.5}}>{v||"—"}</div></div>);
  const S=({title,children})=>(<div style={{background:"var(--bg)",borderRadius:12,padding:15,marginBottom:0}}><div style={{fontSize:13,fontWeight:700,marginBottom:11}}>{title}</div>{children}</div>);
  const arrStr=key=>{const a=cs[key];return Array.isArray(a)&&a.length?a.join("・"):"—";};
  return (
    <div style={{background:"var(--sf)",borderRadius:"var(--r)",padding:22,boxShadow:"var(--sh)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,gap:12}}>
        <div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:600}}>カウンセリングシート</div><div style={{fontSize:12,color:"var(--t3)",marginTop:4}}>記入日：{cs.completedAt}　署名：✅ {cs.signatureName}（{cs.signedAt}）</div></div>
        <div style={{display:"flex",gap:8}}><button className="btn-ol" onClick={onEdit}>✏️ 編集</button><button className="btn-ol" onClick={()=>window.print()}>🖨️ 印刷</button></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <S title="👤 基本情報"><R l="氏名" v={`${cs.lastName||""} ${cs.firstName||""}`}/><R l="生年月日" v={cs.dob?`${cs.dob}（${cs.age}歳）`:"—"}/><R l="性別" v={cs.gender}/><R l="交際・婚姻" v={cs.relationshipStatus}/><R l="来店きっかけ" v={cs.howFound||"—"}/></S>
        <S title="🏥 健康・身体"><R l="身長/体重" v={`${cs.height||"—"} cm / ${cs.weight||"—"} kg`}/><R l="既往歴" v={cs.medicalHistory||"—"}/><R l="服用薬" v={cs.medications||"—"}/><R l="アレルギー" v={cs.allergies||"—"} alert/></S>
        {cs.serviceType==="esthetic"&&<>
          <S title="✨ 脱毛経験・ご希望"><R l="脱毛経験" v={cs.hairRemovalExp==="no"?"初めて":cs.hairRemovalExp==="yes"?"他サロンあり":cs.hairRemovalExp==="self"?"自己処理のみ":cs.hairRemovalExp}/><R l="希望部位" v={arrStr("desiredAreas")}/><R l="脱毛目的" v={cs.hairRemovalPurpose}/><R l="他メニュー興味" v={arrStr("otherMenuInterest")}/></S>
          <S title="✨ 肌・毛・自己処理"><R l="肌質" v={cs.skinType}/><R l="毛質・毛量" v={cs.hairType}/><R l="自己処理方法" v={arrStr("selfCareMethod")}/><R l="自己処理頻度" v={cs.selfCareFreq}/><R l="日焼け" v={cs.sunburn}/></S>
          <S title="✨ 体調・服薬"><R l="妊娠・授乳" v={cs.pregnant}/><R l="生理中" v={cs.menstrualStatus==="yes"?"はい":cs.menstrualStatus==="no"?"いいえ":"—"}/><R l="持病・通院" v={arrStr("medicalConditions")}/><R l="アレルギー種別" v={arrStr("allergyTypes")} alert/><R l="ワクチン接種" v={cs.vaccineStatus}/></S>
          <S title="⚠️ 施術制限"><R l="不可部位" v={arrStr("restrictedAreas")} alert/><R l="注意事項" v={arrStr("cautionItems")} alert/></S>
        </>}
        {cs.serviceType==="gym"&&<S title="💪 トレーニング"><R l="運動経験" v={cs.exerciseExp}/><R l="運動頻度" v={cs.exerciseFreq}/><R l="食事スタイル" v={cs.dietStyle}/><R l="目標体重" v={cs.targetWeight?`${cs.targetWeight} kg`:"—"}/><R l="目標体脂肪" v={cs.targetFat?`${cs.targetFat} %`:"—"}/><R l="ケガ・腰痛" v={cs.injuryHistory} alert/></S>}
        {cs.serviceType==="nail"&&<S title="💅 ネイル情報"><R l="ネイル経験" v={cs.nailExp}/><R l="爪のお悩み" v={Array.isArray(cs.nailProblems)&&cs.nailProblems.length?cs.nailProblems.join("・"):"—"}/><R l="仕事上の制限" v={cs.workRestriction} alert/><R l="希望スタイル" v={cs.nailStyle}/><R l="利き手" v={cs.dominantHand}/></S>}
        <S title="🎯 要望・申し送り"><R l="目標" v={Array.isArray(cs.goals)&&cs.goals.length?cs.goals.join("・"):"—"}/><R l="会話希望" v={cs.ngTopics}/><R l="NG施術" v={cs.ngTreatments} alert/><R l="その他配慮" v={cs.concerns} alert/></S>
      </div>
    </div>
  );
}

// ═══ 記録追加モーダル ═══
function AddModal({ onClose, onAdd, staffList, timeline }) {
  const [type,setType]=useState("gym"),[staff,setStaff]=useState(""),[title,setTitle]=useState(""),[memo,setMemo]=useState(""),[det,setDet]=useState({}),[ticketTotal,setTicketTotal]=useState(""),[ticketUsed,setTicketUsed]=useState(""),[mood,setMood]=useState(null);
  const gymCount=timeline.filter(t=>t.type==="gym").length+1;
  const avStaff=staffList.filter(st=>st.type==="all"||st.type===type);
  const handleSave=()=>{
    if(!staff) return;
    const finalTitle=type==="gym"?(ticketUsed&&ticketTotal?`トレーニング（${ticketUsed}/${ticketTotal}回）`:`トレーニング（第${gymCount}回）`):(title||(ticketUsed&&ticketTotal?`施術（${ticketUsed}/${ticketTotal}回）`:"施術"));
    onAdd({id:"T"+Date.now(),date:td(),time:tt(),type,staff,title:finalTitle,memo,detail:{...det,...(ticketTotal&&{ticketTotal:parseInt(ticketTotal)}),...(ticketUsed&&{ticketUsed:parseInt(ticketUsed)}),...(mood!==null&&{mood})},images:[]});
    onClose();
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div style={{background:"var(--sf)",borderRadius:20,width:"100%",maxWidth:540,maxHeight:"90vh",overflowY:"auto",boxShadow:"var(--sh2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 20px 0",marginBottom:14}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600}}>新規記録を追加</div>
          <button style={{background:"none",border:"none",fontSize:17,cursor:"pointer",color:"var(--t3)"}} onClick={onClose}>✕</button>
        </div>
        <div style={{padding:"0 20px 8px"}}>
          <div className="fg"><label>業態</label><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{Object.entries(TC).map(([k,v])=><button key={k} type="button" style={{padding:"7px 13px",borderRadius:20,border:`1.5px solid ${type===k?v.color:"var(--bd)"}`,fontSize:12,cursor:"pointer",background:type===k?v.color:"var(--bg)",color:type===k?"#fff":"var(--t2)",fontWeight:500}} onClick={()=>{setType(k);setStaff("");}}>{v.icon} {v.label}</button>)}</div></div>
          <div className="fg"><label>担当スタッフ <span style={{color:"var(--err)"}}>*</span></label><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{avStaff.map(st=><button key={st.name} type="button" onClick={()=>setStaff(st.name)} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:20,border:`1.5px solid ${staff===st.name?"var(--ac)":"var(--bd)"}`,fontSize:13,cursor:"pointer",background:staff===st.name?"var(--acl)":"var(--bg)",color:staff===st.name?"var(--ac)":"var(--t2)",fontWeight:staff===st.name?600:400}}><span style={{width:24,height:24,borderRadius:"50%",background:staff===st.name?"var(--ac)":"#bbb",color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{st.name[0]}</span>{st.name}</button>)}</div></div>
          <div className="fg"><label>🎟️ 回数券</label><div style={{display:"flex",alignItems:"center",gap:8,background:"var(--bg)",border:"1.5px solid var(--bd)",borderRadius:12,padding:"10px 14px"}}><span style={{fontSize:12,color:"var(--t3)",whiteSpace:"nowrap"}}>今回</span><input type="number" min="1" placeholder={type==="gym"?String(gymCount):"3"} style={{width:52,border:"none",background:"none",fontSize:20,fontWeight:800,color:"var(--ac)",outline:"none",textAlign:"center"}} value={ticketUsed} onChange={e=>setTicketUsed(e.target.value)}/><span style={{fontSize:14,color:"var(--t3)"}}>回目 ／ 全</span><input type="number" min="1" placeholder="10" style={{width:52,border:"none",background:"none",fontSize:20,fontWeight:800,color:"var(--t1)",outline:"none",textAlign:"center"}} value={ticketTotal} onChange={e=>setTicketTotal(e.target.value)}/><span style={{fontSize:14,color:"var(--t3)"}}>回</span>{ticketUsed&&ticketTotal&&<div style={{marginLeft:"auto",background:parseInt(ticketTotal)-parseInt(ticketUsed)<=2?"#FFF0F0":"#EBF3EB",borderRadius:20,padding:"4px 10px",fontSize:12,fontWeight:700,color:parseInt(ticketTotal)-parseInt(ticketUsed)<=2?"var(--err)":"#4A7A4C",whiteSpace:"nowrap"}}>残り {Math.max(0,parseInt(ticketTotal)-parseInt(ticketUsed))} 回</div>}</div></div>
          {type!=="gym"&&<div className="fg"><label>施術タイトル</label><input placeholder={type==="esthetic"?"例：全身脱毛":"例：ジェルネイル付け替え"} value={title} onChange={e=>setTitle(e.target.value)}/></div>}
          <div className="fg"><label>😊 今日の気分（10点満点）</label><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{[1,2,3,4,5,6,7,8,9,10].map(n=><button key={n} type="button" onClick={()=>setMood(n===mood?null:n)} style={{width:38,height:38,borderRadius:10,border:`1.5px solid ${mood===n?(n<=3?"#E57373":n<=6?"#FFB74D":"#81C784"):"var(--bd)"}`,fontSize:13,fontWeight:700,cursor:"pointer",background:mood===n?(n<=3?"#FFEBEE":n<=6?"#FFF8E7":"#EBF3EB"):"var(--bg)",color:mood===n?(n<=3?"#C62828":n<=6?"#E65100":"#2E7D32"):"var(--t3)"}}>{n}</button>)}{mood!==null&&<div style={{display:"flex",alignItems:"center",marginLeft:4,fontSize:18}}>{mood<=3?"😞":mood<=5?"😐":mood<=7?"🙂":mood<=9?"😊":"🤩"}</div>}</div></div>
          {type==="gym"&&<div className="g2"><div className="fg"><label>体重 (kg)</label><input type="number" placeholder="54.5" onChange={e=>{const w=parseFloat(e.target.value)||undefined;setDet(d=>{const h=d._height;const bmi=w&&h?Math.round((w/(h/100)**2)*10)/10:undefined;return{...d,weight:w,bmi};});}}/></div><div className="fg"><label>体脂肪率 (%)</label><input type="number" placeholder="22.0" onChange={e=>setDet(d=>({...d,fat:parseFloat(e.target.value)||undefined}))}/></div><div className="fg"><label>筋肉量 (kg)</label><input type="number" placeholder="38.5" onChange={e=>setDet(d=>({...d,muscle:parseFloat(e.target.value)||undefined}))}/></div><div className="fg"><label>BMI（身長入力で自動計算）</label><div style={{display:"flex",gap:6}}><input type="number" placeholder="身長(cm)" style={{width:"45%"}} onChange={e=>{const h=parseFloat(e.target.value)||undefined;setDet(d=>{const bmi=d.weight&&h?Math.round((d.weight/(h/100)**2)*10)/10:undefined;return{...d,_height:h,bmi};});}}/><div style={{flex:1,padding:"10px 12px",border:"1.5px solid var(--bd)",borderRadius:10,background:"#F0EEF8",fontSize:14,color:"#6E5FA8",fontWeight:600,textAlign:"center"}}>{det.bmi||"—"}</div></div></div></div>}
          {type==="esthetic"&&<div className="g2"><div className="fg"><label>照射部位</label><input placeholder="両腕・両脚" onChange={e=>setDet(d=>({...d,areas:e.target.value}))}/></div><div className="fg"><label>出力設定</label><input placeholder="腕18J/脚20J" onChange={e=>setDet(d=>({...d,output:e.target.value}))}/></div><div className="fg"><label>肌の状態</label><input placeholder="良好" onChange={e=>setDet(d=>({...d,skin:e.target.value}))}/></div><div className="fg"><label>反応</label><input placeholder="軽微な赤みあり" onChange={e=>setDet(d=>({...d,reaction:e.target.value}))}/></div></div>}
          {type==="nail"&&<div className="g2"><div className="fg"><label>カラー番号</label><input placeholder="OPI #NL L60" onChange={e=>setDet(d=>({...d,color:e.target.value}))}/></div><div className="fg"><label>パーツ詳細</label><input placeholder="ストーン×3" onChange={e=>setDet(d=>({...d,parts:e.target.value}))}/></div><div className="fg" style={{gridColumn:"1/-1"}}><label>爪のコンディション</label><input placeholder="右中指に浮き" onChange={e=>setDet(d=>({...d,condition:e.target.value}))}/></div></div>}
          <div className="fg"><label>会話・メモ</label><textarea rows={3} placeholder="会話内容、気になったこと、次回申し送りなど..." value={memo} onChange={e=>setMemo(e.target.value)}/></div>
        </div>
        <div style={{padding:"12px 20px 20px",display:"flex",gap:9,justifyContent:"flex-end",borderTop:"1px solid var(--bd)"}}><button className="btn-cancel" onClick={onClose}>キャンセル</button><button className="btn-save" onClick={handleSave}>💾 保存</button></div>
      </div>
    </div>
  );
}

// ═══ 管理画面 ═══
function AdminDashboard({ customers, setCustomers, onOpenForm, existingCustomers=[], saveStatus, sbConfig, onOpenSbSettings }) {
  const [search,setSearch]=useState(""),[sel,setSel]=useState(customers[0]),[tab,setTab]=useState("timeline"),[filter,setFilter]=useState("all"),[sbType,setSbType]=useState("all"),[showAdd,setShowAdd]=useState(false),[editCS,setEditCS]=useState(false),[showStaffMgr,setShowStaffMgr]=useState(false);
  const [staffList,setStaffList]=useState([{name:"山田 さくら",type:"esthetic"},{name:"中村 健太",type:"gym"},{name:"鈴木 奈々",type:"nail"},{name:"田中 彩",type:"all"}]);
  const [newStaffName,setNewStaffName]=useState(""),[newStaffType,setNewStaffType]=useState("all");

  useEffect(()=>{ if(sel) setSel(customers.find(c=>c.id===sel.id)||customers[0]); },[customers]);

  const filtered=customers.filter(c=>{
    const ms=c.name.includes(search)||c.phone.includes(search)||c.memberNo.includes(search);
    const mt=sbType==="all"||c.timeline.some(t=>t.type===sbType);
    return ms&&mt;
  });
  const addRecord=r=>setCustomers(prev=>prev.map(c=>c.id!==sel.id?c:{...c,timeline:[r,...c.timeline]}));
  const tl=sel?(filter==="all"?sel.timeline:sel.timeline.filter(t=>t.type===filter)):[];

  return (
    <>
      <style>{BASE_CSS+`
        .app{display:flex;flex-direction:column;height:100vh;max-width:1440px;margin:0 auto}
        .hdr{display:flex;align-items:center;justify-content:space-between;padding:13px 26px;background:var(--sf);border-bottom:1px solid var(--bd);position:sticky;top:0;z-index:100;gap:12px;flex-wrap:wrap}
        .logo{font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:600;letter-spacing:.08em}
        .logo em{font-style:italic;color:var(--ac)}
        .main{display:flex;flex:1;overflow:hidden}
        .sb{width:285px;min-width:240px;background:var(--sf);border-right:1px solid var(--bd);display:flex;flex-direction:column;overflow:hidden}
        .sbtop{padding:16px 13px 11px;border-bottom:1px solid var(--bd)}
        .sinp{width:100%;padding:9px 12px 9px 32px;border:1px solid var(--bd);border-radius:10px;font-size:13px;background:var(--bg);color:var(--t1);outline:none}
        .sblist{flex:1;overflow-y:auto;padding:7px}
        .sb-type-bar{display:flex;gap:5px;padding:10px 13px;border-bottom:1px solid var(--bd);background:var(--bg)}
        .sb-type-btn{flex:1;padding:7px 4px;border-radius:9px;border:none;font-size:11px;font-weight:600;cursor:pointer;background:none;color:var(--t3);transition:all .2s}
        .sb-type-btn.act-all{background:var(--t1);color:#fff}
        .sb-type-btn.act-gym{background:#6C9E6E;color:#fff}
        .sb-type-btn.act-esthetic{background:#C9899A;color:#fff}
        .sb-type-btn.act-nail{background:#9B8EC4;color:#fff}
        .cc{display:flex;align-items:center;gap:11px;padding:11px;border-radius:11px;cursor:pointer;transition:background .15s;margin-bottom:3px}
        .cc:hover{background:var(--bg)}
        .cc.sel{background:var(--acl)}
        .ccav{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--ac),#C4A882);color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;flex-shrink:0}
        .ct{flex:1;overflow-y:auto;background:var(--bg)}
        .ci{padding:22px 26px;max-width:880px}
        .pc{background:var(--sf);border-radius:var(--r);padding:20px 24px;margin-bottom:16px;box-shadow:var(--sh);display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap}
        .pcav{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,var(--ac),#C4A882);color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:25px;font-weight:600;flex-shrink:0}
        .tabs{display:flex;gap:4px;margin-bottom:16px;background:var(--sf);border-radius:12px;padding:4px;box-shadow:var(--sh);width:fit-content}
        .tabbtn{padding:8px 18px;border-radius:9px;border:none;background:none;font-size:13px;font-weight:500;cursor:pointer;color:var(--t3);transition:all .2s}
        .tabbtn.act{background:var(--t1);color:#fff}
        .fbar{display:flex;gap:7px;margin-bottom:16px;flex-wrap:wrap}
        .fb{padding:7px 14px;border-radius:20px;border:1px solid var(--bd);font-size:12px;cursor:pointer;background:var(--sf);color:var(--t2);font-weight:500;transition:all .15s}
        .tlwrap{background:var(--sf);border-radius:var(--r);padding:20px;box-shadow:var(--sh)}
        .new-badge{background:#EBF3EB;color:#4A7A4C;font-size:10px;padding:2px 8px;border-radius:20px;font-weight:700;margin-left:6px}
        @media(max-width:768px){.sb{width:100%;max-height:210px;border-right:none;border-bottom:1px solid var(--bd)}.main{flex-direction:column}.ci{padding:13px}}
      `}</style>
      <div className="app">
        <header className="hdr">
          <div className="logo">SALON <em>Suite</em></div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            {/* 保存ステータス */}
            {saveStatus&&<div style={{fontSize:11,padding:"4px 10px",borderRadius:20,fontWeight:600,background:saveStatus==="saving"?"#FFF8E7":saveStatus==="saved"?"#EBF3EB":"#FFF0F0",color:saveStatus==="saving"?"#7A6010":saveStatus==="saved"?"#2E7D32":"var(--err)"}}>
              {saveStatus==="saving"?"💾 保存中…":saveStatus==="saved"?"✅ 保存済み":"⚠️ 保存失敗"}
            </div>}
            {/* Supabase接続状態 */}
            <button onClick={onOpenSbSettings} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:20,border:`1.5px solid ${sbConfig.url?"#7B68EE":"var(--bd)"}`,background:sbConfig.url?"#F0EEF8":"var(--bg)",color:sbConfig.url?"#7B68EE":"var(--t3)",fontSize:11,fontWeight:600,cursor:"pointer"}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:sbConfig.url?"#7B68EE":"#ccc",display:"inline-block"}}/>
              {sbConfig.url?"Supabase 接続中":"Supabase 未接続"}
            </button>
            <button className="btn-ol" onClick={()=>setShowStaffMgr(true)}>👥 スタッフ管理</button>
            <button className="btn-save" style={{fontSize:12,padding:"8px 14px"}} onClick={onOpenForm}>📱 カウンセリングフォームを開く</button>
          </div>
        </header>
        <div className="main">
          <aside className="sb">
            <div className="sbtop">
              <div style={{fontSize:11,letterSpacing:".12em",color:"var(--t3)",textTransform:"uppercase",marginBottom:9}}>顧客カルテ</div>
              <div style={{position:"relative"}}><span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:13}}>🔍</span><input className="sinp" placeholder="名前・電話・会員番号" value={search} onChange={e=>setSearch(e.target.value)}/></div>
            </div>
            <div className="sb-type-bar">
              {[["all","act-all","すべて"],["gym","act-gym","💪"],["esthetic","act-esthetic","✨"],["nail","act-nail","💅"]].map(([k,cls,icon])=>{
                const count=k==="all"?customers.length:customers.filter(c=>c.timeline.some(t=>t.type===k)).length;
                return <button key={k} className={`sb-type-btn${sbType===k?" "+cls:""}`} onClick={()=>setSbType(k)}>{icon} {count}</button>;
              })}
            </div>
            <div className="sblist">
              {filtered.map(c=>{
                const last=c.timeline[0],cfg=last?TC[last.type]:null;
                return (
                  <div key={c.id} className={`cc${sel?.id===c.id?" sel":""}`} onClick={()=>{setSel(c);setTab("timeline");setEditCS(false)}}>
                    <div className="ccav">{c.avatar}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:500,marginBottom:2}}>{c.name}{c.counseling?.isNew&&<span className="new-badge">NEW</span>}</div>
                      <div style={{fontSize:10,color:"var(--t3)",marginBottom:3}}>{c.memberNo}</div>
                      {cfg&&<div style={{display:"inline-block",fontSize:10,padding:"2px 8px",borderRadius:20,background:cfg.light,color:cfg.color,fontWeight:500}}>{cfg.icon} {cfg.label}</div>}
                      {!c.counseling&&<div style={{fontSize:10,color:"#B8860B",marginTop:2}}>📋 CS未記入</div>}
                      {Array.isArray(c.counseling?.allergyTypes)&&c.counseling.allergyTypes.some(a=>a!=="特になし")&&<div style={{fontSize:10,color:"var(--err)",marginTop:2}}>⚠️ アレルギーあり</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
          <main className="ct">
            {sel&&(
              <div className="ci">
                <div className="pc">
                  <div className="pcav">{sel.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:25,fontWeight:600,lineHeight:1,marginBottom:6}}>{sel.name}{sel.counseling?.isNew&&<span className="new-badge" style={{fontSize:11,verticalAlign:"middle",marginLeft:8}}>NEW CS</span>}</div>
                    <div style={{display:"flex",gap:13,flexWrap:"wrap",marginBottom:8}}>
                      {[["会員番号",sel.memberNo],["Tel",sel.phone],["入会",sel.joinDate],sel.counseling?.age&&["年齢",`${sel.counseling.age}歳`],sel.counseling?.height&&["身長",`${sel.counseling.height}cm`]].filter(Boolean).map(([l,v])=>(
                        <div key={l} style={{fontSize:12,color:"var(--t2)"}}><strong style={{color:"var(--t1)"}}>{l}</strong> {v}</div>
                      ))}
                    </div>
                    {Array.isArray(sel.counseling?.allergyTypes)&&sel.counseling.allergyTypes.some(a=>a!=="特になし")&&<div style={{background:"#FFF0F0",border:"1px solid #F5C6C6",borderRadius:8,padding:"7px 12px",fontSize:12,color:"var(--err)",marginBottom:4}}>⚠️ アレルギー：{sel.counseling.allergyTypes.filter(a=>a!=="特になし").join("・")} {sel.counseling.allergies&&`（${sel.counseling.allergies}）`}</div>}
                    {sel.counseling?.concerns&&sel.counseling.concerns!=="なし"&&<div style={{background:"#FFF8E7",border:"1px solid #F0D98C",borderRadius:8,padding:"7px 12px",fontSize:12,color:"#7A6010"}}>⚠️ 配慮事項：{sel.counseling.concerns}</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:7,flexShrink:0}}>
                    <button className="btn-save" style={{fontSize:12,padding:"9px 15px"}} onClick={()=>setShowAdd(true)}>＋ 記録を追加</button>
                    <button className="btn-ol" onClick={()=>{setTab("counseling");setEditCS(!sel.counseling)}}>{sel.counseling?"📋 CSを見る":"📋 CSを記入"}</button>
                  </div>
                </div>
                <div className="tabs">
                  <button className={`tabbtn${tab==="timeline"?" act":""}`} onClick={()=>{setTab("timeline");setEditCS(false)}}>📅 タイムライン</button>
                  <button className={`tabbtn${tab==="counseling"?" act":""}`} onClick={()=>{setTab("counseling");setEditCS(!sel.counseling)}}>📋 カウンセリング{!sel.counseling?" ⚠️":""}</button>
                </div>
                {tab==="timeline"&&<>
                  <Chart timeline={sel.timeline}/>
                  <div className="fbar">{[["all","var(--t1)","すべて"],["gym","#6C9E6E","💪 ジム"],["esthetic","#C9899A","✨ エステ"],["nail","#9B8EC4","💅 ネイル"]].map(([k,col,l])=><button key={k} className="fb" style={filter===k?{background:col,color:"#fff",borderColor:col}:{}} onClick={()=>setFilter(k)}>{l}</button>)}</div>
                  <div className="tlwrap">
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,letterSpacing:".12em",textTransform:"uppercase",color:"var(--t3)",marginBottom:16}}>Timeline</div>
                    {tl.length===0?<div style={{textAlign:"center",padding:"38px 0",color:"var(--t3)",fontSize:13}}>記録がありません</div>:tl.map((item,i)=><TLItem key={item.id} item={item} isLast={i===tl.length-1}/>)}
                  </div>
                </>}
                {tab==="counseling"&&(sel.counseling&&!editCS
                  ?<CSView c={sel} onEdit={()=>setEditCS(true)}/>
                  :<div style={{background:"var(--sf)",borderRadius:"var(--r)",padding:40,textAlign:"center",boxShadow:"var(--sh)"}}>
                    <div style={{fontSize:38,marginBottom:12}}>📋</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,marginBottom:8}}>カウンセリングシート未記入</div>
                    <div style={{fontSize:13,color:"var(--t3)",marginBottom:20,lineHeight:1.7}}>QRコードからお客様に記入いただくか、<br/>スタッフが直接入力できます。</div>
                    <button className="btn-save" onClick={onOpenForm}>✏️ フォームを開く</button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
      {showAdd&&<AddModal onClose={()=>setShowAdd(false)} onAdd={addRecord} staffList={staffList} timeline={sel?.timeline||[]}/>}
      {showStaffMgr&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20,backdropFilter:"blur(4px)"}} onClick={()=>setShowStaffMgr(false)}>
          <div style={{background:"var(--sf)",borderRadius:20,width:"100%",maxWidth:440,maxHeight:"85vh",overflowY:"auto",boxShadow:"var(--sh2)"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 20px 16px",borderBottom:"1px solid var(--bd)"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600}}>👥 スタッフ管理</div>
              <button style={{background:"none",border:"none",fontSize:17,cursor:"pointer",color:"var(--t3)"}} onClick={()=>setShowStaffMgr(false)}>✕</button>
            </div>
            <div style={{padding:"16px 20px"}}>
              {staffList.map((st,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:11,background:"var(--bg)",marginBottom:7}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,var(--ac),#C4A882)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,flexShrink:0}}>{st.name[0]}</div>
                  <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500}}>{st.name}</div><span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:600,background:st.type==="gym"?"#EBF3EB":st.type==="esthetic"?"#F9EEF1":st.type==="nail"?"#F0EEF8":"#F0F0F0",color:st.type==="gym"?"#4A7A4C":st.type==="esthetic"?"#B06A80":st.type==="nail"?"#6E5FA8":"#666"}}>{st.type==="all"?"全業態":TC[st.type]?.icon+" "+TC[st.type]?.label}</span></div>
                  <button onClick={()=>setStaffList(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"var(--t3)",cursor:"pointer",fontSize:16,padding:"4px 8px"}}>✕</button>
                </div>
              ))}
              <div style={{background:"var(--acl)",borderRadius:12,padding:"14px 16px",marginTop:8}}>
                <div style={{fontSize:12,fontWeight:700,color:"var(--ac)",marginBottom:11}}>＋ スタッフを追加</div>
                <div className="fg" style={{marginBottom:10}}><label>お名前</label><input placeholder="山田 さくら" value={newStaffName} onChange={e=>setNewStaffName(e.target.value)}/></div>
                <div className="fg" style={{marginBottom:12}}><label>担当業態</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{[["all","全業態"],["gym","💪 ジム"],["esthetic","✨ エステ"],["nail","💅 ネイル"]].map(([k,l])=><label key={k} className="rlbl"><input type="radio" name="stype" checked={newStaffType===k} onChange={()=>setNewStaffType(k)}/>{l}</label>)}</div></div>
                <button className="btn-save" style={{width:"100%",padding:11}} onClick={()=>{if(!newStaffName.trim())return;setStaffList(p=>[...p,{name:newStaffName.trim(),type:newStaffType}]);setNewStaffName("");setNewStaffType("all");}}>追加する</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ═══ ルート ═══
export default function App() {
  const [customers, setCustomersRaw] = useState(INIT_CUSTOMERS);
  const [view, setView] = useState("admin");
  const [submittedData, setSubmittedData] = useState(null);
  const [storageReady, setStorageReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [sbConfig, setSbConfig] = useState({ url:"", key:"" });
  const [showSbSettings, setShowSbSettings] = useState(false);
  const [sbClient, setSbClient] = useState(null);
  const [loadingFromSb, setLoadingFromSb] = useState(false);

  // 起動時にローカルストレージから読み込み（Supabaseは使わない）
  useEffect(()=>{
    (async()=>{
      try {
        const local = await loadLocalCustomers();
        if(local && local.length > 0) setCustomersRaw(local);
      } catch(e) {}
      setStorageReady(true);
    })();
  }, []);

  const setCustomers = (updater) => {
    setCustomersRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      return next;
    });
  };

  // データ変更時に保存
  useEffect(()=>{
    if(!storageReady) return;
    setSaveStatus("saving");
    (async()=>{
      try {
        if(sbClient) {
          // Supabaseへ保存（差分のみ - 最新顧客を upsert）
          await saveLocalCustomers(customers); // ローカルにもバックアップ
        } else {
          await saveLocalCustomers(customers);
        }
        setSaveStatus("saved");
        setTimeout(()=>setSaveStatus(null), 2000);
      } catch(e) { setSaveStatus("error"); }
    })();
  }, [customers, storageReady]);

  const handleFormSubmit = async (data) => {
    const newCustomer = {
      id:"C"+Date.now(), name:`${data.lastName} ${data.firstName}`, phone:data.phone,
      memberNo:"MEM-"+String(customers.length+1).padStart(4,"0"),
      joinDate:td(), avatar:data.lastName[0],
      counseling:{...data,isNew:true}, timeline:[],
    };
    if(sbClient) {
      try { await sbClient.upsertCustomer(newCustomer); } catch(e) { console.error(e); }
    }
    setCustomers(prev=>[newCustomer,...prev]);
    setSubmittedData(data); setView("complete");
  };

  const handleAddRecord = async (customerId, record) => {
    if(sbClient) {
      try { await sbClient.upsertRecord(customerId, record); } catch(e) { console.error(e); }
    }
  };

  const handleSbSave = async (url, key) => {
    const client = new SupabaseClient(url, key);
    setSbConfig({url,key}); setSbClient(client);
    // Supabaseから最新データを取得
    setLoadingFromSb(true);
    try {
      const data = await client.getCustomers();
      if(data.length > 0) setCustomersRaw(data);
      else {
        // 既存データをSupabaseにアップロード
        for(const c of customers) {
          await client.upsertCustomer(c);
          for(const r of c.timeline) await client.upsertRecord(c.id, r);
        }
      }
    } catch(e) { console.error(e); }
    setLoadingFromSb(false);
  };

  if(loadingFromSb) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",flexDirection:"column",gap:16,fontFamily:"'Noto Sans JP',sans-serif"}}>
      <div style={{fontSize:32}}>🔄</div>
      <div style={{fontSize:14,color:"#6B6460"}}>Supabaseからデータを読み込み中...</div>
    </div>
  );
  if(view==="form") return <CounselingFormPage onSubmit={handleFormSubmit} onBack={()=>setView("admin")} existingCustomers={customers}/>;
  if(view==="complete") return <CompletePage form={submittedData}/>;
  return (
    <>
      <AdminDashboard
        customers={customers} setCustomers={setCustomers}
        onOpenForm={()=>setView("form")} existingCustomers={customers}
        saveStatus={saveStatus} sbConfig={sbConfig}
        onOpenSbSettings={()=>setShowSbSettings(true)}
      />
      {showSbSettings&&<SupabaseSettingsModal
        onClose={()=>setShowSbSettings(false)}
        onSave={handleSbSave}
        currentUrl={sbConfig.url} currentKey={sbConfig.key}
      />}
    </>
  );
}
