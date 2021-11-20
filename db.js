const mongoose = require("mongoose");

const { dbUri } = require("./config/index");

exports.connectDB = async () => {
  await mongoose
    .connect(dbUri)
    .then(() => {
      console.log("Mongodb Connection");
    })
    .catch((err) => {
      console.log(err);
    });
};
