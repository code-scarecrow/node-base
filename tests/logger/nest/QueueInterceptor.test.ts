import { mock, MockProxy } from 'jest-mock-extended';
import { Logger, LogLevels } from '../../../src/logger';
import { QueueInterceptor } from '../../../src/logger/nest/QueueInterceptor';
import { storage } from '../../../src/logger/nest';

describe('QueueInterceptor test.', () => {
  let logger: MockProxy<Logger>;
  let logMessages: { message: string; metadata: unknown; level: LogLevels }[];
  let message = {
    retry: null,
    app: 'app-example',
    traceId: '',
    data: {
      code: '4E94M72D',
    },
    timestamp: '12-12-12 00:00:00',
  };

  beforeEach(async () => {
    logger = mock<Logger>();
    logger.info.mockImplementation((m, md) => logMessages.push({ message: m, metadata: md, level: LogLevels.INFO }));
    logger.error.mockImplementation((m, md) => logMessages.push({ message: m, metadata: md, level: LogLevels.ERROR }));
    logMessages = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('Should get traceId.', () => {
    //Arrange
    const traceId = '52b971f9-ccef-431d-9550-0d7c2bb3e8bf';
    storage.enterWith(traceId);
    const interceptor = new QueueInterceptor(logger);

    //Act
    const result = interceptor.getTraceId();

    //Assert
    expect(result).toEqual(traceId);
  });

  it('Should throw error getting traceId.', () => {
    //Arrange
    storage.disable()
    const interceptor = new QueueInterceptor(logger);

    //Act
    const result = () => interceptor.getTraceId();

    //Assert
    expect(result).toThrowError('traceId not found');
  });

  it('Should log message.', () => {
    //Arrange
    const interceptor = new QueueInterceptor(logger);

    //Act
    interceptor.logMessage(message);

    //Assert
    expect(logMessages.length).toBe(1);
    expect(logMessages[0]?.level).toBe(LogLevels.INFO);
  });
});
