const Router = require('koa-router');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

const router = new Router({ prefix: '/api/user' });

// Public routes
router.post('/login', userController.wxLogin);

// Protected routes
router.get('/info', auth, userController.getUserInfo);
router.put('/info', auth, userController.updateUserInfo);

module.exports = router;
