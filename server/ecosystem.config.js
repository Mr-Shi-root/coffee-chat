module.exports = {
  apps: [
    {
      name: 'coffee-chat-server',
      script: 'src/app.js',
      cwd: '/www/wwwroot/coffee-chat/server',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
