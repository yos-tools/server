import { YosModule, YosServer } from '..';

/**
 * Process module to integrate process handling
 */
export class YosProcessModule extends YosModule {

  /** Initialized flag */
  public static instance: YosModule;

  /**
   * Initialization of all important operations
   */
  public static init(yosServer: YosServer): YosProcessModule {
    if (!YosProcessModule.instance) {
      YosProcessModule.processUnhandledRejection();
      YosProcessModule.instance = new YosProcessModule(yosServer);
    }
    return YosProcessModule.instance;
  }

  /**
   * Process unhandled rejection
   */
  public static processUnhandledRejection() {

    // See https://nodejs.org/api/process.html#process_event_unhandledrejection
    process.on('unhandledRejection', (reason, promise) => {

      // Advice
      console.log('Unhandled Rejection at:', promise, 'reason:', reason);

      // Error handling
      if (reason instanceof Error) {
        throw reason;
      }
    });
  }

}
