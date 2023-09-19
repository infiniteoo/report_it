require('dotenv').config()
const express = require('express')
const multer = require('multer')
const cors = require('cors')
const mongoose = require('mongoose')
const Reports = require('./models/reports.js') // Import the LabRequest model

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
app.use('/uploads', express.static('./server/uploads'))

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
  const report = new Reports({
    barcodeData: req.body.barcodeData,
    description: req.body.description,
    submittedBy: req.body.submittedBy,
    location: req.body.location,
    image: req.file.filename,
    resolved: req.body.resolved || 'N',
    date: new Date(),
  })
  report.save().then((result) => {
    console.log(result)
    res.status(201).json({
      message: 'Handling POST requests to /reports',
      createdReport: report,
    })
  })
})

app.get('/', (req, res) => {
  Reports.find()
    .sort({ date: -1 }) // Sorting by date in descending order
    .then((reports) => {
      // Modify each report's image path to the public URL
      const modifiedReports = reports.map((report) => {
        let imageUrlToUse = `http://localhost:${PORT}/uploads/${report.image}`
        if (report.image.startsWith('http')) {
          imageUrlToUse = report.image
        }
        return {
          ...report._doc,
          image: imageUrlToUse,
        }
      })
      res.json(modifiedReports)
    })
    .catch((err) => {
      console.log(err)
    })
})

app.put('/resolve/:id', (req, res) => {
  const suppliedID = req.params.id
  console.log('hello from resolve/id : ', suppliedID)

  // Search database for report with suppliedID and update resolved to true
  Reports.findOneAndUpdate(
    { _id: suppliedID },
    { resolved: 'Y' }, // assuming resolved is a boolean field
    { new: true },
  )
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: 'Report not found',
        })
      }

      res.status(200).json({
        message: 'Report successfully resolved',
        updatedReport: result,
      })
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({
        message: 'Internal server error',
      })
    })
})

app.put('/assign/:id', (req, res) => {
  console.log('hello from assign:id')
  const suppliedID = req.params.id
  const assignedTo = req.body.worker

  // Search database for report with suppliedID and update assignedTo to assignedTo
  Reports.findOneAndUpdate(
    { _id: suppliedID },
    { assignedTo: assignedTo },
    { new: true },
  )
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: 'Report not found',
        })
      }

      res.status(200).json({
        message: 'Report successfully assigned',
        updatedReport: result,
      })
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({
        message: 'Internal server error',
      })
    })
})

const PORT = 7777
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
