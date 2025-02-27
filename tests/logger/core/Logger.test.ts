import { MockProxy, mock } from 'jest-mock-extended';
import { Logger, LogMessage, LogLevels, IWritter } from '../../../src/logger/core';

describe('Logger Test', () => {
  let writter: MockProxy<IWritter>;
  let logMessages: LogMessage[];

  beforeEach(async () => {
    writter = mock<IWritter>();
    writter.writeMessage.mockImplementation((m) => logMessages.push(m));
    logMessages = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should write correct message', async () => {
    //Arrage
    const uut = new Logger(LogLevels.DEBUG, 'testAppName', writter);

    //Act
    uut.info('test');

    //Assert
    expect(logMessages[0]?.appName).toBe('testAppName');
  });

  it('should not write if level is under log level', async () => {
    //Arrage
    const uut = new Logger(LogLevels.WARN, 'testAppName', writter);

    //Act
    uut.info('test');

    //Assert
    expect(logMessages[0]).toBeUndefined();
  });

  it('should write correct log level', async () => {
    //Arrage
    const uut = new Logger(LogLevels.VERBOSE, 'testAppName', writter);

    //Act
    uut.verbose('test');
    uut.debug('test');
    uut.info('test');
    uut.warn('test');
    uut.error('test');

    //Assert
    expect(logMessages[0]?.level).toBe(LogLevels.VERBOSE);
    expect(logMessages[1]?.level).toBe(LogLevels.DEBUG);
    expect(logMessages[2]?.level).toBe(LogLevels.INFO);
    expect(logMessages[3]?.level).toBe(LogLevels.WARN);
    expect(logMessages[4]?.level).toBe(LogLevels.ERROR);
  });

  it('should get traceId', async () => {
    //Arrage
    const uut = new Logger(LogLevels.DEBUG, 'testAppName', writter, () => 'test');

    //Act
    uut.info('test');

    //Assert
    expect(logMessages[0]?.traceId).toBe('test');
  });

  it('should force traceId', async () => {
    //Arrage
    const uut = new Logger(LogLevels.VERBOSE, 'testAppName', writter);

    //Act
    uut.verbose('test', undefined, 'test');
    uut.debug('test', undefined, 'test');
    uut.info('test', undefined, 'test');
    uut.warn('test', undefined, 'test');
    uut.error('test', undefined, 'test');

    //Assert
    expect(logMessages[0]?.traceId).toBe('test');
    expect(logMessages[1]?.traceId).toBe('test');
    expect(logMessages[2]?.traceId).toBe('test');
    expect(logMessages[3]?.traceId).toBe('test');
    expect(logMessages[4]?.traceId).toBe('test');
  });
});
