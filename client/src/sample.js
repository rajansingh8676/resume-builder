export const blank = {
  title: 'Untitled resume', template: 'modern', accent: '#00a651', isPublic: false, photo: '',
  personal: { name: '', role: '', email: '', phone: '', location: '', website: '' },
  summary: '', experience: [{ company: '', role: '', period: '', desc: '' }],
  education: [{ school: '', degree: '', period: '' }], projects: [], skills: [],
};
export const sample = {
  ...blank, accent: '#00a651',
  personal: { name: 'Avery Johnson', role: 'Full-stack Developer', email: 'avery@mail.com', phone: '+91 98765 43210', location: 'Delhi, India', website: 'averyjohnson.dev' },
  summary: 'Developer with 4 years of experience shipping React and Node.js products used by thousands of people.',
  experience: [
    { company: 'Northwind', role: 'Software Engineer', period: '2022 – Now', desc: '• Built a hiring dashboard in React\n• Cut API response time by moving reports to background jobs' },
    { company: 'Bright Labs', role: 'Junior Developer', period: '2020 – 2022', desc: '• Shipped 30+ features across web and mobile' },
  ],
  education: [{ school: 'Delhi University', degree: 'B.Sc. Computer Science', period: '2016 – 2019' }],
  projects: [{ name: 'Resume Builder', desc: 'MERN app with AI resume optimization.' }],
  skills: ['React', 'Node.js', 'MongoDB', 'Tailwind', 'TypeScript'],
};
