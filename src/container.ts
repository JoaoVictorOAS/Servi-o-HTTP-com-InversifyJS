import "reflect-metadata";
import { Container } from "inversify";
import { service_types } from "./types";
import { Logger } from "./domain/logger";
import { DevLogger, ProdLogger } from "./infra/logger/winston";
import { Mailer } from "./domain/mailer";
import { EtherealMailer, SmtpMailer } from "./infra/mailer/nodemailer";
import {
  ReportService,
  ReportServiceImpl,
} from "./domain/report-service";
import { ReportHttpAdapter } from "./adapters/http/report-http-adapter";

const service_container = new Container();

if (process.env.APP_ENV === "dev") {
  service_container.bind<Logger>(service_types.Logger).to(DevLogger).inSingletonScope();
  service_container.bind<Mailer>(service_types.Mailer).to(EtherealMailer).inSingletonScope();
} else {
  service_container.bind<Logger>(service_types.Logger).to(ProdLogger).inSingletonScope();
  service_container.bind<Mailer>(service_types.Mailer).to(SmtpMailer).inSingletonScope();
}

service_container
  .bind<ReportService>(service_types.ReportService)
  .to(ReportServiceImpl)
  .inSingletonScope();
service_container
  .bind<ReportHttpAdapter>(service_types.ReportHttpAdapter)
  .to(ReportHttpAdapter)
  .inSingletonScope();

export { service_container };
