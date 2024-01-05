const mongoose = require("mongoose");
const validator = require("validator");

const TaskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      // required: true,
      trim: true,
    },
    color: {
      type: String,
      // required: true,
      // trim: true,
    },
    // reminder: {
    //   type: String,
    //   // required: true,
    //   // trim: true,
    // },
    dueDate: {
      type: Date,
      default: null, // Sets the default value to the current date
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
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Tasks = mongoose.model("Tasks", TaskSchema);

module.exports = Tasks;
