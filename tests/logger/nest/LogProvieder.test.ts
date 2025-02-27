import { LoggerConfig, LogProvider } from "../../../src/logger";

describe('LogProvieder Test', () => {
  it('should create a logger instance', async () => {
    //Arrage
    const config = new LoggerConfig('test');
  
    //Act
    const logger = await LogProvider.useFactory(config);

    //Assert
    expect(logger).toBeDefined();
    expect(logger.appName).toBe('test');
  });
});
