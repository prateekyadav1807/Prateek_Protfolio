import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import { getOne, updateOne, getAll, createOne, updateById, deleteById } from '../controllers/crud.js'
import Hero from '../models/Hero.js'
import About from '../models/About.js'
import Skill from '../models/Skill.js'
import Project from '../models/Project.js'
import Experience from '../models/Experience.js'
import Education from '../models/Education.js'
import Certification from '../models/Certification.js'
import Achievement from '../models/Achievement.js'
import Contact from '../models/Contact.js'

const r = Router()

// Singleton sections
r.get('/hero',    getOne(Hero))
r.put('/hero',    protect, upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), updateOne(Hero))

r.get('/about',   getOne(About))
r.put('/about',   protect, updateOne(About))

r.get('/contact', getOne(Contact))
r.put('/contact', protect, updateOne(Contact))

// Collection sections
r.get('/skills',          getAll(Skill))
r.post('/skills',         protect, createOne(Skill))
r.put('/skills/:id',      protect, updateById(Skill))
r.delete('/skills/:id',   protect, deleteById(Skill))

r.get('/projects',        getAll(Project))
r.post('/projects',       protect, upload.single('image'), createOne(Project))
r.put('/projects/:id',    protect, upload.single('image'), updateById(Project))
r.delete('/projects/:id', protect, deleteById(Project))

r.get('/experience',        getAll(Experience))
r.post('/experience',       protect, createOne(Experience))
r.put('/experience/:id',    protect, updateById(Experience))
r.delete('/experience/:id', protect, deleteById(Experience))

r.get('/education',        getAll(Education))
r.post('/education',       protect, createOne(Education))
r.put('/education/:id',    protect, updateById(Education))
r.delete('/education/:id', protect, deleteById(Education))

r.get('/certifications',        getAll(Certification))
r.post('/certifications',       protect, upload.single('image'), createOne(Certification))
r.put('/certifications/:id',    protect, upload.single('image'), updateById(Certification))
r.delete('/certifications/:id', protect, deleteById(Certification))

r.get('/achievements',        getAll(Achievement))
r.post('/achievements',       protect, createOne(Achievement))
r.put('/achievements/:id',    protect, updateById(Achievement))
r.delete('/achievements/:id', protect, deleteById(Achievement))

export default r
