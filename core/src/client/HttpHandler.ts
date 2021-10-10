import { MatrixClient } from '..';
import { MatrixError } from '../model/MatrixError';

const CLIENT_API_PREFIX = '/_matrix/client/r0';

type RequestMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH';

export class HttpHandler {
  private client: MatrixClient;

  constructor(client: MatrixClient) {
    this.client = client;
  }

  async request(method: RequestMethod, url: string, body?: any): Promise<any> {
    const res = await fetch(
      `${this.client.homeserver}${CLIENT_API_PREFIX}${url}`,
      {
        method,
        headers: this.client.accessToken
          ? {
              Authorization: `Bearer ${this.client.accessToken}`,
            }
          : undefined,
        body: body && (typeof body === 'string' ? body : JSON.stringify(body)),
      }
    );

    const json = await res.json();

    if (!res.ok) {
      throw new MatrixError(json);
    }

    return json;
  }
}
