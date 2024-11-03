import 'reflect-metadata';

import {configDotenv} from 'dotenv';
import {EnvironmentType} from '@creatioart-js/express-core';
import {Logger} from '@creatioart-js/express-logging';

/**
 * Validate and register environments
 */
 export function registerEnv(): void {
  const APP_ENV: any = process.env['APP_ENV'] ?? '';
  Logger().info(`Register environments: ${APP_ENV}`);

  if (APP_ENV !== undefined && Object.values(EnvironmentType).includes(APP_ENV) === true) {
    // Only for Local Envs
    if (APP_ENV === EnvironmentType.local) {
      configDotenv({path: '.configuration/local.env'});
    }

    return;
  } else {
    throw new Error(`Fail. Invalid environment. Allowed values: ${Object.values(EnvironmentType)}`);
  }
}
