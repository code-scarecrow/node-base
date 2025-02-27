import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from '../core/Logger';
import { parseMqpRequest, parseNestRequest, parseNestResponse } from './Parsers';
import { Request, Response } from 'express';

@Injectable()
export class NestLoggingInterceptor<T> implements NestInterceptor<T, Response<T>> {
  // TODO separar la logica de cada contexto en archivos distintos.
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    if ('rmq' === `${context.getType()}`) {
      const metadata = parseMqpRequest(context.switchToRpc().getData());
      this.logger.info('Incomming Message', metadata);
      return next.handle();
    }

    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    if (req.url.includes('health-check')) return next.handle();

    const metadata = parseNestRequest(req);

    this.logger.info('Internal request', metadata);

    return next.handle().pipe(
      map((response) => {
        const metadata = parseNestResponse(res.statusCode, response);
        this.logger.info('Internal response', metadata);
        return response;
      }),
    );
  }
}
