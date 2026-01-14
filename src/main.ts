import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import { service_container } from "./container";
import { service_types } from "./types";
import { ReportHttpAdapter } from "./adapters/http/report-http-adapter";

const express_app = express();
const server_port = process.env.APP_PORT || 3000;

const report_http_adapter = service_container.get<ReportHttpAdapter>(
  service_types.ReportHttpAdapter
);

express_app.get("/relatorio", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await report_http_adapter.handle(req, res);
  } catch (error) {
    console.error("Erro ao processar relatório:", error);
    next(error);
  }
});

express_app.listen(server_port, () => {
  console.log(`Servidor rodando na porta ${server_port}`);
});
