import { SafeMap } from '../../core/SafeMap';

export enum LogLevels {
  VERBOSE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export const logLevelNames: SafeMap<LogLevels, string> = new SafeMap([
  [LogLevels.VERBOSE, 'VERBOSE'],
  [LogLevels.DEBUG, 'DEBUG'],
  [LogLevels.INFO, 'INFO'],
  [LogLevels.WARN, 'WARNING'],
  [LogLevels.ERROR, 'ERROR'],
]);
