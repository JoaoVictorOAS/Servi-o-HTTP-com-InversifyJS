import { injectable, inject } from "inversify";
import { Logger } from "./logger";
import { Mailer } from "./mailer";
import { faker } from "@faker-js/faker";
import { service_types } from "../types";

export class InvalidReportSizeError extends Error {
  constructor() {
    super("Tamanho do relatório inválido");
    this.name = "InvalidReportSizeError";
  }
}

export interface ReportService {
  generateAndSend(email_address: string, report_size: number): Promise<void>;
}

@injectable()
export class ReportServiceImpl implements ReportService {
  constructor(
    @inject(service_types.Logger) private readonly _logger: Logger,
    @inject(service_types.Mailer) private readonly _mailer: Mailer
  ) {}

  async generateAndSend(email_address: string, report_size: number): Promise<void> {
    if (report_size < 0 || report_size > 10) {
      throw new InvalidReportSizeError();
    }

    this._logger.info(`Gerando relatório para ${email_address}`);

    const report_data = Array.from({ length: report_size }, () => ({
      name: faker.person.fullName(),
      city: faker.location.city(),
    }));

    const report_content = report_data.map((report_item) => `${report_item.name} - ${report_item.city}`).join("\n");

    await this._mailer.send(email_address, "Seu Relatório", report_content);

    this._logger.info(`Relatório enviado para ${email_address}`);
  }
}