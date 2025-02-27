import { ValueProvider } from '@nestjs/common';
import { AxiosLoggerInterceptor, LoggerConfig, LogModule, LogProvider } from '../../../src/logger/nest';

describe('LogModule Test', () => {
  it('should log full data in requests', async () => {
    //Arrage
    const provieder: ValueProvider<LoggerConfig> = {
      provide: LoggerConfig,
      useValue: new LoggerConfig('test'),
    };

    //Act
    const uut = LogModule.register(provieder);

    //Assert
    expect(uut.module).toBe(LogModule);
    expect(uut.exports).toContain(LogProvider);
    expect(uut.exports).toContain(AxiosLoggerInterceptor);
  });
});
