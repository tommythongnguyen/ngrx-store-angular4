import { Injectable } from '@angular/core';

@Injectable()
export class Logger {
  log(msg?: any, error?: any)   { console.log(msg, error); }
  error(msg?: any, error?: any) { console.error(msg, error); }
  warn(msg?: any, error?: any )  { console.warn(msg, error); }
}
