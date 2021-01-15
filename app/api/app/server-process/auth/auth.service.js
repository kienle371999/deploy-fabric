const { badRequest, serverError, success } = require('../../utils/messageHandle')
const config = require('../../config/auth.config')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require('../../models/user.model')

const _validArgs = (arg) => {
  if(typeof arg !== 'string' || arg.length === 0) return false
  return true
}

const signInService = async (args) => {
  const validateArgs = async (args) => {
    const { email, password } = args
    if(!_validArgs(email)) return badRequest('Email must be non-empty')
    if(!_validArgs(password)) return badRequest('Password must be non-empty')

    try {
      const user = await User.findOne({ email: email })
      if(!user) return badRequest('User is not found')

      const passwordIsValid = bcrypt.compareSync(password, user.password)
      if (!passwordIsValid) return badRequest('Invalid password')
      return user
    }
    catch(error) {
      return serverError(error.message)
    }
  }
    
  const userArgs = await validateArgs(args)
  const token = jwt.sign({ id: userArgs._id, email: userArgs.email }, config.tokenSecret, { expiresIn: 86400 })

  return success({ 
    id: userArgs._id,
    email: userArgs.email,
    password: userArgs.password,
    token: token
  })
}

module.exports = {
  signInService
}
