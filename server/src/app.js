const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const config = require('./config');
const connectDB = require('./config/db');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = new Koa();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(bodyParser());
app.use(errorHandler);

// Routes
app.use(router.routes());
app.use(router.allowedMethods());

// Error logging
app.on('error', (err, ctx) => {
  console.error('Server error:', err.message);
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
