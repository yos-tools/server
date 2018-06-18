module.exports = {
  apps : [{
    autorestart: false,
    env: {
      'NODE_ENV': 'development',
    },
    env_production : {
      'NODE_ENV': 'production'
    },
    name: 'yos-server',
    script: 'src/start.ts',
    watch: 'src',
  }]
};
