/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

require('dotenv').config();

if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
}

function requiredEnvVar(key) {
  const prop = process.env[key];
  if (!prop) {
    throw new Error(
      `You must provide the '${key}' env var. Check your .env file.`,
    );
  }
  return prop;
}

module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,

  // https://expressjs.com/en/guide/behind-proxies.html
  trustProxy: process.env.TRUST_PROXY || 'loopback',

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl:
      process.env.API_CLIENT_URL ||
      `http://localhost:${process.env.PORT || 3000}/graphql`,
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://localhost:${process.env.PORT || 3000}/graphql`,
  },

  pagarmeApiKey: requiredEnvVar('PAGARME_API_KEY'),
  pagarmeRecipientIdPlatform: requiredEnvVar('PAGARME_RECIPIENT_ID_PLATFORM'),
  pagarmeRecipientIdClientA: requiredEnvVar('PAGARME_RECIPIENT_ID_CLIENT_A'),
  pagarmeRecipientIdClientB: requiredEnvVar('PAGARME_RECIPIENT_ID_CLIENT_B'),
  pagarmePlatformPercentage: requiredEnvVar('PAGARME_PLATFORM_PERCENTAGE'),
  pagarmeClientPercentage: requiredEnvVar('PAGARME_CLIENT_PERCENTAGE'),

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },
};
