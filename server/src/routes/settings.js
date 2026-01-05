const Router = require('koa-router');
const settingsController = require('../controllers/settingsController');
const auth = require('../middlewares/auth');

const router = new Router({ prefix: '/api/settings' });

// 所有设置接口都需要认证
router.get('/', auth, settingsController.getSettings);
router.put('/', auth, settingsController.updateSettings);
router.post('/reset', auth, settingsController.resetSettings);

module.exports = router;
