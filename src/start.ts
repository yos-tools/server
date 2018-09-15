import { YosServer } from '.';

YosServer.start({
  core: {
    authorization: {
      adminEmail: 'admin@yos.tools',
      adminPassword: '********',
      jwt: {
        secretOrPrivateKey: 'SECRET_OR_PRIVATE_KEY'
      }
    }
  }
});

/*
// Further processing
(async function () {
  const yosServer = await YosServer.start();
  // ...
})();
*/
