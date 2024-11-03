import 'reflect-metadata';

import {Container} from 'typedi';
import {ILocaleService, LocaleService, ValidationMessage} from '@creatioart-js/express-core';

/**
 * Core Service Locator
 */
export class CoreServiceLocator {
  /**
   * Locale Service
   */
  public static LocaleService(): ILocaleService {
    if (this.localeService) {
      return this.localeService;
    } else {
      this.localeService = Container.get(LocaleService);
      return this.localeService;
    }
  }

  /**
   * Validation Message
   */
  public static ValidationMessage(): ValidationMessage {
    if (this.validationMessage) {
      return this.validationMessage;
    } else {
      this.validationMessage = Container.get(ValidationMessage);
      return this.validationMessage;
    }
  }

  /**
   * Clean the Locator
   */
  public static clean(): void {
    // Common Module
    this.localeService = undefined;
    this.validationMessage = undefined;
  }

  /**
   * Common Module
   */
  private static localeService: ILocaleService | undefined;

  private static validationMessage: ValidationMessage | undefined;
}
