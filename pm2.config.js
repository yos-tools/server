module.exports = {
  apps : [{
    env: {
      'NODE_ENV': 'development',
    },
    env_production : {
      'NODE_ENV': 'production'
    },
    ignore_watch: ['dist/**/*.!(js)'],
    name: 'yos-server',
    script: 'dist/index.js',
    watch: ['dist']
  }]
};
