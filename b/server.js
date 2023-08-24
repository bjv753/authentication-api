const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const mongoose = require('mongoose')
const { expressjwt } = require('express-jwt')

// Middleware for each request
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Connect to database
mongoose.connect(
  // 'mongodb://localhost:27017/user-authentication',
  process.env.MONGO_DB_URI,
  () => console.log('Connected to the DB')
)

// Routes
app.use('/auth', require('./routes/authRouter.js'))
app.use('/api', expressjwt({ secret: process.env.SECRET, algorithms: ['HS256']})) // req.user
app.use('/api/todo', require('./routes/todoRouter.js'))

app.use((err, req, res, next) => {
  console.log(err)
  if(err.name === "UnauthorizedError"){
    res.status(err.status)
  }
  return res.send({errMsg: err.message})
})

// PORT
app.listen(process.env.PORT, () => {
  console.log('running on port ' + process.env.PORT )
})