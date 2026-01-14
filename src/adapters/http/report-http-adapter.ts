import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {
  ReportService,
  InvalidReportSizeError,
} from "../../domain/report-service";
import { service_types } from "../../types";

@injectable()
export class ReportHttpAdapter {
  constructor(
    @inject(service_types.ReportService) private readonly report_service: ReportService
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { email: email_address, n: report_size } = req.query;

      if (!email_address) {
        res.status(400).send({ error: "E-mail é obrigatório" });
        return;
      }

      await this.report_service.generateAndSend(email_address as string, Number(report_size || 5));
      res.status(200).send({ message: "Relatório enviado com sucesso" });
    } catch (catched_error) {
      if (catched_error instanceof InvalidReportSizeError) {
        res.status(400).send({ error: (catched_error as Error).message });
      } else {
        console.error(catched_error);
        res.status(500).send({ error: "Erro interno do servidor" });
      }
    }
  }
}
