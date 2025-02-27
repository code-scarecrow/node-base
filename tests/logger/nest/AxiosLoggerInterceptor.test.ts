import { HttpStatus } from '@nestjs/common';
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { MockProxy, mock } from 'jest-mock-extended';
import { LogLevels, Logger } from '../../../src/logger/core';
import { AxiosLoggerInterceptor } from '../../../src/logger/nest/AxiosLoggerInterceptor';
import * as FormData from 'form-data';

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
      body: {
        test: 'test',
      },
      domain: 'test',
      endpoint: 'http://test.com',
      headers: {
        test: 'test',
      },
      method: 'test',
      queryParams: {
        id: 'id',
      },
    };
    const req: AxiosRequestConfig<unknown> = {
      method: 'test',
      baseURL: 'test',
      url: 'http://test.com',
      data: { test: 'test' },
      headers: { test: 'test' },
      params: { id: 'id' },
    };
    const uut = new AxiosLoggerInterceptor(logger);

    //Act
    uut.requestInterceptor(req);

    //Assert
    expect(logMessages[0]?.level).toBe(LogLevels.INFO);
    expect(logMessages[0]?.message).toBe('External request');
    expect(logMessages[0]?.metadata).toStrictEqual(expectedMetadata);
  });

  it('should log full data in response', async () => {
    //Arrage
    const expectedMetadata = {
      body: {
        id: 'test',
      },
      statusCode: HttpStatus.OK,
      headers: { test: 'test' },
    };
    const res: AxiosResponse<unknown> = {
      status: HttpStatus.OK,
      data: { id: 'test' },
      statusText: 'Ok',
      headers: { test: 'test' },
      config: {},
    };
    const uut = new AxiosLoggerInterceptor(logger);

    //Act
    uut.responseInterceptor(res);

    //Assert
    expect(logMessages[0]?.level).toBe(LogLevels.INFO);
    expect(logMessages[0]?.message).toBe('External response');
    expect(logMessages[0]?.metadata).toStrictEqual(expectedMetadata);
  });

  it('should log full data in response error', async () => {
    //Arrage
    const expectedMetadata = {
      body: {
        id: 'test',
      },
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      headers: { test: 'test' },
    };
    const err: AxiosError<unknown> = {
      response: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { id: 'test' },
        statusText: 'Internal server error',
        headers: { test: 'test' },
        config: {},
      },
      config: {},
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
    expect(logMessages[0]?.metadata).toStrictEqual(expectedMetadata);
  });

  it('should add request interceptor to the Axios instance', () => {
    const mockLogger = { info: jest.fn(), error: jest.fn() } as unknown as Logger;
    const axiosLoggerInterceptor = new AxiosLoggerInterceptor(mockLogger);
    const mockHttpClient = { interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } } } as unknown as AxiosInstance;

    axiosLoggerInterceptor.configureClient(mockHttpClient);

    expect(mockHttpClient.interceptors.request.use).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should handle null or undefined Axios instance', () => {
    const mockLogger = { info: jest.fn(), error: jest.fn() } as unknown as Logger;
    const axiosLoggerInterceptor = new AxiosLoggerInterceptor(mockLogger);

    expect(() => axiosLoggerInterceptor.configureClient(null as unknown as AxiosInstance)).toThrow();
    expect(() => axiosLoggerInterceptor.configureClient(undefined as unknown as AxiosInstance)).toThrow();
  });

  it('should log and return the config when config.data is a FormData', () => {
    const formData = new FormData();
    formData.append('key', 'value');

    const config: AxiosRequestConfig = {
      method: 'post',
      baseURL: 'https://api.example.com',
      url: '/endpoint',
      params: { param1: 'value1' },
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    const uut = new AxiosLoggerInterceptor(logger);
    uut.requestInterceptor(config);

    const expectedMetadata = {
      method: 'post',
      domain: 'https://api.example.com',
      endpoint: '/endpoint',
      queryParams: { param1: 'value1' },
      body: 'Buffer data was too big.',
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    
    expect(logMessages[0]?.metadata).toStrictEqual(expectedMetadata);
  });

});
