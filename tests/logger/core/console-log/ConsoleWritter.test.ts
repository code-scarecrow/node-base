import { LogLevels, LogMessage } from "../../../../src/logger";
import { ConsoleWritter } from "../../../../src/logger/core/console-log/ConsoleWritter";

describe('ConsoleWritter Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should write correct message', async () => {
    //Arrage
    const uut = new ConsoleWritter();
    const logMessage: LogMessage = {
      timeStamp: new Date(Date.UTC(2022,8,30,18,16,16,34)),
      appName: 'test',
      traceId: 'test',
      level: LogLevels.INFO,
      levelName: 'Info',
      message: 'test - message',
    };
    const expectedRes =
      '{"timeStamp":"2022-09-30T18:16:16.034Z","traceId":"test","appName":"test","level":"Info","message":"test - message"}';
    let res: string = '';
    console.log = (a: string) => (res = a);

    //Act
    uut.writeMessage(logMessage);

    //Assert
    expect(res).toBe(expectedRes);
  });

  it('should write correct message', async () => {
    //Arrage
    const uut = new ConsoleWritter();
    const logMessage: LogMessage = {
      timeStamp: new Date(Date.UTC(2022,8,30,18,16,16,34)),
      appName: 'test',
      traceId: 'test',
      level: LogLevels.ERROR,
      levelName: 'Error',
      message: 'test - message',
    };
    const expectedRes = '{"timeStamp":"2022-09-30T18:16:16.034Z","traceId":"test","appName":"test","level":"Error","message":"test - message"}';
    let res: string = '';
    console.error = (a: string) => (res = a);

    //Act
    uut.writeMessage(logMessage);

    //Assert
    expect(res).toBe(expectedRes);
  });

  it('should write correct message', async () => {
    //Arrage
    const uut = new ConsoleWritter();
    const logMessage: LogMessage = {
      timeStamp: new Date(Date.UTC(2022,8,30,18,16,16,34)),
      appName: 'test',
      traceId: 'test',
      level: LogLevels.WARN,
      levelName: 'Warning',
      message: 'test - message',
    };
    const expectedRes = '{"timeStamp":"2022-09-30T18:16:16.034Z","traceId":"test","appName":"test","level":"Warning","message":"test - message"}';
    let res: string = '';
    console.error = (a: string) => (res = a);

    //Act
    uut.writeMessage(logMessage);

    //Assert
    expect(res).toBe(expectedRes);
  });
});
