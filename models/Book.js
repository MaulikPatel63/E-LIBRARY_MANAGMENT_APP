const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String, required: true },
    publicationDate: { type: Date, required: true },
    availability: { type: Boolean, default: true },
    pageCount: { type: Number, default: 0 }, // Default to 0 for page count
    image: { type: String, default: "default-image.jpg" }, // Default image path
    pdf: { type: String, default: "default-book.pdf" }, // Default pdf path
    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const User = mongoose.model("Book", bookSchema);

module.exports = User;
