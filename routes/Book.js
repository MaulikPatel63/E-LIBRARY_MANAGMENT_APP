const Joi = require("joi");
const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const {
  bookAdd,
  bookGet,
  bookGetById,
  bookUpdate,
  bookDelete,
  bookImgUpload,
  bookBorrowAdd,
  bookBorrowReturn,
} = require("../controllers/BookController.js");
const { validateRequest } = require("../middleware/validate-request.js");

const { authMiddleware } = require("../middleware/authMiddleware.js");

router.use(authMiddleware);

//! https://www.pdfbooksworld.com/

//? book router
router.post("/book-add", AddValidation, bookAdd);
router.get("/book-get", bookGet);
router.get("/book-get/:id", bookGetById);
router.put("/book-update/:id", UpdateValidation, bookUpdate);
router.delete("/book-delete/:id", bookDelete);
router.post("/book-add/:id/borrow", bookBorrowAdd);
router.delete("/book-return/:id/borrow", bookBorrowReturn);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory to save uploaded images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Save with unique name
  },
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit: 5MB
  fileFilter: fileFilter,
});

// Route to upload book image
router.post("/book-upload", upload.single("image"), bookImgUpload);

function AddValidation(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    author: Joi.string().min(3).max(50).required(),
    genre: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(5).required(),
    publicationDate: Joi.date().required(),
    availability: Joi.boolean().default(true),
    pageCount: Joi.number().integer().min(1).required(),
    image: Joi.string().optional(), // Assuming the image is uploaded separately
    pdf: Joi.string().optional(), // Assuming the PDF is uploaded separately
  });
  validateRequest(req, res, next, schema);
}

function UpdateValidation(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).optional(),
    author: Joi.string().min(3).max(50).optional(),
    genre: Joi.string().min(3).max(30).optional(),
    description: Joi.string().min(5).optional(),
    publicationDate: Joi.date().optional(),
    availability: Joi.boolean().optional(),
    pageCount: Joi.number().integer().min(1).optional(),
    image: Joi.string().optional(), // Assuming the image is uploaded separately
    pdf: Joi.string().optional(), // Assuming the PDF is uploaded separately
  });
  validateRequest(req, res, next, schema);
}
module.exports = router;
