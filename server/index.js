require('dotenv').config()
const express = require('express')
const multer = require('multer')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

// This will allow your mobile app to make requests to this server
app.use(cors())

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*') // Adjust this based on your requirements
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

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

app.post('/', upload.single('image'), (req, res) => {
  res.send('Data received!')
})

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
  })

const PORT = 7777
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
