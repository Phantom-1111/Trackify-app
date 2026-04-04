import TimeEntry from '../models/TimeEntry.js';

export const getEntries = async (req, res) => {
  const filter = { user: req.user.id };
  if (req.query.project) filter.project = req.query.project;
  if (req.query.date) filter.date = req.query.date;
  const entries = await TimeEntry.find(filter).sort('-startTime');
  res.json(entries);
};

export const startTimer = async (req, res) => {
  const { projectId, description } = req.body;
  const now = new Date();
  const entry = await TimeEntry.create({
    user: req.user.id,
    project: projectId,
    description,
    startTime: now,
    date: now.toISOString().split('T')[0],
  });
  res.status(201).json(entry);
};

export const stopTimer = async (req, res) => {
  const entry = await TimeEntry.findOne({ _id: req.params.id, user: req.user.id });
  if (!entry) return res.status(404).json({ message: 'Not found' });
  const endTime = new Date();
  entry.endTime = endTime;
  entry.duration = Math.round((endTime - entry.startTime) / 1000);
  await entry.save();
  res.json(entry);
};

export const deleteEntry = async (req, res) => {
  await TimeEntry.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ message: 'Deleted' });
};