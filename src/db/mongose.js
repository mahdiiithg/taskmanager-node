const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);




// const TasksOfPrincess = new Tasks({
//   description: "house keeping for prncs",
//   status: 0
// })


// prcRene.save().then(res => console.log('resss', res, prcRene)).catch(error => console.log("error", prcRene,  error)) 

// TasksOfPrincess.save().then(res => console.log('resss', res)).catch(error => console.log("error", error)) 