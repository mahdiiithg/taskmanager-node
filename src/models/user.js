const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const Tasks = require("./tasks");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowerCase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is Invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    lowerCase: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("password can not contain password");
      }
    },
  },
  age: {
    type: String,
    validate(value) {
      if (value < 0) {
        throw new Error("Age is Not positive");
      }
    },
  },
  language: {
    type: String,
    trim: true,
    default: 'en',
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  avatar: {
    type: Buffer
  }
},
{
  timestamps: true,
});

UserSchema.virtual("tasks", {
  ref: "Tasks",
  localField: "_id",
  foreignField: "owner",
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY);

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.methods.getPublicProfile = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  // ! check user
  if (!user) {
    throw new Error("Unable to find user");
  }

  // ! check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("crendetials are not correct");
  }
  return user;
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// ! DELET ALL TASKS WHICH ITS USER HAS DELETED ITSELF
UserSchema.pre("remove", async function (next) {
  const user = this;
  await Tasks.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

// ? DB COMMAND RUN
// /Users/mahdithg/Desktop/projects/learnings/mongoDb/mongodb/bin/mongod --dbpath=/Users/mahdithg/Desktop/projects/learnings/mongoDb/mongodb-data
