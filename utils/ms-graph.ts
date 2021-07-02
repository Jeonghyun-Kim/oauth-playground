import * as msal from '@azure/msal-node';
import { Client } from '@microsoft/microsoft-graph-client';

const clientId = process.env.MS_CLIENT_ID;
const tenantId = process.env.MS_TENANT_ID;
const clientSecret = process.env.MS_CLIENT_SECRET;
const senderId = process.env.MS_SENDER_ID;

if (!clientId || !tenantId || !clientSecret || !senderId) {
  throw new Error('Missing credentials for MS Azure.');
}

const clientConfig = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    clientSecret,
  },
};

/**
 * @description get accessToken of CoxWave Azure App.
 * @returns accessToken for microsoft graph api
 */
export async function getGraphToken() {
  const cca = new msal.ConfidentialClientApplication(clientConfig);

  const clientCredentialRequest = {
    // scopes: [`api://${clientId}/.default`],
    scopes: [`https://graph.microsoft.com/.default`],
  };

  const result = await cca.acquireTokenByClientCredential(clientCredentialRequest);

  if (!result) throw new Error('[microsoft] Null Result');

  return result.accessToken;
}

async function getGraphClient(accessToken: string) {
  const client = Client.init({ authProvider: (done) => done(null, accessToken) });

  return client;
}

interface SendEmailProps {
  mailTo: {
    name?: string;
    address: string;
  };
  subject: string;
  body: {
    content: string;
    contentType?: 'html' | 'text';
  };
}

/**
 * Send Email via Microsoft Outlook REST Api v1.0
 * @param options send email options
 * @property mailTo: { name, address }
 * @property subject: string
 * @property body: { content, contentType }
 */
export async function sendEmail({ mailTo, subject, body }: SendEmailProps) {
  const accessToken = await getGraphToken();
  const client = await getGraphClient(accessToken);

  await client.api(`/users/${senderId}/sendMail`).post({
    message: {
      subject,
      toRecipients: [
        {
          emailAddress: {
            name: mailTo.name,
            address: mailTo.address,
          },
        },
      ],
      body: {
        content: body.content,
        contentType: body.contentType ?? 'html',
      },
    },
  });
}
