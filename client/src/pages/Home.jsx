import { Link } from 'react-router-dom';
import { Sparkles, Video, PenLine, Star, Share2, Eraser, LayoutTemplate, BadgeCheck, Menu } from 'lucide-react';
import { useState } from 'react';
import Resume, { TEMPLATES } from '../Resume.jsx';
import { sample } from '../sample.js';

const features = [
  { icon: Sparkles, t: 'AI that sharpens your wording', d: 'Paste a summary or upload an old PDF. Gemini rewrites it with strong verbs and clear results.', c: '#7c3aed', bg: '#ede9fe' },
  { icon: PenLine, t: 'Live preview while you type', d: 'Edit on the left, see the finished page on the right. Switch among 12 templates and 12 colors anytime.', c: '#00a651', bg: '#e6f7ec' },
  { icon: Share2, t: 'One link, always up to date', d: 'Turn on sharing and send recruiters a link. Update your resume and the link updates too.', c: '#ea580c', bg: '#ffedd5' },
];
const people = ['Avery Johnson', 'Briar Martin', 'Jordan Lee', 'Priya Nair', 'Sam Okafor', 'Mina Park'];
const quotes = ['Uploaded my old PDF and had a sharper resume in two minutes.', 'The live link got me an interview reply the same day.', 'Twelve templates and I still could not pick, so I switched colors instead.', 'Background removal made my photo look like a real headshot.', 'Finally a builder that does not fight me on formatting.', 'The AI rewrite kept my facts and fixed my wording.'];
const Initial = ({ n, i }) => <span className="grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-white" style={{ background: ['#00a651', '#2563eb', '#7c3aed', '#e11d48', '#ea580c'][i % 5] }}>{n[0]}</span>;
const Card = ({ i }) => (
  <div className="w-64 shrink-0 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
    <div className="flex items-center gap-3"><Initial n={people[i % 6]} i={i} /><div><p className="flex items-center gap-1 text-sm font-medium">{people[i % 6]} <BadgeCheck size={14} className="text-brand" /></p><p className="text-xs text-slate-500">@{people[i % 6].split(' ')[0].toLowerCase()}</p></div></div>
    <p className="mt-3 text-sm text-slate-700">{quotes[i % 6]}</p>
  </div>
);
const Row = ({ rev, off }) => (
  <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
    <div className={`marquee flex w-max gap-4 py-2 ${rev ? 'rev' : ''}`}>{[...Array(12)].map((_, i) => <Card key={i} i={i + off} />)}</div>
  </div>
);

