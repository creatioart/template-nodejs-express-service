import 'reflect-metadata';

import {I18n} from 'i18n';
import {Container} from 'typedi';
import {Logger} from '@creatioart-js/express-logging';

/**
 * Validate and register the i18n
 */
export function registerI18n(): void {
  Logger().info(`Register the i18n for locations`);

  const i18n = new I18n();
  i18n.configure({
    // Setup some locales - other locales default to en silently
    locales: ['en', 'es'],

    // Alter a site wide default locale
    defaultLocale: 'en',

    // Will return translation from defaultLocale in case current locale doesn't provide it
    retryInDefaultLocale: true,

    // Sets a custom header name to read the language preference from - accept-language header by default
    header: 'accept-language',

    // Query parameter to switch locale (ie. /home?lang=ch)
    queryParameter: 'lang',

    // Where to store json files, relative to modules directory
    directory: './locales/compiled',

    // Hash to specify different aliases for i18n's internal methods to apply on the request/response objects (method -> alias)
    api: {
      __: 'translate',
      __n: 'translateN',
    },
  });

  // Set Container
  Container.set('I18n', i18n);
}
