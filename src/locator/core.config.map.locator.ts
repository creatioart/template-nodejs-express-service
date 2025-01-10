import 'reflect-metadata';

import {Container} from 'typedi';
import {ServiceConfigMap} from '../config/type/service.config.map.js';

/**
 * Core Config Map Locator
 */
export class CoreConfigMapLocator {
  /**
   * Service Config Map
   */
  public static ServiceConfigMap(): ServiceConfigMap {
    if (this.serviceConfigMap) {
      return this.serviceConfigMap;
    } else {
      this.serviceConfigMap = Container.get<ServiceConfigMap>('ServiceConfigMap');
      return this.serviceConfigMap;
    }
  }

  /**
   * Clean the Locator
   */
  public static clean(): void {
    // Service Module
    this.serviceConfigMap = undefined;
  }

  /**
   * Service Module
   */
  private static serviceConfigMap: ServiceConfigMap | undefined;
}
