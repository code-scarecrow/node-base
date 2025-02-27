import { FactoryProvider } from '@nestjs/common';
import { Logger } from '../core/Logger';
import { ConsoleWritter } from '../core/console-log/ConsoleWritter';
import { LoggerConfig } from './LoggerConfig';
import { storage } from './Storage';

export const LogProvider: FactoryProvider<Logger> = {
  provide: Logger,
  useFactory: (LoggerConfig: LoggerConfig) => {
    return new Logger(LoggerConfig.minimumLogLevel, LoggerConfig.appName, new ConsoleWritter(), () => storage.getStore());
  },
  inject: [{ token: LoggerConfig, optional: false }],
};
