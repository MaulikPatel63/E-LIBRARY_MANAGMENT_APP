const Book = require("../models/Book.js");
const User = require("../models/User.js");

const bookAdd = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ message: "User Does not exists" });
    }

    const newBook = new Book({
      ...req.body,
      publicationDate: new Date("1925-04-10"),
    });
    await newBook.save();

    return res
      .status(200)
      .json({ message: "Book Created Successfully!", data: newBook });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Book controller error", err: error.message });
  }
};

const bookGet = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const { genre, author, publicationDate } = req.query;
    const query = {};
    if (genre) query.genre = { $regex: new RegExp(genre, "i") };
    if (author) query.author = { $regex: new RegExp(author, "i") };
    if (publicationDate)
      query.publicationDate = { $gte: new Date(publicationDate) };

    const books = await Book.find(query)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const totalBooks = await books.length;

    return res.status(200).json({
      message: "The books were retrieved successfully!",
      pagination: {
        total: totalBooks,
        currentPage: pageNum,
        totalPages: Math.ceil(totalBooks / limitNum),
      },
      data: books,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", err: error.message });
  }
};

const bookGetById = async (req, res) => {
  try {
    const { id } = req.params;

    const books = await Book.find({ _id: id });
    if (!books) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json({
      message: "The books was retrieved successfully!",
      data: books,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", err: error.message });
  }
};

const bookUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { ...req.body },
      {
        new: true,
      }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res
      .status(200)
      .json({ message: "Book Created Successfully!", data: updatedBook });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", err: error.message });
  }
};

const bookDelete = async (req, res) => {
  try {
    const { id } = req.params;

    await Book.findByIdAndDelete(id);
    return res.status(200).json({ message: "Book Deleted Successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", err: error.message });
  }
};

const bookImgUpload = async (req, res) => {
  try {
    const fullUrl =
      req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;

    res.status(200).json({
      message: "Image uploaded successfully!",
      imageUrl: fullUrl,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error uploading image", error: error.message });
  }
};

const bookBorrowAdd = async (req, res) => {
  try {
    const { id } = req.params;

    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ message: "User Does not exists" });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.availability) {
      return res.status(400).json({ message: "Book is already borrowed" });
    }
    book.availability = false;
    book.borrowedBy = req.user._id;
    await book.save();

    return res
      .status(200)
      .json({ message: "Book borrowed Created Successfully!", data: book });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Book controller error", err: error.message });
  }
};

const bookBorrowReturn = async (req, res) => {
  try {
    const { id } = req.params;

    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ message: "User Does not exists" });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.availability && book.borrowedBy.toString() === req.user._id.toString()) {
      book.availability = true;
      book.borrowedBy = null;
      await book.save();
      res
        .status(200)
        .json({ message: "Book Returned Successfully!", data: book });
    } else {
      res.status(400).json({ message: "You cannot return this book" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Book controller error", err: error.message });
  }
};

module.exports = {
  bookAdd,
  bookGetById,
  bookGet,
  bookUpdate,
  bookDelete,
  bookImgUpload,
  bookBorrowAdd,
  bookBorrowReturn,
};
