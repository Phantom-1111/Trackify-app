import TimeEntry from '../models/TimeEntry.js';
import Project from '../models/Project.js';

// Returns aggregated invoice data for a project by period type
export const getInvoiceData = async (req, res) => {
  const { projectId, periodType, period } = req.query;
  // period: "2024-04-01" for daily, "2024-W14" for weekly, "2024-04" for monthly

  const project = await Project.findOne({ _id: projectId, user: req.user.id });
  if (!project) return res.status(404).json({ message: 'Project not found' });

  let dateFilter = {};
  if (periodType === 'daily') {
    dateFilter = { date: period };
  } else if (periodType === 'monthly') {
    // period = "2024-04"
    dateFilter = { date: { $regex: `^${period}` } };
  } else if (periodType === 'weekly') {
    // For weekly, compute the 7 dates of that ISO week
    const [year, week] = period.split('-W').map(Number);
    const dates = getWeekDates(year, week);
    dateFilter = { date: { $in: dates } };
  }

  const entries = await TimeEntry.find({
    user: req.user.id,
    project: projectId,
    endTime: { $exists: true },
    ...dateFilter,
  });

  const totalSeconds = entries.reduce((s, e) => s + e.duration, 0);
  const totalHours = totalSeconds / 3600;
  const totalAmount = totalHours * project.hourlyRate;

  res.json({
    project,
    entries,
    totalHours: +totalHours.toFixed(2),
    totalAmount: +totalAmount.toFixed(2),
    period,
    periodType,
  });
};

function getWeekDates(year, week) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const monday = new Date(simple);
  if (dow <= 4) monday.setDate(simple.getDate() - simple.getDay() + 1);
  else monday.setDate(simple.getDate() + 8 - simple.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}