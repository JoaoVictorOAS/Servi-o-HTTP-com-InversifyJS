import 'reflect-metadata';
import { ReportHttpAdapter } from './report-http-adapter';
import { ReportService, InvalidReportSizeError } from '../../domain/report-service';
import { Request, Response } from 'express';
import { mock, instance, when, anything, verify } from 'ts-mockito';

describe('ReportHttpAdapter', () => {
  let report_service_mock: ReportService;
  let report_http_adapter: ReportHttpAdapter;
  let request_mock: Request;
  let response_mock: Response;

  beforeEach(() => {
    report_service_mock = mock<ReportService>();
    request_mock = mock<Request>();
    response_mock = mock<Response>();

    const partial_response_mock = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };
    response_mock = partial_response_mock as any;


    report_http_adapter = new ReportHttpAdapter(instance(report_service_mock));

    request_mock.query = { email: 'test@example.com', n: '10' };
  });

  it('should call report_service and send a 200 response on success', async () => {
    when(report_service_mock.generateAndSend(anything(), anything())).thenResolve();
    request_mock.query = { email: 'test@example.com', n: '10' };


    await report_http_adapter.handle(request_mock, response_mock);

    verify(report_service_mock.generateAndSend('test@example.com', 10)).once();
    expect(response_mock.status).toHaveBeenCalledWith(200);
    expect(response_mock.send).toHaveBeenCalledWith({ message: "Relatório enviado com sucesso" });
  });

  it('should send a 400 response if email is missing', async () => {
    request_mock.query = { n: '10' };

    await report_http_adapter.handle(request_mock, response_mock);

    verify(report_service_mock.generateAndSend(anything(), anything())).never();
    expect(response_mock.status).toHaveBeenCalledWith(400);
    expect(response_mock.send).toHaveBeenCalledWith({ error: "E-mail é obrigatório" });
  });

  it('should use a default value of 5 for n if it is not provided', async () => {
    when(report_service_mock.generateAndSend(anything(), anything())).thenResolve();
    request_mock.query = { email: 'test@example.com' };

    await report_http_adapter.handle(request_mock, response_mock);

    verify(report_service_mock.generateAndSend('test@example.com', 5)).once();
    expect(response_mock.status).toHaveBeenCalledWith(200);
  });

  it('should send a 400 response for InvalidReportSizeError', async () => {
    when(report_service_mock.generateAndSend(anything(), anything())).thenThrow(new InvalidReportSizeError());
    request_mock.query = { email: 'test@example.com', n: '999' };

    await report_http_adapter.handle(request_mock, response_mock);

    verify(report_service_mock.generateAndSend('test@example.com', 999)).once();
    expect(response_mock.status).toHaveBeenCalledWith(400);
    expect(response_mock.send).toHaveBeenCalledWith({ error: 'Tamanho do relatório inválido' });
  });

  it('should send a 500 response for a generic error', async () => {
    const generic_error = new Error('Something went wrong');
    when(report_service_mock.generateAndSend(anything(), anything())).thenThrow(generic_error);
    request_mock.query = { email: 'test@example.com', n: '10' };

    const console_error_spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await report_http_adapter.handle(request_mock, response_mock);

    verify(report_service_mock.generateAndSend('test@example.com', 10)).once();
    expect(response_mock.status).toHaveBeenCalledWith(500);
    expect(response_mock.send).toHaveBeenCalledWith({ error: "Erro interno do servidor" });
    expect(console_error_spy).toHaveBeenCalledWith(generic_error);

    console_error_spy.mockRestore();
  });
});