import {Action} from 'routing-controllers';
import {Logger} from '@creatioart-js/express-logging';
import {EnvironmentType, ErrorStatus, TraceHelper} from '@creatioart-js/express-core';
import {EntityError, ErrorCode, InternalError, UncodedError} from '@creatioart-js/express-error';
import {ErrorResponse} from '@creatioart-js/express-error-handler';
import {CoreServiceLocator} from '../../locator/core.service.locator';
import {authorizationCheckerPermissionApp} from './permission.security';
import {ServiceAccessDto} from '@creatioart-js/express-security';
import {CoreConfigMapLocator} from '../../locator/core.config.map.locator';

/**
 * Special function used to check user authorization roles per request.
 * Must return true or promise with boolean true resolved for authorization to succeed.
 * @param action Action
 * @param roles Roles
 */
export async function authorizationCheckerApp(action: Action, permissions: string[]) {
  const traceId = TraceHelper.getHTTPTraceIdentifier(action.request);
  Logger().info(`Wait For Authorization Checker. Trace: ${traceId}`);

  // Validate forn Authorization Header
  Logger().info(`Request Access to ${permissions.join(',')}. Trace: ${traceId}`);
  let accessResult = new ServiceAccessDto();
  const APP_ENV: any = process.env['APP_ENV'];

  if (APP_ENV !== EnvironmentType.local) {
    // Validate form Authorization Header
    let authorizationToken = '';
    if (action.request.headers !== undefined) {
      const headerRequest = action.request.headers;

      // Source Service
      if (Object.prototype.hasOwnProperty.call(headerRequest,
                                               CoreConfigMapLocator.ServiceConfigMap().authorization_token)) {
        authorizationToken = headerRequest[CoreConfigMapLocator.ServiceConfigMap().authorization_token];

        // Remove Bearer
        authorizationToken = authorizationToken.replace('Bearer ', '');
      }
    }

    Logger().info(`Authorization token must be validated to access to the service. Trace: ${traceId}`);

    // Check permission app per request.
    accessResult = await authorizationCheckerPermissionApp(action, accessResult, permissions, authorizationToken,
                                                           traceId);
  } else {
    // No Authorization Header
    Logger().info(`DISABLE AUTHORIZATION - LOCAL MODE. Trace: ${traceId}`);

    accessResult.status = ErrorStatus.OK;
    accessResult.hasAccess = true;
    accessResult.accessMessage = CoreServiceLocator.LocaleService().translate('ok');
  }

  // Invalid Access Result
  if (accessResult.hasAccess === false && accessResult.status === ErrorStatus.NONE) {
    // Set the Internal Error Status
    accessResult.status = ErrorStatus.INTERNAL_SERVER_ERROR;
    accessResult.code = ErrorCode.INTERNAL_SERVER_ERROR_BASE;
    accessResult.hasAccess = false;
    accessResult.accessMessage = CoreServiceLocator.LocaleService().translate('internal_server_error');
  }

  // Filter Response
  Logger().info(`Authorization Filter Response: HTTP Status: ${accessResult.status} | ` +
                `Error Code: ${accessResult.code} | Has Access: ${accessResult.hasAccess} | ` +
                `Message: ${accessResult.accessMessage}. Trace: ${traceId}`);

  if (accessResult.hasAccess) {
    return true;
  } else {
    let accessResultError;

    if (accessResult.code === ErrorCode.NONE) {
      accessResultError = new UncodedError(accessResult.status, accessResult.accessMessage);
    } else if ((accessResult.entityTypeName !== undefined && accessResult.entityTypeName !== '')) {
      accessResultError = new EntityError(accessResult.status, accessResult.accessMessage, accessResult.code,
                                          (accessResult.entityTypeName ?? ServiceAccessDto.Name),
                                          undefined);
    } else {
      accessResultError = new InternalError(accessResult.status, accessResult.accessMessage, accessResult.code);
    }

    // return error
    throw new ErrorResponse(accessResultError);
  }
}
