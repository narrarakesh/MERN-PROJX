const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true, // used for "My Tasks"
      },
    ],

    status: {
      type: String,
      enum: ["Todo", "In Progress", "Completed"],
      default: "Todo",
      index: true, //  dashboard + filters
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
      index: true,
    },

    startDate: { type: Date, required: true, index: true },
    dueDate: { type: Date, index: true },

    estimatedHours: { type: Number, required: true, min: 0 },

    attachments: [{ type: String }],
  },
  { timestamps: true }
);


// Recent tasks inside a project
taskSchema.index({ projectId: 1, createdAt: -1 });

// Dashboard counts: tasks by status in a project
taskSchema.index({ projectId: 1, status: 1 });

// My tasks: assignedTo + status + createdAt sorting
taskSchema.index({ assignedTo: 1, status: 1, createdAt: -1 });




module.exports = mongoose.model("Task", taskSchema);
