const Router = require('koa-router');
const userRouter = require('./user');
const settingsRouter = require('./settings');

const router = new Router();

// Health check
router.get('/api/health', (ctx) => {
  ctx.body = {
    code: 0,
    message: 'Server is running',
    data: { timestamp: new Date().toISOString() },
  };
});

// Register routes
router.use(userRouter.routes());
router.use(settingsRouter.routes());

module.exports = router;
