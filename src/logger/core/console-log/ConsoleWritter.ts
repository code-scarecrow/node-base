import { ConsoleWritterLogMessage } from './ConsoleWritterLogMessage';
import { IWritter } from '../IWritter';
import { LogLevels } from '../LogLevels';
import { LogMessage } from '../LogMessage';
import { SafeMap } from '../utils/SafeMap';

const stdout = (message: string) => console.log(message);
const stderr = (message: string) => console.error(message);

interface LogLevel {
  output: (message: string) => void;
}

export class ConsoleWritter implements IWritter {
  logMethodMapper: SafeMap<LogLevels, LogLevel>;

  constructor() {
    this.logMethodMapper = new SafeMap<LogLevels, LogLevel>();
    this.logMethodMapper.set(LogLevels.VERBOSE, { output: stdout });
    this.logMethodMapper.set(LogLevels.DEBUG, { output: stdout });
    this.logMethodMapper.set(LogLevels.INFO, { output: stdout });
    this.logMethodMapper.set(LogLevels.WARN, { output: stderr });
    this.logMethodMapper.set(LogLevels.ERROR, { output: stderr });
  }

  writeMessage(logMessage: LogMessage) {
    this.logMethodMapper.get(logMessage.level).output(this.getLogString(logMessage));
  }

  private getLogString(logMessage: LogMessage): string {
    return JSON.stringify(new ConsoleWritterLogMessage(logMessage));
  }
}
