const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
  langugae: {
    type: Boolean,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

SettingSchema.virtual("settings", {
  ref: "Settings",
  localField: "_id",
  foreignField: "settings"
})

const Settings = mongoose.model("Settings", SettingSchema)

module.exports = Settings