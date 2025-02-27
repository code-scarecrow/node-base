import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { CallHandler, HttpArgumentsHost, RpcArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { MockProxy, mock } from 'jest-mock-extended';
import { Observable } from 'rxjs';
import { Logger, LogLevels } from '../../../src/logger';
import { NestLoggingInterceptor } from '../../../src/logger/nest';

describe('NestLoggingInterceptor Test', () => {
  let logger: MockProxy<Logger>;
  let logMessages: { message: string; metadata: unknown; level: LogLevels }[];

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

  it('should log full data in requests', async () => {
    //Arrage
    const req = mock<Request>();
    req.method = 'GET';
    req.headers = { host: 'test' };
    req.url = 'https://test/test';
    req.body = { test: 'test' };
    const response = mock<Response>();
    response.statusCode = HttpStatus.OK;
    const context = getContext(req, response);
    const uut = new NestLoggingInterceptor(logger);
    const body = { test: 'test' };

    //Act
    const res = uut.intercept(context, getCallHandle(body));

    //Assert
    res
      .subscribe(() => {
        expect(logMessages.length).toBe(2);
        expect(logMessages[0]?.level).toBe(LogLevels.INFO);
        expect(logMessages[1]?.level).toBe(LogLevels.INFO);
      })
      .unsubscribe();
  });

  it('should not log any data in health-check requests', async () => {
    //Arrage
    const req = mock<Request>();
    req.method = 'GET';
    req.url = 'https://test/health-check';
    const response = mock<Response>();
    response.statusCode = HttpStatus.OK;
    const context = getContext(req, response);
    const uut = new NestLoggingInterceptor(logger);
    const body = { test: 'test' };

    //Act
    const res = uut.intercept(context, getCallHandle(body));

    //Assert
    res
      .subscribe(() => {
        expect(logMessages.length).toBe(0);
      })
      .unsubscribe();
  });

  it('should log full message data.', async () => {
    const message = {
      retry: null,
      app: 'app-example',
      traceId: '234wdfsf2',
      data: {
        code: '4E94M72D',
      },
      timestamp: '12-12-12 00:00:00',
    };
    const context = getRmqContext(message);
    const uut = new NestLoggingInterceptor(logger);

    const res = uut.intercept(context, getCallHandle({}));

    res
      .subscribe(() => {
        expect(logMessages.length).toBe(1);
        expect(logMessages[0]?.level).toBe(LogLevels.INFO);
      })
      .unsubscribe();
  });
});

function getContext(req: Request, res: Response) {
  const context = mock<ExecutionContext>();
  const httpArgumentsHost = mock<HttpArgumentsHost>();
  context.switchToHttp.mockReturnValue(httpArgumentsHost);
  httpArgumentsHost.getRequest.mockReturnValue(req);
  httpArgumentsHost.getResponse.mockReturnValue(res);
  return context;
}

function getRmqContext(message: any) {
  const context = mock<ExecutionContext>();
  const rpcArgumentsHost = mock<RpcArgumentsHost>();

  context.switchToRpc.mockReturnValue(rpcArgumentsHost);
  context.getType.mockReturnValue('rmq');
  rpcArgumentsHost.getData.mockReturnValue(message);

  return context;
}

function getCallHandle(resBody: unknown) {
  const callHandler = mock<CallHandler>();
  const observable = new Observable((s) => {
    s.next(resBody);
    s.complete();
  });
  callHandler.handle.mockReturnValue(observable);
  return callHandler;
}
