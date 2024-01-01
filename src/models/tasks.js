const mongoose = require("mongoose");
const validator = require("validator");

const TaskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ef: "Categories",
    },
    reminder: {
      type: String,
      // required: true,
      // trim: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
  },
  {
    timestamps: true,
  }
);

const Tasks = mongoose.model("Tasks", TaskSchema);

module.exports = Tasks;
