import 'reflect-metadata';

import {Container} from 'typedi';

/**
 * Resource Locator
 */
export class ResourceLocator {
  /**
   * I18n
   */
   public static I18n(): any {
    if (this.i18n) {
      return this.i18n;
    } else {
      this.i18n = Container.get('I18n');
      return this.i18n;
    }
  }

  /**
   * Clean the Locator
   */
  public static clean(): void {
    this.i18n = undefined;
  }

  private static i18n: any;
}
