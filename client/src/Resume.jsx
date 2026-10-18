// 12 resume templates driven by config: layout + sidebar style + font + heading style.
export const TEMPLATES = [
  { id: 'modern',    name: 'Modern',    layout: 'sidebar', side: 'left',  sideStyle: 'fill', font: 'Poppins', head: 'bar' },
  { id: 'executive', name: 'Executive', layout: 'sidebar', side: 'right', sideStyle: 'tint', font: 'Playfair Display', head: 'underline' },
  { id: 'classic',   name: 'Classic',   layout: 'single',  font: 'Playfair Display', head: 'underline' },
  { id: 'minimal',   name: 'Minimal',   layout: 'single',  font: 'Inter', head: 'plain' },
  { id: 'banner',    name: 'Banner',    layout: 'banner',  font: 'Poppins', head: 'bar' },
  { id: 'centered',  name: 'Centered',  layout: 'center',  font: 'Playfair Display', head: 'caps' },
  { id: 'creative',  name: 'Creative',  layout: 'sidebar', side: 'left',  sideStyle: 'tint', font: 'Poppins', head: 'pill' },
  { id: 'compact',   name: 'Compact',   layout: 'twocol',  font: 'Inter', head: 'underline' },
  { id: 'elegant',   name: 'Elegant',   layout: 'center',  font: 'Playfair Display', head: 'underline', frame: true },
  { id: 'bold',      name: 'Bold',      layout: 'banner',  font: 'Poppins', head: 'pill', big: true },
  { id: 'tech',      name: 'Tech',      layout: 'sidebar', side: 'left',  sideStyle: 'dark', font: 'JetBrains Mono', head: 'bar' },
  { id: 'timeline',  name: 'Timeline',  layout: 'single',  font: 'Inter', head: 'caps', timeline: true },
];

export const COLORS = ['#00a651', '#0ea5e9', '#2563eb', '#4f46e5', '#7c3aed', '#c026d3', '#e11d48', '#ea580c', '#d97706', '#0d9488', '#475569', '#111827'];

const lines = (t = '') => t.split('\n').filter(Boolean);

