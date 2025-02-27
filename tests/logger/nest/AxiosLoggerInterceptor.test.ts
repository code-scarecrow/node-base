import { HttpStatus } from '@nestjs/common';
import { AxiosError, AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { MockProxy, mock } from 'jest-mock-extended';
import { LogLevels, Logger } from '../../../src/logger/core';
import { AxiosLoggerInterceptor } from '../../../src/logger/nest/AxiosLoggerInterceptor';

describe('AxiosLoggerInterceptor Test', () => {
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
    const expectedMetadata = {
      method: 'test',
      domain: 'test',
      endpoint: 'http://test.com',
      queryParams: {
        id: 'id',
      },
      body: {
        test: 'test',
      },
      headers: {
        test: 'test',
      },
    };
    const req: InternalAxiosRequestConfig<unknown> = {
      method: 'test',
      baseURL: 'test',
      url: 'http://test.com',
      data: { test: 'test' },
      headers: new AxiosHeaders({ test: 'test' }),
      params: { id: 'id' },
    };
    const uut = new AxiosLoggerInterceptor(logger);

    //Act
    uut.requestInterceptor(req);

    //Assert
    expect(logMessages[0]?.level).toBe(LogLevels.INFO);
    expect(logMessages[0]?.message).toBe('External request');
    expect(JSON.stringify(logMessages[0]?.metadata)).toStrictEqual(JSON.stringify(expectedMetadata));
  });

  it('should log full data in response', async () => {
    //Arrage
    const expectedMetadata = {
      statusCode: HttpStatus.OK,
      headers: { test: 'test' },
      body: {
        id: 'test',
      },
    };
    const res: AxiosResponse<unknown> = {
      status: HttpStatus.OK,
      data: { id: 'test' },
      statusText: 'Ok',
      headers: { test: 'test' },
      config: { headers: new AxiosHeaders() },
    };
    const uut = new AxiosLoggerInterceptor(logger);

    //Act
    uut.responseInterceptor(res);

    //Assert
    expect(logMessages[0]?.level).toBe(LogLevels.INFO);
    expect(logMessages[0]?.message).toBe('External response');
    expect(JSON.stringify(logMessages[0]?.metadata)).toStrictEqual(JSON.stringify(expectedMetadata));
  });

  it('should log full data in response error', async () => {
    //Arrage
    const expectedMetadata = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        id: 'test',
      },
      headers: { test: 'test' },
    };
    const err: AxiosError<unknown> = {
      response: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { id: 'test' },
        statusText: 'Internal server error',
        headers: new AxiosHeaders({ test: 'test' }),
        config: { headers: new AxiosHeaders() },
      },
      config: { headers: new AxiosHeaders() },
      isAxiosError: true,
      toJSON: () => {
        return {};
      },
      name: '',
      message: '',
    };
    const uut = new AxiosLoggerInterceptor(logger);

    //Act
    const action = async () => await uut.responseFailInterceptor(err);

    //Assert
    expect(action).rejects.toEqual(err);
    expect(logMessages[0]?.level).toBe(LogLevels.ERROR);
    expect(logMessages[0]?.message).toBe('External response');
    expect(JSON.stringify(logMessages[0]?.metadata)).toStrictEqual(JSON.stringify(expectedMetadata));
  });
});
