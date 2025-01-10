import 'reflect-metadata';

import {exit} from 'process';
import {Container} from 'typedi';
import {ErrorHelper} from '@creatioart-js/express-core';
import {Logger} from '@creatioart-js/express-logging';
import * as appContainerEnv from './_env.js';
import * as appContainerI18n from './_i18n.js';
import * as appContainerLogger from './_logger.js';
import * as appContainerValidator from './_validator.js';
import * as appContainerServices from './_services.js';
import {CustomErrorHandler, ExpressErrorHandlerMiddleware} from '@creatioart-js/express-error-handler';
import {ExpressGlobalAppMiddleware} from '@creatioart-js/express-security';
import {CoreServiceLocator} from '../../locator/core.service.locator.js';

/**
 * Initialize App
 */
export async function initializeApp(): Promise<any> {
  try {
    if (Container.has('ContainerIncluded') === false) {
      // Register Middleware
      Container.set(ExpressErrorHandlerMiddleware, new ExpressErrorHandlerMiddleware(new CustomErrorHandler()));
      Container.set(ExpressGlobalAppMiddleware, new ExpressGlobalAppMiddleware());

      // Validate and register environments
      appContainerEnv.registerEnv();

      // Register the i18n for locations
      appContainerI18n.registerI18n();

      // Validate and register logger
      appContainerLogger.registerLogger();

      Logger().info('Start to Initialize App');

      // Register Validator
      appContainerValidator.registerValidator();

      // Register Services
      appContainerServices.registerServices();

      // All Successful Then Register the Container Included
      Container.set('ContainerIncluded', Date.now);

      Logger().info(CoreServiceLocator.LocaleService().translate('complete_initialize_app'));
    } else {
      Logger().info('Container is already registered');
    }
  } catch (err) {
    Logger().error(ErrorHelper.toErrorString(err, 'Unknown'));
    Logger().error('Fail to Initialize App');
    exit(0);
  }

  return Container;
}
