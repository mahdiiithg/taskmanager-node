const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/task-manager-api");




// const TasksOfPrincess = new Tasks({
//   description: "house keeping for prncs",
//   status: 0
// })


// prcRene.save().then(res => console.log('resss', res, prcRene)).catch(error => console.log("error", prcRene,  error)) 

// TasksOfPrincess.save().then(res => console.log('resss', res)).catch(error => console.log("error", error)) 