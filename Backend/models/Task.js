const mongoose = require('mongoose');

// const todoSchema = new mongoose.Schema({
//     text: { type: String, required: true},
//     completed : { type: Boolean, default: false }
// });

const taskSchema = new mongoose.Schema({
  title: {type: String, required: true, trim: true},
  description: { type: String, default: ''},
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
  status: { type: String, enum: ['Todo', 'In Progress', 'Completed'], default: 'Todo'},
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'medium'},
  startDate: { type: Date, required: true},
  dueDate: { type: Date },
  estimatedHours: { type: Number, required: true, min: 0},
  attachments: [{ type: String}]
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema );