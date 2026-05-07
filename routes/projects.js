const router = require('express').Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// GET all projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = req.user.role === 'admin'
      ? await Project.find().populate('createdBy', 'name email').populate('members', 'name email')
      : await Project.find({ members: req.user.id }).populate('createdBy', 'name email').populate('members', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE project (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
    const { name, description, members } = req.body;
    const project = await Project.create({ name, description, members, createdBy: req.user.id });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE project (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE project (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;