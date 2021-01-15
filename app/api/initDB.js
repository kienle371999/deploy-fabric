const bcrypt = require('bcryptjs')
const dbConfig = require('./app/config/db.config')
const mongoose = require('./app/models')
const User = require('./app/models/user.model')

mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.")
    initUser()
  })
  .catch((err) => {
    console.error("Connection error", err)
    process.exit()
  })

const initUser = () => {
  const user = new User({
      email: "test@example.com",
      password: bcrypt.hashSync("123456", 8),
    })

  user.save((err, user) => {
    if (err) {
      console.log("error to save user")
      process.exit()
    }
    console.log("added user 'test@example.com'")
    process.exit()
  })
}
