const service_types = {
  Logger: Symbol.for("Logger"),
  Mailer: Symbol.for("Mailer"),
  ReportService: Symbol.for("ReportService"),
  ReportHttpAdapter: Symbol.for("ReportHttpAdapter"),
};

export { service_types };