export default function Resume({ data, scale = 1 }) {
  const t = TEMPLATES.find((x) => x.id === data.template) || TEMPLATES[0];
  const c = data.accent || '#00a651';
  const p = data.personal || {};
  const contact = [p.email, p.phone, p.location, p.website].filter(Boolean);

  const H = ({ children, light }) => {
    const base = 'mb-2 mt-5 text-[13px] font-bold';
    const col = light ? '#fff' : c;
    if (t.head === 'bar') return <h3 className={base} style={{ borderLeft: `4px solid ${col}`, paddingLeft: 8, color: light ? '#fff' : '#111' }}>{children}</h3>;
    if (t.head === 'underline') return <h3 className={base} style={{ borderBottom: `2px solid ${col}`, paddingBottom: 2, color: light ? '#fff' : '#111' }}>{children}</h3>;
    if (t.head === 'caps') return <h3 className={`${base} uppercase tracking-[0.18em]`} style={{ color: col }}>{children}</h3>;
    if (t.head === 'pill') return <h3 className={`${base} inline-block rounded-full px-3 py-0.5 text-white`} style={{ background: light ? 'rgba(255,255,255,.25)' : c }}>{children}</h3>;
    return <h3 className={base} style={{ color: col }}>{children}</h3>;
  };

  const Photo = () => data.photo && (
    <img src={data.photo} alt="" className={`h-28 w-28 object-cover ${t.layout === 'sidebar' ? 'mx-auto mb-4 rounded-full' : 'rounded-full'}`} style={{ background: 'rgba(255,255,255,.3)' }} />
  );

  const Summary = () => data.summary && <><H>Summary</H><p className="text-[12px] leading-relaxed">{data.summary}</p></>;
  const Exp = () => data.experience?.length > 0 && <><H>Experience</H>{data.experience.map((e, i) => (
    <div key={i} className="mb-3" style={t.timeline ? { borderLeft: `2px solid ${c}`, paddingLeft: 12 } : {}}>
      <div className="flex justify-between text-[12px] font-semibold"><span>{e.role}{e.company && ` · ${e.company}`}</span><span className="text-slate-500">{e.period}</span></div>
      {lines(e.desc).map((l, j) => <p key={j} className="text-[11.5px] leading-snug text-slate-700">{l}</p>)}
    </div>))}</>;
  const Edu = () => data.education?.length > 0 && <><H>Education</H>{data.education.map((e, i) => (
    <div key={i} className="mb-2 flex justify-between text-[12px]"><span><b>{e.degree}</b>{e.school && `, ${e.school}`}</span><span className="text-slate-500">{e.period}</span></div>))}</>;
  const Proj = () => data.projects?.length > 0 && <><H>Projects</H>{data.projects.map((e, i) => (
    <div key={i} className="mb-2 text-[12px]"><b>{e.name}</b><p className="text-[11.5px] text-slate-700">{e.desc}</p></div>))}</>;
  const Skills = ({ chips }) => data.skills?.length > 0 && <><H light={chips === 'light'}>Skills</H><div className="flex flex-wrap gap-1.5">{data.skills.map((s, i) => (
    <span key={i} className="rounded px-2 py-0.5 text-[11px]" style={chips === 'light' ? { background: 'rgba(255,255,255,.2)', color: '#fff' } : { background: c + '1f', color: '#222' }}>{s}</span>))}</div></>;

  const Name = ({ cls = '', color }) => <><h1 className={`font-bold leading-tight ${t.big ? 'text-5xl' : 'text-3xl'} ${cls}`} style={{ color }}>{p.name || 'Your Name'}</h1>
    <p className="text-[14px]" style={{ color: color ? 'inherit' : c }}>{p.role}</p></>;

  let body;
  if (t.layout === 'sidebar') {
    const bg = t.sideStyle === 'fill' ? c : t.sideStyle === 'dark' ? '#111827' : c + '18';
    const light = t.sideStyle !== 'tint';
    const side = (
      <aside className="w-[240px] shrink-0 p-6" style={{ background: bg, color: light ? '#fff' : '#222' }}>
        <Photo />
        <H light={light}>Contact</H>
        {contact.map((x, i) => <p key={i} className="mb-1 break-words text-[11.5px]">{x}</p>)}
        <Skills chips={light ? 'light' : undefined} />
      </aside>);
    const main = <main className="flex-1 p-8"><Name /><Summary /><Exp /><Proj /><Edu /></main>;
    body = <div className="flex min-h-full">{t.side === 'left' ? <>{side}{main}</> : <>{main}{side}</>}</div>;
  } else if (t.layout === 'banner') {
    body = <><header className="flex items-center gap-5 px-10 py-8 text-white" style={{ background: c }}>
      {data.photo && <img src={data.photo} alt="" className="h-24 w-24 rounded-full object-cover" />}
      <div><Name color="#fff" /><p className="mt-1 text-[11.5px] opacity-90">{contact.join('  |  ')}</p></div></header>
      <div className="px-10 pb-8"><Summary /><Exp /><Proj /><Edu /><Skills /></div></>;
  } else if (t.layout === 'center') {
    body = <div className="m-6 min-h-[1070px] p-8" style={t.frame ? { border: `3px double ${c}` } : {}}>
      <div className="flex flex-col items-center text-center"><Photo /><Name /><p className="mt-1 text-[11.5px] text-slate-600">{contact.join('  ·  ')}</p></div>
      <Summary /><Exp /><Proj /><Edu /><Skills /></div>;
  } else if (t.layout === 'twocol') {
    body = <div className="p-8"><div className="flex items-center gap-4">{data.photo && <Photo />}<div><Name /><p className="text-[11.5px] text-slate-600">{contact.join('  ·  ')}</p></div></div>
      <Summary /><div className="grid grid-cols-[1.7fr_1fr] gap-8"><div><Exp /><Proj /></div><div><Skills /><Edu /></div></div></div>;
  } else {
    body = <div className="p-10"><div className="flex items-center gap-5">{data.photo && <Photo />}<div><Name /><p className="text-[11.5px] text-slate-600">{contact.join('  ·  ')}</p></div></div>
      <Summary /><Exp /><Proj /><Edu /><Skills /></div>;
  }

  return (
    <div className="resume-page overflow-hidden bg-white text-slate-900 shadow-lg" style={{ width: 794, minHeight: 1123, fontFamily: `'${t.font}', sans-serif`, zoom: scale }}>
      {body}
    </div>
  );
}
