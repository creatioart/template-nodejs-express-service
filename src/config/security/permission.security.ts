import {Logger} from '@creatioart-js/express-logging';
import {ErrorStatus} from '@creatioart-js/express-core';
import {CoreServiceLocator} from '../../locator/core.service.locator.js';
import {Action} from '@creatioart-js/routing-controllers';
import {ServiceAccessDto} from '@creatioart-js/express-security';
import {PermissionConfig} from '../permission.config.js';

/**
 * Special function used to check permission app per request.
 * @param action Action
 * @param accessResult Service Access Dto
 * @param permissions Permission
 * @param authorizationToken Authorization token
 * @param traceId Trace id
 * @returns Service Access Dto
 */
export async function authorizationCheckerPermissionApp(_: Action, accessResult: ServiceAccessDto,
                                                        permissions: string[], __: string,
                                                        traceId: string): Promise<ServiceAccessDto> {
  Logger().info(`Check permission app. Trace: ${traceId}`);

  if (permissions.length > 0) {
    // Analyzing for each permission
    for (const permission of permissions) {
      switch (permission) {
        // NO_AUTHORIZATION Permission
        case PermissionConfig.NO_AUTHORIZATION: {
          accessResult.status = ErrorStatus.OK;
          accessResult.hasAccess = true;
          accessResult.accessMessage = CoreServiceLocator.LocaleService().translate('ok');
          break;
        }
      }

      if (accessResult.hasAccess) {
        break;
      }
    }
  } else {
    // NO_AUTHORIZATION Permission
    Logger().warn(`Permission has not been detected for this route. Trace: ${traceId}`);

    accessResult.status = ErrorStatus.OK;
    accessResult.hasAccess = true;
    accessResult.accessMessage = CoreServiceLocator.LocaleService().translate('ok');
  }

  return accessResult;
}
