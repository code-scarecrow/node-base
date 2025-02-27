import { ExecutionContext } from '@nestjs/common';
import { CallHandler, HttpArgumentsHost, RpcArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { mock } from 'jest-mock-extended';
import { Observable } from 'rxjs';
import { ContextInterceptor, storage } from '../../../src/logger/nest';

describe('ContextInterceptor Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should set existing trace Id', async () => {
    //Arrage
    const req = mock<Request>();
    req.headers = { host: 'test', 'x-pickit-trace-id': 'test' };
    const context = getContext(req, mock<Response>());
    const uut = new ContextInterceptor();

    //Act
    const res = uut.intercept(context, getCallHandle({}));

    //Assert
    res
      .subscribe(() => {
        expect(storage.getStore()).toEqual('test');
      })
      .unsubscribe();
  });
});

it('should set existing trace Id from array', async () => {
  //Arrage
  const req = mock<Request>();
  req.headers = { host: 'test', 'x-pickit-trace-id': ['test1', 'test'] };
  const context = getContext(req, mock<Response>());
  const uut = new ContextInterceptor();

  //Act
  const res = uut.intercept(context, getCallHandle({}));

  //Assert
  res
    .subscribe(() => {
      expect(storage.getStore()).toEqual('test1');
    })
    .unsubscribe();
});

it('should create new trace Id if not present in headers', async () => {
  //Arrage
  const context = getContext(mock<Request>(), mock<Response>());
  const uut = new ContextInterceptor();

  //Act
  const res = uut.intercept(context, getCallHandle({}));

  //Assert
  res
    .subscribe(() => {
      expect(storage.getStore()?.length).toEqual(36);
    })
    .unsubscribe();
});

it('should set an existing trace Id from message.', async () => {
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
  const uut = new ContextInterceptor();

  const res = uut.intercept(context, getCallHandle({}));

  res
    .subscribe(() => {
      expect(storage.getStore()).toEqual(message.traceId);
    })
    .unsubscribe();
});

it('should create new trace Id if not present in message.', async () => {
  const message = {
    retry: null,
    app: 'app-example',
    xPickitTraceId: '234wdfsf2',
    data: {
      code: '4E94M72D',
    },
    timestamp: '12-12-12 00:00:00',
  };
  const context = getRmqContext(message);
  const uut = new ContextInterceptor();

  const res = uut.intercept(context, getCallHandle({}));

  res
    .subscribe(() => {
      expect(storage.getStore()?.length).toEqual(36);
    })
    .unsubscribe();
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
