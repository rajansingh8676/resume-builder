import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import ImageKit from 'imagekit';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { User, Resume } from './models.js';

const r = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const wrap = (fn) => (req, res) => fn(req, res).catch((e) => { console.error(e); res.status(500).json({ message: e.message }); });

const auth = (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    req.uid = jwt.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch { res.status(401).json({ message: 'Please sign in again' }); }
};
const sign = (u) => ({
  token: jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
  user: { id: u._id, name: u.name, email: u.email },
});

// ---- Auth
r.post('/auth/register', wrap(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6) return res.status(400).json({ message: 'Name, email and a 6+ character password are required' });
  if (await User.findOne({ email })) return res.status(409).json({ message: 'That email is already registered' });
  res.json(sign(await User.create({ name, email, password: await bcrypt.hash(password, 10) })));
}));
r.post('/auth/login', wrap(async (req, res) => {
  const u = await User.findOne({ email: req.body.email });
  if (!u || !(await bcrypt.compare(req.body.password || '', u.password))) return res.status(401).json({ message: 'Wrong email or password' });
  res.json(sign(u));
}));

// ---- Resumes
r.get('/resumes', auth, wrap(async (req, res) => res.json(await Resume.find({ user: req.uid }).sort('-updatedAt'))));
r.post('/resumes', auth, wrap(async (req, res) => res.json(await Resume.create({ ...req.body, user: req.uid }))));
r.get('/resumes/:id', auth, wrap(async (req, res) => {
  const d = await Resume.findOne({ _id: req.params.id, user: req.uid });
  d ? res.json(d) : res.status(404).json({ message: 'Resume not found' });
}));
r.put('/resumes/:id', auth, wrap(async (req, res) => {
  const { _id, user, ...body } = req.body;
  const d = await Resume.findOneAndUpdate({ _id: req.params.id, user: req.uid }, body, { new: true });
  d ? res.json(d) : res.status(404).json({ message: 'Resume not found' });
}));
r.delete('/resumes/:id', auth, wrap(async (req, res) => { await Resume.deleteOne({ _id: req.params.id, user: req.uid }); res.json({ ok: true }); }));
r.get('/public/:id', wrap(async (req, res) => {
  const d = await Resume.findOne({ _id: req.params.id, isPublic: true });
  d ? res.json(d) : res.status(404).json({ message: 'This resume is private or does not exist' });
}));

// ---- Photo upload (ImageKit). removeBg=true applies ImageKit's AI background removal.
r.post('/upload/photo', auth, upload.single('file'), wrap(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file received' });
  const ik = new ImageKit({ publicKey: process.env.IMAGEKIT_PUBLIC_KEY, privateKey: process.env.IMAGEKIT_PRIVATE_KEY, urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT });
  const out = await ik.upload({ file: req.file.buffer, fileName: `photo_${Date.now()}.png`, folder: '/resume' });
  const url = req.body.removeBg === 'true' ? ik.url({ src: out.url, transformation: [{ raw: 'e-bgremove' }] }) : out.url;
  res.json({ url });
}));

// ---- AI (Gemini)
const model = () => new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' });
const json = (t) => JSON.parse(t.replace(/```json|```/g, '').trim());

r.post('/ai/enhance', auth, wrap(async (req, res) => {
  const { text, kind } = req.body;
  const what = kind === 'experience' ? 'job description as 2-4 concise achievement bullets starting with strong verbs (use "• ")' : 'professional summary in 2-3 sentences';
  const out = await model().generateContent(`Rewrite this resume ${what}. Keep facts, do not invent numbers. Return only the text.\n\n${text}`);
  res.json({ text: out.response.text().trim() });
}));

r.post('/ai/parse-resume', auth, upload.single('file'), wrap(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Upload a PDF resume' });
  const { text } = await pdf(req.file.buffer);
  const prompt = `Extract and polish this resume into JSON only, with this shape:
{"personal":{"name","role","email","phone","location","website"},"summary","experience":[{"company","role","period","desc"}],"education":[{"school","degree","period"}],"projects":[{"name","desc"}],"skills":["..."]}
Improve wording (strong verbs, concise bullets) without inventing facts.\n\nRESUME:\n${text.slice(0, 15000)}`;
  const data = json((await model().generateContent(prompt)).response.text());
  res.json(await Resume.create({ ...data, title: `${data.personal?.name || 'Uploaded'} (AI optimized)`, user: req.uid }));
}));

export default r;
