const mongoose = require('mongoose')
const password = 'Blue452477614524.'
const url = `mongodb+srv://jiheonham61:${password}@cluster0.oz2xxus.mongodb.net/?retryWrites=true&w=majority`

const connectDB = async () => {
  try {
    await mongoose.connect(url)
    console.log('MongoDB Connected...')
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

module.exports = connectDB
