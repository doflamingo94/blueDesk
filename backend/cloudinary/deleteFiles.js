require('dotenv').config();
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CNAME,
    api_key: process.env.C_API_KEY,
    api_secret: process.env.C_API_SECRET
  })

const deleteFiles = {
    deleteFile: (req, res) => {
          const { publicId } = req.body;
          cloudinary.uploader
              .destroy(publicId)
              .then(result => res.json({ info: result }))
    },
    test: (req, res) => {
        console.log('test')
    }
};

module.exports = deleteFiles;