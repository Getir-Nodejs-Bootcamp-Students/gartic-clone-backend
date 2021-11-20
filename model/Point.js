const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const PointSchema = new mongoose.Schema(
  {
    point: {
      type: Number,
      userId: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Point", PointSchema);
