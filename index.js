const express = require('express')
const app = express()
const cors = require('cors')
const addUser = require('./database/User/user.js')
const connectDB = require('./database/database')


//middleware
app.use(express.json())
app.use(cors())

//Connect to MongoDB
connectDB()

//Routes
const userRouter = require('./routes/users')
app.use('/users', userRouter)



app.get('/', (request, response) => {
  addUser()
  response.send('<h1>Hello World!</h1>')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})