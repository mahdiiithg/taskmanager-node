// // middleware.js

// const Notification = require("../models/notification");

// // In your middleware.js file
// const createNotification = async (io, userId, message) => {
//   try {
//     await Notification.create({ userId, message });
//     io.to(userId).emit('notification', message); // Use the io object passed as a parameter
//   } catch (error) {
//     console.error('Error creating notification:', error);
//   }
// };

// const notifyUser = (io,userId,message) => {
//   return async (req, res, next) => {
//     try {
//       // Extract user ID from your authentication mechanism
//       // const userId = req.user.id; // Modify this to fit your authentication setup
//       await createNotification(io, userId, message);
//       next();
//     } catch (error) {
//       console.error('Error notifying user:', error);
//       next(error);
//     }
//   };
// };

// module.exports = {
//   notifyUser,
// };

const Notification = require("../models/notification");

const createNotification = async (userId, message) => {
  try {
    await Notification.create({ userId, message });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

const notifyUser = (message) => {
  return async (req, res, next) => {
    try {
      // Extract user ID from your authentication mechanism
      const userId = req.user.id; // Modify this to fit your authentication setup
      await createNotification(userId, message);
      next();
    } catch (error) {
      console.error('Error notifying user:', error);
      next(error);
    }
  };
};

module.exports = {
  notifyUser,
};
