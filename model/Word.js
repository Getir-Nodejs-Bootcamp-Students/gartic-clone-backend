const mongoose = require("mongoose");

const WordSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      trim: true,
      maxlength: 7,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Word", WordSchema);
