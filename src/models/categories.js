const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      // required: true,
      // trim: true,
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


CategorySchema.virtual("categories", {
  ref: "Categories",
  localField: "_id",
  foreignField: "categories",
});

const Categories = mongoose.model("Categories", CategorySchema);

module.exports = Categories;
