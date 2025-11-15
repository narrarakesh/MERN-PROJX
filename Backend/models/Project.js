const mongoose  = require('mongoose');



const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, required: true},
  description: { type: String, default: ''},
  status: { type: String, enum: ['Yet to Start','In Progress','Completed'], default: 'Yet to Start'},
  priority: { type: String, enum: ['High','Medium', 'Low'], default:'Medium'},
  startDate: { type: Date},
  endDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  attachments: [{ type: String}],
  progress: {type: Number, default:0}
}, {
  timestamps: true // adds createdAt and updatedAt
})

module.exports = mongoose.model('Project', projectSchema);