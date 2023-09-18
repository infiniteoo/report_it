require('dotenv').config()
const mongoose = require('mongoose')
const { faker } = require('@faker-js/faker')
const moment = require('moment')

console.log(process.env.MONGODB_URI)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const reportSchema = new mongoose.Schema({
  date: Date,
  submittedBy: String,
  description: String,
  barcodeData: String,
  resolved: String,
  location: String,
  image: String,
})

const Report = mongoose.model('Report', reportSchema)

async function seedDatabase() {
  const names = []

  // Generating 20 unique random names
  for (let i = 0; i < 20; i++) {
    names.push(faker.person.firstName())
  }

  // pick a random element from the names array
  const randomName = () => {
    return names[Math.floor(Math.random() * names.length)]
  }

  const resolvedRandomChoice = () => {
    return ['Y', 'N'][Math.floor(Math.random() * 2)]
  }

  const randomLetter = () => {
    return ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]
  }

  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
  }

  const reports = []

  for (let i = 0; i < 200; i++) {
    let randomLocation = `${randomNumber(2, 8)}${randomLetter()}${randomNumber(
      1,
      24,
    )}A`

    const report = new Report({
      date: faker.date.anytime(moment('2023-07-18').toDate(), new Date()),
      submittedBy: randomName(),
      description: faker.lorem.paragraph(),
      barcodeData: randomNumber(100000, 999999).toString(),
      resolved: resolvedRandomChoice(),
      location: randomLocation,
      image: faker.image.urlLoremFlickr(), // This provides a URL of a random image, not the actual image
    })

    reports.push(report)
  }

  try {
    await Report.insertMany(reports)
    console.log('Data seeded successfully!')
  } catch (err) {
    console.error('Error seeding data:', err)
  }

  mongoose.connection.close()
}

seedDatabase()
