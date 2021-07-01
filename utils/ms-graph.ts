import * as msal from '@azure/msal-node';
import { Client } from '@microsoft/microsoft-graph-client';

const clientId = process.env.MS_CLIENT_ID;
const tenantId = process.env.MS_TENANT_ID;
const clientSecret = process.env.MS_CLIENT_SECRET;

if (!clientId || !tenantId || !clientSecret) {
  throw new Error('Missing credentials for MS Azure.');
}

const clientConfig = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    clientSecret,
  },
};

function getCCA() {
  return new msal.ConfidentialClientApplication(clientConfig);
}

export async function getGraphToken() {
  const cca = getCCA();

  const clientCredentialRequest = {
    scopes: [`api://${clientId}/.default`],
  };

  const result = await cca.acquireTokenByClientCredential(clientCredentialRequest);

  if (!result) throw new Error('[microsoft] Null Result');

  return result.accessToken;
}

export async function getGraphClient() {
  const accessToken = await getGraphToken();
  const client = Client.init({ authProvider: (done) => done(null, accessToken) });

  return client;
}

export async function sendEmail() {
  const client = await getGraphClient();

  await client.api('/me/sendMail').post({
    message: {
      subject: 'Test Email',
      toRecipients: [
        {
          emailAddress: {
            address: 'kay.kim@coxwave.com',
          },
        },
      ],
      body: {
        content: '<h1>hello world</h1>',
        contentType: 'html',
      },
    },
  });
}

export async function getInfo() {
  const client = await getGraphClient();

  return await client.api('/me').get();
}
