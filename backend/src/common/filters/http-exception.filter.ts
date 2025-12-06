import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Inject,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as Sentry from '@sentry/node';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) { }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.message
                : 'Internal server error';

        let errors: string[] | undefined;

        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
                const msg = (exceptionResponse as any).message;
                errors = Array.isArray(msg) ? msg : [msg];
            }
        } else if (exception instanceof Error) {
            errors = [exception.message];
        }

        const errorResponse = {
            status,
            message,
            ...(errors && { errors }),
        };

        // Log the error
        this.logger.error(
            `${request.method} ${request.url} - ${status} - ${message}`,
            {
                context: 'HttpExceptionFilter',
                exception: exception instanceof Error ? exception.stack : exception,
                body: request.body,
                query: request.query,
            },
        );

        // Send to Sentry if it's a 500 error
        if (status >= 500 && exception instanceof Error) {
            Sentry.captureException(exception);
        }

        response.status(status).json(errorResponse);
    }
}
