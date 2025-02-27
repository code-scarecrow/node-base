import { LoggerService } from '@nestjs/common';
import { Logger } from '../core/Logger';

export class NestLoggerAdapter implements LoggerService {
  constructor(private logger: Logger) {}

  log(message: any) {
    this.logger.info(message);
  }
  error(message: any) {
    this.logger.error(message);
  }
  warn(message: any) {
    this.logger.warn(message);
  }
  debug(message: any) {
    this.logger.debug(message);
  }
  verbose(message: any) {
    this.logger.verbose(message);
  }
}
