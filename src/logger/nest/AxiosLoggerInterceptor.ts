import { Injectable } from '@nestjs/common';
import {
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  AxiosResponseHeaders,
  InternalAxiosRequestConfig,
  Method,
  RawAxiosRequestHeaders,
  RawAxiosResponseHeaders,
} from 'axios';
import { Logger } from '../core/Logger';

type MethodsHeaders = Partial<
  {
    [Key in Method as Lowercase<Key>]: AxiosHeaders;
  } & { common: AxiosHeaders }
>;

interface RequestMetadata {
  method: string | undefined;
  domain: string | undefined;
  endpoint: string | undefined;
  queryParams: unknown;
  headers: (RawAxiosRequestHeaders & MethodsHeaders) | AxiosHeaders | undefined;
  body: unknown;
}

interface ResponseMetadata {
  statusCode: number;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  body: unknown;
}

@Injectable()
export class AxiosLoggerInterceptor {
  constructor(private logger: Logger) {}

  public requestInterceptor(config: InternalAxiosRequestConfig<unknown>) {
    const metadata: RequestMetadata = {
      method: config.method,
      domain: config.baseURL,
      endpoint: config.url,
      queryParams: config.params,
      body: config.data,
      headers: config.headers.toJSON(true),
    };

    this.logger.info('External request', metadata);

    return config;
  }

  public responseInterceptor(response: AxiosResponse<unknown>) {
    const metadata: ResponseMetadata = {
      statusCode: response.status,
      headers: response.headers,
      body: response.data,
    };
    this.logger.info('External response', metadata);
    return response;
  }

  public responseFailInterceptor(error: any) {
    if (error.response) {
      const metadata: ResponseMetadata = {
        statusCode: error.response.status,
        body: error.response.data,
        headers: error.response.headers,
      };
      this.logger.error('External response', metadata);
    }
    return Promise.reject(error);
  }

  public configureClient(httpClient: AxiosInstance) {
    httpClient.interceptors.request.use((a) => this.requestInterceptor(a));
    httpClient.interceptors.response.use(
      (v) => this.responseInterceptor(v),
      (e) => this.responseFailInterceptor(e),
    );
  }
}
