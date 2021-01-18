const config = require('../../config/auth.config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../../models/user.model')

const _vArgs = (arg) => {
  if(typeof arg !== 'string' || arg.length === 0) return false
  return true
}

const signIn = async (args) => {
  const validateArgs = async (args) => {
    const { email, password } = args
    if(!_vArgs(email)) throw new Error('Email must be non-empty')
    if(!_vArgs(password)) throw new Error('Password must be non-empty')

    try {
      const user = await User.findOne({ email: email })
      if(!user) throw new Error('User is not found')

      const passwordIsValid = bcrypt.compareSync(password, user.password)
      if (!passwordIsValid) throw new Error('Invalid password')
      return user.toObject()
    }
    catch(error) {
      throw new Error(error.message)
    }
  }
    
  try {
    const userArgs = await validateArgs(args)
    const token = jwt.sign({ id: userArgs._id, email: userArgs.email }, config.tokenSecret, { expiresIn: 86400 })
    return { ...userArgs, token: token }
  }
  catch(error) {
    throw new Error(error.message)
  }
}

const authenticateToken = async(args) => {
  const validateArgs = async (args) => {
    const { token } = args
    if(!_vArgs(token)) throw new Error('Token must be non-empty')
    return args
  }

  try {
    const { token } = await validateArgs(args)
    const _vToken = jwt.verify(token, config.tokenSecret)
    return _vToken
  }
  catch(error) {
    throw new Error(error.message)
  }
}


module.exports = {
  signIn,
  authenticateToken
}
                      