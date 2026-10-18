import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import Resume from '../Resume.jsx';

export default function Public() {
  const { id } = useParams();
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { api.get(`/public/${id}`).then((r) => setD(r.data)).catch((e) => setErr(errMsg(e))); }, [id]);
  if (err) return <div className="grid min-h-screen place-items-center text-center"><div><p>{err}</p><Link to="/" className="text-brand">Go to resume.</Link></div></div>;
  if (!d) return null;
  return (
    <div className="min-h-screen bg-slate-100 py-6">
      <div className="mx-auto mb-4 flex max-w-[794px] justify-end"><button className="btn btn-primary" onClick={() => window.print()}>Download PDF</button></div>
      <div className="flex justify-center overflow-x-auto px-2"><Resume data={d} /></div>
    </div>
  );
}
