import { LogMessage } from '../LogMessage';

export class ConsoleWritterLogMessage {
  timeStamp: Date;
  traceId: string | undefined;
  appName: string;
  level: string;
  message: string;
  metadata?: unknown;

  constructor(logMessage: LogMessage) {
    this.timeStamp = logMessage.timeStamp;
    this.traceId = logMessage.traceId;
    this.appName = logMessage.appName;
    this.level = logMessage.levelName;
    this.message = logMessage.message;
    this.metadata = logMessage.metadata;
  }
}
