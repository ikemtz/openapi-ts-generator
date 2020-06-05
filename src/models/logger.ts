export interface ILogger {
  log: (data: string) => void;
  error: (data: string) => void;
  warn: (data: string) => void;
}

export class MockConsoleLogger implements ILogger {
  // tslint:disable-next-line: no-empty
  public log = (data: string) => {};
  // tslint:disable-next-line: no-empty
  public error = (data: string) => {};
  // tslint:disable-next-line: no-empty
  public warn = (data: string) => {};
}
