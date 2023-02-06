// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { environment as productionEnv } from './environment.prod';

export const environment = {
  ...productionEnv,
  production: false,
  thisUrl: 'http://localhost:4200',
  apiUrl: 'http://localhost:4000',
  foodServiceUrl: 'http://localhost:9090',
  questionnaireServiceUrl: 'http://localhost:9080',
  userServiceUrl: 'http://localhost:9070'
};

/*
export const environment = {
  production: true,
  thisUrl: 'https://babyfeedweb.z13.web.core.windows.net',
  apiUrl: 'https://ffq-authentication-service.azurewebsites.net',
  foodServiceUrl: 'https://ffq-fooditemservice.azurewebsites.net',
  questionnaireServiceUrl: 'https://ffq-questionnaireservice.azurewebsites.net',
  userServiceUrl: 'https://ffq-userservice.azurewebsites.net'
};
*/

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
