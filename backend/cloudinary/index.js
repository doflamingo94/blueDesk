const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CNAME,
  api_key: process.env.C_API_KEY,
  api_secret: process.env.C_API_SECRET
})