export default function Home() {
  const [open, setOpen] = useState(0);
  const [menu, setMenu] = useState(false);
  return (
    <div className="bg-white">
      <div className="bg-gradient-to-r from-brand-soft to-lime-200 py-2 text-center text-xs"><span className="mr-2 rounded-md bg-brand px-2 py-0.5 font-medium text-white">New</span>AI Feature Added</div>

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link to="/" className="text-2xl font-bold tracking-tight">resume<span className="text-brand">.</span></Link>
        <div className="hidden gap-8 text-sm md:flex">{['Home:#top', 'Features:#features', 'Templates:#templates', 'Testimonials:#testimonials', 'Contact:#contact'].map((l) => <a key={l} href={l.split(':')[1]} className="hover:text-brand">{l.split(':')[0]}</a>)}</div>
        <div className="hidden gap-2 md:flex"><Link to="/signup" className="btn btn-primary">Get started</Link><Link to="/login" className="btn btn-ghost">Login</Link></div>
        <button className="md:hidden" aria-label="Menu" onClick={() => setMenu(!menu)}><Menu /></button>
      </nav>
      {menu && <div className="flex flex-col gap-3 px-5 pb-4 md:hidden"><Link to="/signup" className="btn btn-primary">Get started</Link><Link to="/login" className="btn btn-ghost">Login</Link></div>}

      <header id="top" className="relative bg-[radial-gradient(ellipse_at_center,#dff5e6_0%,#fff_65%)] px-5 pb-20 pt-14 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="flex -space-x-2">{people.slice(0, 5).map((n, i) => <span key={n} className="rounded-full ring-2 ring-white"><Initial n={n} i={i} /></span>)}</div>
          <div className="text-left"><div className="flex text-brand">{[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}</div><p className="text-xs">Used by 10,000+ users</p></div>
        </div>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">Land your dream job with <span className="text-brand">AI-powered</span> resumes.</h1>
        <p className="mx-auto mt-6 max-w-md text-sm text-slate-700 md:text-base">Create, edit and download professional resumes with AI-powered assistance.</p>
        <div className="mt-8 flex justify-center gap-3"><Link to="/signup" className="btn btn-primary px-7 py-3">Get started →</Link><a href="#templates" className="btn btn-ghost px-7 py-3"><Video size={16} /> Try demo</a></div>
        <p className="mt-14 text-sm text-slate-500">Trusted by leading brands, including</p>
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-x-12 gap-y-4 text-lg font-semibold text-slate-400">{['Instagram', 'Framer', 'Microsoft', 'HUAWEI', 'Walmart'].map((b) => <span key={b}>{b}</span>)}</div>
      </header>

      <section id="features" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-center text-3xl font-medium text-slate-800">Build your resume</h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-slate-500">Our streamlined process helps you create a professional resume in minutes with intelligent AI-powered tools and features.</p>
        <div className="mt-14 grid items-center gap-10 md:grid-cols-2">
          <div className="relative mx-auto h-[420px] w-[320px] rounded-3xl p-6" style={{ background: `radial-gradient(circle, ${features[open].bg}, transparent 70%)` }}>
            <div className="absolute left-0 top-0 overflow-hidden rounded-2xl shadow-xl"><Resume data={{ ...sample, template: 'modern' }} scale={0.3} /></div>
            <div className="absolute bottom-0 right-0 overflow-hidden rounded-2xl shadow-xl"><Resume data={{ ...sample, template: 'banner', accent: features[open].c }} scale={0.3} /></div>
          </div>
          <div className="space-y-3">{features.map((f, i) => (
            <button key={f.t} onClick={() => setOpen(i)} className="block w-full rounded-xl border p-5 text-left transition" style={i === open ? { background: f.bg, borderColor: f.c + '55' } : { borderColor: 'transparent' }}>
              <p className="flex items-center gap-3 font-medium"><f.icon size={20} style={{ color: f.c }} />{f.t}</p>
              <p className="mt-1 pl-8 text-sm text-slate-600">{f.d}</p>
            </button>))}</div>
        </div>
      </section>

      <section id="templates" className="bg-slate-50 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="flex items-center justify-center gap-2 text-center text-3xl font-medium"><LayoutTemplate className="text-brand" /> 12 templates, 12 colors</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-slate-500">Every template works with every color, and you can switch after you start writing.</p>
          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">{TEMPLATES.map((t, i) => (
            <Link key={t.id} to="/signup" className="group block">
              <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm"><Resume data={{ ...sample, template: t.id, accent: ['#00a651', '#2563eb', '#7c3aed', '#e11d48', '#ea580c', '#0d9488'][i % 6] }} scale={0.28} /></div>
              <p className="mt-2 text-center text-sm font-medium group-hover:text-brand">{t.name}</p>
            </Link>))}</div>
        </div>
      </section>

      <section id="testimonials" className="py-20">
        <div className="text-center"><span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-sm text-brand-dark"><Eraser size={14} /> Testimonials</span>
          <h2 className="mt-5 text-3xl font-medium">Don't just take our words</h2>
          <p className="mx-auto mt-3 max-w-md text-slate-500">Hear what our users say about us. We're always looking for ways to improve. If you have a positive experience with us, leave a review.</p></div>
        <div className="mt-12 space-y-4"><Row off={0} /><Row rev off={3} /></div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-20">
        <div className="flex flex-col items-start justify-between gap-6 border-y border-dashed border-slate-300 py-10 md:flex-row md:items-center">
          <h2 className="max-w-sm text-xl font-medium">Build a Professional Resume That Helps You Stand Out and Get Hired</h2>
          <Link to="/signup" className="btn rounded-md bg-brand-dark px-8 py-3 text-white hover:bg-brand">Get Started →</Link>
        </div>
      </section>

      <footer id="contact" className="bg-gradient-to-b from-white to-brand-soft px-5 pb-8 pt-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr_1.4fr]">
          <p className="text-2xl font-bold">resume<span className="text-brand">.</span></p>
          {[['Product', ['Home', 'Support', 'Pricing', 'Affiliate']], ['Resources', ['Company', 'Blogs', 'Community', 'Careers', 'About']], ['Legal', ['Privacy', 'Terms']]].map(([h, ls]) => (
            <div key={h}><p className="mb-3 text-sm font-semibold">{h}</p>{ls.map((l) => <p key={l} className="mb-2 text-sm text-slate-600">{l}{l === 'Careers' && <span className="ml-2 rounded-md bg-brand-dark px-2 py-0.5 text-xs text-white">We're hiring!</span>}</p>)}</div>))}
          <div className="text-sm text-slate-600"><p>Making every customer feel valued—no matter the size of your audience.</p><p className="mt-6">© 2026 Resume Builder</p></div>
        </div>
      </footer>
    </div>
  );
}
