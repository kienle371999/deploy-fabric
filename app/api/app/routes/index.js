const express = require('express')
const authJwt = require('../middlewares/authJwt')
const router = express.Router()

const networkController = require('../server-process/network/network.controller')
const authController = require('../server-process/auth/auth.controller')

// General-User router
// router.route('/signIn').post(controllers.auth.signin)
// router.route('/signUp').post(controllers.auth.signup)
// router.use('/user', middlewares.authJwt.verifyToken)

// router.route('/user').get(controllers.auth.getUser)
// router.route('/user/refreshToken').get(controllers.auth.refreshToken)

// router.route('/networks/:networkId/start').put(controllers.network.startNetwork);
// router.route('/networks/:networkId/stop').put(controllers.network.stopNetwork);
// router.route('/networks/:networkId/logs').get(controllers.network.getLogs);
// router.route('/networks/:networkId/logs').delete(controllers.network.clearLogs);
// router.route('/networks/:networkId').get(controllers.network.getNetwork);
// router.route('/networks').get(controllers.network.getNetworks);
// router.route('/networks').post(controllers.network.addNetwork);

router.post('/network', authJwt.verifyToken, networkController.addNetwork)
router.post('/user/signIn', authController.signIn)

module.exports = {
    routers: router
}