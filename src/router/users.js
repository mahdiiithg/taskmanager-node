const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

router.post("/api/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }

  // OLD CODE
  // user
  //   .save()
  //   .then(() =>
  //     // console.log("res save user", res.send(user))
  //     res.status(201).send(user)
  //   ).catch(e => res.status(400).send(e))
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user: user.getPublicProfile(), token });
  } catch (e) {
    res.status(404).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      console.log("token", token);
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
  // User.find({}).then(users => {
  //   res.send(users)
  // }).catch(e => {
  //   res.status(500).send()
  // })
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.delete("/users/me", auth, async (req, res) => {
  console.log("req.user", req.user);
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    // Delete using deleteOne as an alternative to remove()
    await User.deleteOne({ _id: req.user._id });
    
    res.status(200).send({ message: "User deleted successfully" });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get(`/users/:id`, async (req, res) => {
  const _id = req.params.id;

  try {
    const singleUsers = await User.find({ _id });
    if (!singleUsers) return res.status(404).send();
    res.send(singleUsers);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch(`/users/me`, auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "age", "email", "password"];
  const isValidOpe = updates.every((update) => allowUpdates.includes(update));
  if (!isValidOpe) res.status(400).send({ error: "Inavlid Update" });

  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    const user = req.user;

    updates.forEach((filed) => (user[filed] = req.body[filed]));

    await user.save();

    // if (!user) return res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

const upload = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("file must be Image"));
    }

    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({width: 200, height: 200}).png().toBuffer()

    // req.user.avatar = req.file.buffer;
    req.user.avatar = buffer;

    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) throw new Error("could not find user or avatar");

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
