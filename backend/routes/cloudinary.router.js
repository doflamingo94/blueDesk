const express = require('express');
const router = express.Router();

const cloudinaryApi = require("../cloudinary/deleteFiles");

router.post("/deleteFile", cloudinaryApi.deleteFile);
module.exports = router;