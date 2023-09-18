const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
  barcodeData: String,
  description: String,
  image: String,

  date: Date,
  location: String,
  submittedBy: String,
  resolved: String,
})

module.exports = mongoose.model('Reports', reportSchema)
