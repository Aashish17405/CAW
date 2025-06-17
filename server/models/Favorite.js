const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Favorite", favoriteSchema);