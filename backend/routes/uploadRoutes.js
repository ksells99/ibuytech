import path, { extname } from "path";
import express from "express";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
  // Upload destination - pass in request, file to upload, callback
  destination(req, file, cb) {
    // Callback - null=error, filepath
    cb(null, "uploads/");
  },
  // Upload filename
  filename(req, file, cb) {
    // Null for error, then file name + extension - eg "filename-011220.extension"
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  // Define allowed file types
  const fileTypes = /jpg|jpeg|png/;
  // Compare extension & mimetype of uploaded file vs supported types
  const checkExtName = fileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const checkMimeType = fileTypes.test(file.mimetype);

  // If both checks return true...
  if (checkExtName && checkMimeType) {
    return cb(null, true);
    // Otherwise return error
  } else {
    cb("Unsupported file type");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    // Pass into above function to check filetypes
    checkFileType(file, cb);
  },
});

// Route to upload image
router.post("/", upload.single("image"), (req, res) => {
  // Return file path of uploaded image - gets displayed in frontend
  res.send(`/${req.file.path.replace(/\\/g, "/")}`);
});

export default router;
