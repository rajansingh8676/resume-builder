import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Plus, X, Download, Link2, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api.js';
import Resume, { TEMPLATES, COLORS } from '../Resume.jsx';

const Field = ({ label, children }) => <label className="block text-xs font-medium text-slate-500">{label}<div className="mt-1">{children}</div></label>;

export default function Builder() {
  const { id } = useParams();
  const [d, setD] = useState(null);
  const [saving, setSaving] = useState(false);
  const [ai, setAi] = useState('');
  const [removeBg, setRemoveBg] = useState(true);
  const [tab, setTab] = useState('content');
  const photo = useRef();

  useEffect(() => { api.get(`/resumes/${id}`).then((r) => setD(r.data)).catch((e) => toast.error(errMsg(e))); }, [id]);
  if (!d) return null;

  const set = (k, v) => setD((s) => ({ ...s, [k]: v }));
  const setP = (k, v) => setD((s) => ({ ...s, personal: { ...s.personal, [k]: v } }));
  const setItem = (key, i, k, v) => setD((s) => ({ ...s, [key]: s[key].map((x, j) => (j === i ? { ...x, [k]: v } : x)) }));
  const add = (key, item) => setD((s) => ({ ...s, [key]: [...(s[key] || []), item] }));
  const del = (key, i) => setD((s) => ({ ...s, [key]: s[key].filter((_, j) => j !== i) }));

  const save = async (patch = {}) => {
    setSaving(true);
    try { const { data } = await api.put(`/resumes/${id}`, { ...d, ...patch }); setD(data); toast.success('Saved'); }
    catch (e) { toast.error(errMsg(e)); } finally { setSaving(false); }
  };
  const enhance = async (text, kind, apply, key) => {
    if (!text?.trim()) return toast('Write something first');
    setAi(key);
    try { const { data } = await api.post('/ai/enhance', { text, kind }); apply(data.text); }
    catch (e) { toast.error(errMsg(e)); } finally { setAi(''); }
  };
  const upload = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const fd = new FormData(); fd.append('file', f); fd.append('removeBg', removeBg);
    const t = toast.loading('Uploading photo…');
    try { const { data } = await api.post('/upload/photo', fd); set('photo', data.url); toast.success('Photo added', { id: t }); }
    catch (err) { toast.error(errMsg(err), { id: t }); }
  };
  const share = async () => {
    if (!d.isPublic) { await save({ isPublic: true }); }
    navigator.clipboard.writeText(`${location.origin}/r/${id}`); toast.success('Public link copied');
  };
  const AiBtn = ({ k, onClick }) => <button type="button" onClick={onClick} disabled={ai === k} className="flex items-center gap-1 text-xs text-violet-600"><Sparkles size={12} />{ai === k ? 'Improving…' : 'Improve with AI'}</button>;

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      <header className="flex flex-wrap items-center gap-3 border-b bg-white px-4 py-3">
        <Link to="/app" aria-label="Back"><ArrowLeft size={18} /></Link>
        <input className="input max-w-xs" value={d.title} onChange={(e) => set('title', e.target.value)} />
        <label className="ml-auto flex items-center gap-2 text-sm"><input type="checkbox" checked={d.isPublic} onChange={(e) => set('isPublic', e.target.checked)} /> Public link</label>
        <button className="btn btn-ghost" onClick={share}><Link2 size={14} /> Share</button>
        <button className="btn btn-ghost" onClick={() => window.print()}><Download size={14} /> PDF</button>
        <button className="btn btn-primary" disabled={saving} onClick={() => save()}><Save size={14} /> {saving ? 'Saving…' : 'Save'}</button>
      </header>

      <div className="grid min-h-0 flex-1 md:grid-cols-[440px_1fr]">
        <aside className="overflow-y-auto border-r bg-white p-4">
          <div className="mb-4 flex gap-2">{['content', 'design'].map((t) => <button key={t} onClick={() => setTab(t)} className={`btn flex-1 capitalize ${tab === t ? 'btn-primary' : 'btn-ghost'}`}>{t}</button>)}</div>

          {tab === 'design' && <div className="space-y-5">
            <div><p className="mb-2 text-sm font-medium">Template</p><div className="grid grid-cols-3 gap-2">{TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => set('template', t.id)} className={`overflow-hidden rounded-lg border-2 text-xs ${d.template === t.id ? 'border-brand' : 'border-transparent'}`}>
                <div className="pointer-events-none"><Resume data={{ ...d, template: t.id }} scale={0.12} /></div><p className="py-1">{t.name}</p></button>))}</div></div>
            <div><p className="mb-2 text-sm font-medium">Color</p><div className="flex flex-wrap items-center gap-2">
              {COLORS.map((c) => <button key={c} aria-label={c} onClick={() => set('accent', c)} className="h-8 w-8 rounded-full ring-offset-2" style={{ background: c, boxShadow: d.accent === c ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : 'none' }} />)}
              <label className="flex items-center gap-1 text-xs text-slate-500">Custom <input type="color" value={d.accent} onChange={(e) => set('accent', e.target.value)} /></label></div></div>
          </div>}

          {tab === 'content' && <div className="space-y-5">
            <section className="space-y-3"><p className="text-sm font-medium">Photo</p>
              <div className="flex items-center gap-3">
                {d.photo ? <img src={d.photo} alt="" className="h-14 w-14 rounded-full bg-slate-200 object-cover" /> : <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-100"><ImagePlus size={18} /></div>}
                <button className="btn btn-ghost" onClick={() => photo.current.click()}>Upload</button>
                {d.photo && <button className="text-xs text-red-600" onClick={() => set('photo', '')}>Remove</button>}
                <input ref={photo} type="file" accept="image/*" hidden onChange={upload} />
              </div>
              <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} /> Remove background</label></section>

            <section className="grid grid-cols-2 gap-3"><p className="col-span-2 text-sm font-medium">Personal details</p>
              {[['name', 'Full name'], ['role', 'Job title'], ['email', 'Email'], ['phone', 'Phone'], ['location', 'Location'], ['website', 'Website']].map(([k, l]) => (
                <Field key={k} label={l}><input className="input" value={d.personal?.[k] || ''} onChange={(e) => setP(k, e.target.value)} /></Field>))}</section>

            <section><div className="mb-1 flex justify-between"><p className="text-sm font-medium">Summary</p>
              <AiBtn k="sum" onClick={() => enhance(d.summary, 'summary', (t) => set('summary', t), 'sum')} /></div>
              <textarea className="input h-24" value={d.summary || ''} onChange={(e) => set('summary', e.target.value)} /></section>

            <section className="space-y-3"><div className="flex justify-between"><p className="text-sm font-medium">Experience</p>
              <button className="text-xs text-brand" onClick={() => add('experience', { company: '', role: '', period: '', desc: '' })}><Plus size={12} className="inline" /> Add</button></div>
              {d.experience?.map((x, i) => (
                <div key={i} className="space-y-2 rounded-lg border p-3"><div className="grid grid-cols-2 gap-2">
                  <input className="input" placeholder="Role" value={x.role} onChange={(e) => setItem('experience', i, 'role', e.target.value)} />
                  <input className="input" placeholder="Company" value={x.company} onChange={(e) => setItem('experience', i, 'company', e.target.value)} />
                  <input className="input col-span-2" placeholder="2022 – Now" value={x.period} onChange={(e) => setItem('experience', i, 'period', e.target.value)} /></div>
                  <textarea className="input h-20" placeholder="What did you achieve? One line per bullet." value={x.desc} onChange={(e) => setItem('experience', i, 'desc', e.target.value)} />
                  <div className="flex justify-between"><AiBtn k={`e${i}`} onClick={() => enhance(x.desc, 'experience', (t) => setItem('experience', i, 'desc', t), `e${i}`)} />
                    <button className="text-xs text-red-600" onClick={() => del('experience', i)}>Delete</button></div></div>))}</section>

            <section className="space-y-3"><div className="flex justify-between"><p className="text-sm font-medium">Education</p>
              <button className="text-xs text-brand" onClick={() => add('education', { school: '', degree: '', period: '' })}><Plus size={12} className="inline" /> Add</button></div>
              {d.education?.map((x, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 rounded-lg border p-3">
                  <input className="input" placeholder="Degree" value={x.degree} onChange={(e) => setItem('education', i, 'degree', e.target.value)} />
                  <input className="input" placeholder="School" value={x.school} onChange={(e) => setItem('education', i, 'school', e.target.value)} />
                  <input className="input" placeholder="2016 – 2019" value={x.period} onChange={(e) => setItem('education', i, 'period', e.target.value)} />
                  <button className="text-right text-xs text-red-600" onClick={() => del('education', i)}>Delete</button></div>))}</section>

            <section className="space-y-3"><div className="flex justify-between"><p className="text-sm font-medium">Projects</p>
              <button className="text-xs text-brand" onClick={() => add('projects', { name: '', desc: '' })}><Plus size={12} className="inline" /> Add</button></div>
              {d.projects?.map((x, i) => (
                <div key={i} className="space-y-2 rounded-lg border p-3">
                  <input className="input" placeholder="Project name" value={x.name} onChange={(e) => setItem('projects', i, 'name', e.target.value)} />
                  <textarea className="input h-16" placeholder="What it does" value={x.desc} onChange={(e) => setItem('projects', i, 'desc', e.target.value)} />
                  <button className="text-xs text-red-600" onClick={() => del('projects', i)}>Delete</button></div>))}</section>

            <section><p className="mb-1 text-sm font-medium">Skills <span className="font-normal text-slate-400">(comma separated)</span></p>
              <input className="input" value={(d.skills || []).join(', ')} onChange={(e) => set('skills', e.target.value.split(',').map((s) => s.trimStart()))} onBlur={() => set('skills', (d.skills || []).map((s) => s.trim()).filter(Boolean))} /></section>
          </div>}
        </aside>

        <main className="overflow-auto p-4 md:p-8"><div className="mx-auto w-fit"><Resume data={d} /></div></main>
      </div>
    </div>
  );
}
