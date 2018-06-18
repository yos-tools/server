import { YosServer } from './';

// Set development environment if environment not set already
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Process unhandled rejection
// See https://nodejs.org/api/process.html#process_event_unhandledrejection
process.on('unhandledRejection', (reason, promise) => {

  // Advice
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);

  // Error handling
  if (reason instanceof Error) {
    throw reason;
  }
});

// Start yos-server
(async function() {
  await YosServer.start();

  // Further processing
  // const yosServer = await YosServer.start();
  // ...
})();


