module.exports = {
  apps : [{
    env: {
      'NODE_ENV': 'development',
    },
    env_production : {
      'NODE_ENV': 'production'
    },
    name: 'yos-server',
    script: 'dist/start.js'
  }]
};
