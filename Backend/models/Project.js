const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    status: {
      type: String,
      enum: ["Yet to Start", "In Progress", "Completed"],
      default: "Yet to Start",
      index: true,
    },

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
      index: true,
    },

    startDate: { type: Date, index: true },
    endDate: { type: Date },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],

    attachments: [{ type: String }],
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);


// Most common: show projects created by user, newest first
projectSchema.index({ createdBy: 1, createdAt: -1 });

// Used in dashboards: count by status per user
projectSchema.index({ createdBy: 1, status: 1 });


projectSchema.index({ members: 1, status: 1 });



module.exports = mongoose.model("Project", projectSchema);
