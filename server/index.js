const express = require('express')
const multer = require('multer')
const cors = require('cors')

const app = express()

// This will allow your mobile app to make requests to this server
app.use(cors())

// Set up storage with multer. This saves files to the local filesystem.
// You can modify this to save to other locations such as cloud storage.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './server/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
})
const upload = multer({ storage: storage })

// This route expects a POST request with a form-data body
// containing an 'image' field and a 'description' field.
app.post('/', upload.single('image'), (req, res) => {
  console.log('Description:', req.body.description)
  console.log('Image:', req.file.path)

  // Process the uploaded data as needed (e.g., save to a database)
  // Here, we're just sending a success message.
  res.send('Data received!')
})
/* app.post('/', async (req, res) => {
  console.log('hello from /')
  console.log('req.body', req.body)
 

  // Process the uploaded data as needed (e.g., save to a database)
  // Here, we're just sending a success message.
  res.send('Data received!')
}) */

const PORT = 7777
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
