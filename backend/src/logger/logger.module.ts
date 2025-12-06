import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
    imports: [
        WinstonModule.forRoot({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.colorize(),
                        winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
                            return `${timestamp} [${context || 'Application'}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
                        }),
                    ),
                }),
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json(),
                    ),
                }),
                new winston.transports.File({
                    filename: 'logs/combined.log',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json(),
                    ),
                }),
            ],
        }),
    ],
    exports: [WinstonModule],
})
export class LoggerModule { }
