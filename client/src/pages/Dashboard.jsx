import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, UploadCloud, Trash2, Pencil, Link2, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api.js';
import Resume from '../Resume.jsx';
import { blank } from '../sample.js';

export default function Dashboard() {
  const nav = useNavigate();
  const file = useRef();
  const [list, setList] = useState(null);
  const [busy, setBusy] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const load = () => api.get('/resumes').then((r) => setList(r.data)).catch((e) => toast.error(errMsg(e)));
  useEffect(() => { load(); }, []);

  const create = async () => { const { data } = await api.post('/resumes', blank); nav(`/app/builder/${data._id}`); };
  const remove = async (id) => { if (confirm('Delete this resume?')) { await api.delete(`/resumes/${id}`); load(); } };
  const copy = (r) => {
    if (!r.isPublic) return toast('Turn on sharing in the editor first');
    navigator.clipboard.writeText(`${location.origin}/r/${r._id}`); toast.success('Link copied');
  };
  const optimize = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const fd = new FormData(); fd.append('file', f); setBusy(true);
    try { const { data } = await api.post('/ai/parse-resume', fd); toast.success('Resume optimized'); nav(`/app/builder/${data._id}`); }
    catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); e.target.value = ''; }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <Link to="/" className="text-xl font-bold">resume<span className="text-brand">.</span></Link>
        <div className="flex items-center gap-4 text-sm"><span className="hidden sm:block">{user.name}</span>
          <button className="btn btn-ghost" onClick={() => { localStorage.clear(); nav('/'); }}><LogOut size={14} /> Log out</button></div>
      </header>
      <main className="mx-auto max-w-6xl p-6">
        <h1 className="text-2xl font-medium">Your resumes</h1>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={create} className="btn btn-primary"><Plus size={16} /> Create new resume</button>
          <button onClick={() => file.current.click()} disabled={busy} className="btn btn-ghost"><UploadCloud size={16} /> {busy ? 'Optimizing with AI…' : 'Upload PDF and optimize with AI'}</button>
          <input ref={file} type="file" accept="application/pdf" hidden onChange={optimize} />
        </div>
        {list && list.length === 0 && <p className="mt-16 text-center text-slate-500">No resumes yet. Create one or upload your current PDF.</p>}
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {list?.map((r) => (
            <div key={r._id} className="rounded-xl border bg-white p-3 shadow-sm">
              <Link to={`/app/builder/${r._id}`} className="block overflow-hidden rounded border"><Resume data={r} scale={0.26} /></Link>
              <p className="mt-3 truncate text-sm font-medium">{r.title}</p>
              <p className="text-xs text-slate-400">{r.isPublic ? 'Shared' : 'Private'} · {new Date(r.updatedAt).toLocaleDateString()}</p>
              <div className="mt-2 flex gap-3 text-slate-500">
                <Link to={`/app/builder/${r._id}`} aria-label="Edit"><Pencil size={16} /></Link>
                <button onClick={() => copy(r)} aria-label="Copy link"><Link2 size={16} /></button>
                <button onClick={() => remove(r._id)} aria-label="Delete" className="hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>))}
        </div>
      </main>
    </div>
  );
}
