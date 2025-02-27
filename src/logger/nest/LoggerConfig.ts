import { LogLevels } from '../core/LogLevels';

export class LoggerConfig {
  appName: string;
  minimumLogLevel: number;

  constructor(appName: string, minimumLogLevel: number = LogLevels.INFO) {
    this.appName = appName;
    this.minimumLogLevel = minimumLogLevel;
  }
}
