import mongoose from 'mongoose'

const heroSchema = new mongoose.Schema({
  name:       { type: String, default: 'Prateek Yadav' },
  roles:      { type: [String], default: ['Full Stack Developer', 'React Developer', 'MERN Stack Dev', 'Problem Solver'] },
  tagline:    { type: String, default: '' },
  photo:      { type: String, default: '' },
  resumeUrl:  { type: String, default: '' },
  github:     { type: String, default: '' },
  linkedin:   { type: String, default: '' },
  instagram:  { type: String, default: '' },
  stats:      { type: [{ value: String, label: String }], default: [] },
}, { timestamps: true })

export default mongoose.model('Hero', heroSchema)
