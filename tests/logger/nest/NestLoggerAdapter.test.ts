import { MockProxy, mock } from 'jest-mock-extended';
import { Logger, NestLoggerAdapter } from '../../../src/logger';

describe('NestLoggerAdapter Test', () => {
  let logger: MockProxy<Logger>;

  beforeEach(async () => {
    logger = mock<Logger>();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should forward log method to info', async () => {
    //Arrage
    const uut = new NestLoggerAdapter(logger);

    //Act
    uut.log('test');

    //Assert
    expect(logger.info).toBeCalledWith('test');
  });

  it('should forward debug method', async () => {
    //Arrage
    const uut = new NestLoggerAdapter(logger);

    //Act
    uut.debug('test');

    //Assert
    expect(logger.debug).toBeCalledWith('test');
  });

  it('should forward verbose method', async () => {
    //Arrage
    const uut = new NestLoggerAdapter(logger);

    //Act
    uut.verbose('test');

    //Assert
    expect(logger.verbose).toBeCalledWith('test');
  });

  it('should forward warn method', async () => {
    //Arrage
    const uut = new NestLoggerAdapter(logger);

    //Act
    uut.warn('test');

    //Assert
    expect(logger.warn).toBeCalledWith('test');
  });

  it('should forward error method', async () => {
    //Arrage
    const uut = new NestLoggerAdapter(logger);

    //Act
    uut.error('test');

    //Assert
    expect(logger.error).toBeCalledWith('test');
  });
});
