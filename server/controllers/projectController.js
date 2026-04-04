import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
  const projects = await Project.find({ user: req.user.id }).sort('-createdAt');
  res.json(projects);
};

export const createProject = async (req, res) => {
  const project = await Project.create({ ...req.body, user: req.user.id });
  res.status(201).json(project);
};

export const getProject = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
  if (!project) return res.status(404).json({ message: 'Not found' });
  res.json(project);
};

export const updateProject = async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  res.json(project);
};

export const deleteProject = async (req, res) => {
  await Project.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ message: 'Deleted' });
};