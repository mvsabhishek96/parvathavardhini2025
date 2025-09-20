const functions = require("firebase-functions");

// Just a test function
exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello from Firebase Functions!");
});
