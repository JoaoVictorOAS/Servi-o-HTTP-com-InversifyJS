import 'reflect-metadata';
import { ReportServiceImpl, InvalidReportSizeError } from './report-service';
import { Logger } from './logger';
import { Mailer } from './mailer';
import { mock, instance, verify, when, anything } from 'ts-mockito';

describe('ReportService', () => {
  let logger_mock: Logger;
  let mailer_mock: Mailer;
  let report_service: ReportServiceImpl;

  beforeEach(() => {
    logger_mock = mock<Logger>();
    mailer_mock = mock<Mailer>();
    report_service = new ReportServiceImpl(instance(logger_mock), instance(mailer_mock));
  });

  it.each([
    { report_size: -5, description: 'um número negativo' },
    { report_size: 15, description: 'um número maior que 10' },
  ])('deve lançar InvalidReportSizeError quando report_size for $description ($report_size)', async ({ report_size }) => {
    const email_address = 'test@example.com';

    await expect(report_service.generateAndSend(email_address, report_size)).rejects.toThrow(InvalidReportSizeError);

    verify(mailer_mock.send(anything(), anything(), anything())).never();
  });

  it('deve chamar mailer.send com o e-mail correto em caso de sucesso', async () => {
    const email_address = 'success@example.com';
    const report_size = 5;
    when(mailer_mock.send(anything(), anything(), anything())).thenResolve();

    await report_service.generateAndSend(email_address, report_size);

    verify(mailer_mock.send(email_address, 'Seu Relatório', anything())).once();
    verify(logger_mock.info(`Gerando relatório para ${email_address}`)).once();
    verify(logger_mock.info(`Relatório enviado para ${email_address}`)).once();
  });
});