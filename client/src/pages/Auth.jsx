import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api.js';

export default function Auth({ mode }) {
  const signup = mode === 'signup';
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try {
      const { data } = await api.post(`/auth/${signup ? 'register' : 'login'}`, f);
      localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user));
      nav('/app');
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };
  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(ellipse_at_center,#dff5e6,#fff_70%)] p-5">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border bg-white p-8 shadow-sm">
        <Link to="/" className="text-2xl font-bold">resume<span className="text-brand">.</span></Link>
        <h1 className="text-xl font-medium">{signup ? 'Create your account' : 'Welcome back'}</h1>
        {signup && <input className="input" placeholder="Full name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}
        <input className="input" type="email" placeholder="Email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password (6+ characters)" required minLength={6} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        <button disabled={busy} className="btn btn-primary w-full py-3">{busy ? 'Please wait…' : signup ? 'Sign up' : 'Log in'}</button>
        <p className="text-center text-sm text-slate-500">{signup ? 'Already have an account?' : 'New here?'} <Link className="text-brand" to={signup ? '/login' : '/signup'}>{signup ? 'Log in' : 'Sign up'}</Link></p>
      </form>
    </div>
  );
}
