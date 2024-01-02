const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    langugae: {
      type: Boolean,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", SettingsSchema);

module.exports = Settings;
