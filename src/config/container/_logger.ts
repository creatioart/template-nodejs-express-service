import 'reflect-metadata';

import {Container} from 'typedi';
import {ConsoleLoggerService, LoggerType} from '@creatioart-js/express-logging';

/**
 * Validate and register the Logger
 */
export function registerLogger(): void {
  const LOGGER: any = process.env['LOGGER'];

  if (LOGGER !== undefined && Object.values(LoggerType).includes(LOGGER) === true) {
    switch (LOGGER) {
      // Console
      case LoggerType.CONSOLE:
        Container.set('Logger', new ConsoleLoggerService());
        break;
    }

    return;
  } else {
    throw new Error(`Fail. Invalid logger. Allowed values: ${Object.values(LoggerType)}`);
  }
}
