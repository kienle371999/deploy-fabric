const Router = require('express').Router;
const controllers = require('../controllers');
const middlewares = require('../middlewares');
const router = new Router();

// General-User router
router.route('/signIn').post(controllers.auth.signin);
router.route('/signUp').post(controllers.auth.signup);
router.use('/user', middlewares.authJwt.verifyToken);

router.route('/user').get(controllers.auth.getUser);
router.route('/user/refreshToken').get(controllers.auth.refreshToken);

router.route('/networks/:networkId/start').put(controllers.network.startNetwork);
router.route('/networks/:networkId/stop').put(controllers.network.stopNetwork);
router.route('/networks/:networkId/logs').get(controllers.network.getLogs);
router.route('/networks/:networkId/logs').delete(controllers.network.clearLogs);
router.route('/networks/:networkId').get(controllers.network.getNetwork);
router.route('/networks').get(controllers.network.getNetworks);
router.route('/networks').post(controllers.network.addNetwork);
module.exports = {
    routers: router
}