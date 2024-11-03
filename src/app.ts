import 'reflect-metadata';

import {exit} from 'process';
import * as path from 'path';
import * as morgan from 'morgan';
import * as express from 'express';
import * as compression from 'compression';
import {Logger} from '@creatioart-js/express-logging';
import {EnvironmentType, ErrorHelper} from '@creatioart-js/express-core';
import {Action, useExpressServer, useContainer} from 'routing-controllers';
import {ExpressErrorHandlerMiddleware} from '@creatioart-js/express-error-handler';
import {createExpressJsonMiddleware, createExpressUrlencodedMiddleware, ExpressGlobalAppMiddleware,
        SecurityDirectiveType, setExpressAppSecurity} from '@creatioart-js/express-security';
import * as appConainer from './config/container';
import * as securityApp from './config/security';

/**
 * Setup routing-controllers to use typedi container.
 */
(async () => {
  useContainer(await appConainer.initializeApp());
})().catch((e) => Logger().error(ErrorHelper.toErrorString(e, 'Unknown')));

let app = express();

// Use Express App Security
app = setExpressAppSecurity(app,
  [
    EnvironmentType.local,
    EnvironmentType.dev,
    EnvironmentType.test,
    EnvironmentType.preprod,
    EnvironmentType.prod
  ],
  [
    SecurityDirectiveType.CROSS_ORIGIN_RESOURCE,
    SecurityDirectiveType.CONTENT_SECURITY_POLICY,
    SecurityDirectiveType.X_FRAME_POLICY,
    SecurityDirectiveType.X_POWERED_BY_POLICY,
    SecurityDirectiveType.NO_CACHE_POLICY,
    SecurityDirectiveType.PERMISSIONS_POLICY,
    SecurityDirectiveType.STRICT_TRANSPORT_POLICY,
    SecurityDirectiveType.X_CONTENT_TYPE_POLICY,
  ]
);

// Use to compress response bodies for all request.
app.use(compression());

// Support json bodies & Set the body size limit to 32 megabyte
app.use(createExpressJsonMiddleware());

// Support encoded bodies & Set the body size limit to 32 megabyte
app.use(createExpressUrlencodedMiddleware());

//  trust proxy to one of the values listed in the following table
app.enable('trust proxy');

app.use(
  morgan('combined', {
    stream: {
      write: (meta: any) => {
        Logger().info(meta);
      },
    },
  })
);

/**
 * We create a new express server instance.
 * We could have also use useExpressServer here to attach controllers to an existing express instance.
 */
useExpressServer(app, {
  authorizationChecker: async (action: Action, roles: string[]) => {
    // Special function used to check user authorization roles per request.
    return await securityApp.authorizationCheckerApp(action, roles);
  },
  controllers: [path.join(__dirname, '/controller/**/*.js')],
  defaultErrorHandler: false,
  middlewares: [ExpressErrorHandlerMiddleware, ExpressGlobalAppMiddleware],
  routePrefix: '/template/nodejs-express-service',
});

process.on('SIGTERM', function () {
  Logger().info(`Server received SIGTERM, exiting gracefully`);
  exit(0);
});

/**
 * Start the express app.
 * Listen to the App specified port, or 3000 otherwise
 */
const PORT = process.env['PORT'] ?? 3000;
app.listen(PORT, () => {
  Logger().info(`Server listening at http://127.0.0.1:${PORT} ...`);
});

export = app;
