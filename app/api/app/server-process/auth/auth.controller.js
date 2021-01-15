const { signInService } = require('./auth.service')

const signIn = async(req, res) => {
    const user = await signInService(req.body)
    console.log('iiii', user.data)
    return res.status(user.code).json(user.data)
}

module.exports = {
    signIn
}