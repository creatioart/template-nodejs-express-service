import 'reflect-metadata';

import {Container} from 'typedi';
import {Logger} from '@creatioart-js/express-logging';
import {ResourceLocator} from '../../locator/resource.locator.js';
import {serviceConfigMap} from '../../config/service.config.map.js';
import {LocaleService, ValidationMessage} from '@creatioart-js/express-core';
import {CoreServiceLocator} from '../../locator/core.service.locator.js';
import {StaticTokenAuthorizationService} from '@creatioart-js/express-security';

/**
 * Validate and register the Services
 */
 export function registerServices(): void {
  Logger().info(`Register the Security Services`);
  Container.set(StaticTokenAuthorizationService, new StaticTokenAuthorizationService());

  Logger().info(`Register Third Services`);
  // Empty

  Logger().info(`Register the Core ConfigMap`);
  Container.set('ServiceConfigMap', serviceConfigMap);

  Logger().info(`Register the Core Services`);
  // Common Module
  Container.set(LocaleService, new LocaleService(ResourceLocator.I18n()));
  Container.set(ValidationMessage, new ValidationMessage(CoreServiceLocator.LocaleService()));
}
