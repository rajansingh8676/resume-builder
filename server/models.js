import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export const User = model('User', new Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
}, { timestamps: true }));

export const Resume = model('Resume', new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  title: { type: String, default: 'Untitled resume' },
  template: { type: String, default: 'modern' },
  accent: { type: String, default: '#00a651' },
  isPublic: { type: Boolean, default: false },
  photo: String,
  personal: { name: String, role: String, email: String, phone: String, location: String, website: String },
  summary: String,
  experience: [{ company: String, role: String, period: String, desc: String }],
  education: [{ school: String, degree: String, period: String }],
  projects: [{ name: String, desc: String }],
  skills: [String],
}, { timestamps: true }));
