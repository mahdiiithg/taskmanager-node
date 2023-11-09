const express = require("express");
require("./db/mongose");
const userRouter = require("./router/users");
const tasksRouter = require("./router/tasks");
// const multer = require('multer')

const app = express();
const port = process.env.PORT;

console.log("process.env.PORT",process.env.PORT);

app.use(express.json());
app.use(userRouter)
app.use(tasksRouter)


app.listen(port, () => {
  console.log("server is up on port", port);
});

// const Tasks = require('./models/tasks')
// const User = require('./models/user')

// const main = async () => {
//   const tasks = await Tasks.findById("651bfdaa1ca463a200d31f5b")
//   await tasks.populate('owner')
//   console.log("tasks", tasks.owner);

//   const user = await User.findById("651be311c588c376ee3a8883")
//   await user.populate('tasks')
//   console.log(user.tasks);
// }

// main()