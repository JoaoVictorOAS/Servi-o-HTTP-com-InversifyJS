import { injectable } from "inversify";
import winston from "winston";
import { Logger } from "../../domain/logger";

@injectable()
export class DevLogger implements Logger {
  private _logger: winston.Logger;

  constructor() {
    this._logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });
  }

  info(log_message: string) {
    this._logger.info(log_message);
  }

  warn(log_message: string) {
    this._logger.warn(log_message);
  }

  error(log_message: string) {
    this._logger.error(log_message);
  }
}

@injectable()
export class ProdLogger implements Logger {
  private _logger: winston.Logger;

  constructor() {
    this._logger = winston.createLogger({
      transports: [new winston.transports.File({ filename: "app.log" })],
    });
  }

  info(log_message: string) {
    this._logger.info(log_message);
  }

  warn(log_message: string) {
    this._logger.warn(log_message);
  }

  error(log_message: string) {
    this._logger.error(log_message);
  }
}