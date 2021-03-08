// Middleware inspired by:
// https://medium.com/@joeokpus/uploading-images-to-cloudinary-using-multer-and-expressjs-f0b9a4e14c54

// Multer
const multer = require('multer');
const storage = multer.memoryStorage();
const multer_upload = multer({storage}).single("image");
const path = require("path");

// DataURI Parser
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

// Return file with a file extension from memory buffer.
const data_uri = (req) => { 
  return parser.format(path.extname(req.file.originalname).toString(), req.file.buffer);
}

module.exports = {data_uri, multer_upload}