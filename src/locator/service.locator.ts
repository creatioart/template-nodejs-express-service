import 'reflect-metadata';

import {Container} from 'typedi';
import {TemplateService} from '../service/template.service';
import {ITemplateService} from '../service/interface/itemplate.service';

/**
 * Service Locator
 */
export class ServiceLocator {

  /**
   * Template Service
   */
  public static TemplateService(): ITemplateService {
    if (this.templateService) {
      return this.templateService;
    } else {
      this.templateService = Container.get(TemplateService);
      return this.templateService;
    }
  }

  /**
   * Clean the Locator
   */
  public static clean(): void {
    this.templateService = undefined;
  }

  private static templateService: ITemplateService | undefined;
}
