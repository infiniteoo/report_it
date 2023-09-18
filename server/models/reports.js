const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
  barcodeData: String,
  description: String,
  image: String,
  status: String,
  date: Date,
})

module.exports = mongoose.model('Reports', reportSchema)
