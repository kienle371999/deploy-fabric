const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dbConfig = require('./config/db.config')
const router = require('./routes')
const app = express()
const mongoose = require('./models')
require('dotenv').config({ path: require('find-config')('.env') })

var corsOptions = {
  origin: "*",
  exposedHeaders: "Authorization"
};

app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}))

mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Successfully connect to MongoDB')
  })
  .catch(err => {
    console.error('Connection error', err)
    process.exit()
  });

app.use('/api', router.routers)

// set port, listen for requests
const PORT = process.env.API_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})