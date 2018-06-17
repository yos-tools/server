module.exports = {
  apps : [{
    env: {
      'NODE_ENV': 'development',
    },
    env_production : {
      'NODE_ENV': 'production'
    },
    ignore_watch: ['src/**/*.!(ts)'],
    name: 'yos-server',
    script: 'src/start.ts',
    watch: ['src'],
  }]
};
