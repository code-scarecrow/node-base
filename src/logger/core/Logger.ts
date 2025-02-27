import { IWritter } from './IWritter';
import { logLevelNames, LogLevels } from './LogLevels';
import { LogMessage } from './LogMessage';

export class Logger {
  writter: IWritter;
  minimumLogLevel: LogLevels;
  appName: string;
  getTraceId: (() => (string | undefined)) | undefined;

  constructor(minimumLogLevel: LogLevels, appName: string, writter: IWritter, getTraceId?: () => (string | undefined)) {
    this.minimumLogLevel = minimumLogLevel;
    this.writter = writter;
    this.appName = appName;
    this.getTraceId = getTraceId;
  }

  private getLogMessage(message: string, level: LogLevels, metadata?: unknown, traceId?: string): LogMessage {
    return {
      timeStamp: new Date(),
      appName: this.appName,
      traceId: traceId ? traceId : this.getTraceId ? this.getTraceId() : undefined,
      level: level,
      levelName: logLevelNames.get(level),
      message: message,
      metadata: metadata,
    };
  }

  private log(message: string, level: LogLevels, metadata?: unknown, traceId?: string) {
    if (level < this.minimumLogLevel) return;
    this.writter.writeMessage(this.getLogMessage(message, level, metadata, traceId));
  }

  verbose(message: string, metadata?: unknown, traceId?: string): void {
    this.log(message, LogLevels.VERBOSE, metadata, traceId);
  }

  debug(message: string, metadata?: unknown, traceId?: string): void {
    this.log(message, LogLevels.DEBUG, metadata, traceId);
  }

  info(message: string, metadata?: unknown, traceId?: string): void {
    this.log(message, LogLevels.INFO, metadata, traceId);
  }

  warn(message: string, metadata?: unknown, traceId?: string): void {
    this.log(message, LogLevels.WARN, metadata, traceId);
  }

  error(message: string, metadata?: unknown, traceId?: string): void {
    this.log(message, LogLevels.ERROR, metadata, traceId);
  }
}
