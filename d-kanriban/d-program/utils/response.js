// // utils/response.js
// const success = (message, data) => ({
//   status: "success",
//   message,
//   data,
// });

// const error = (message) => ({
//   status: "error",
//   message,
// });

// module.exports = { success, error };



const success = (message, data = null) => ({
  status: "success",
  message,
  data,
  timestamp: new Date().toISOString()
});

const error = (message) => ({
  status: "error",
  message,
  timestamp: new Date().toISOString()
});

module.exports = { success, error };