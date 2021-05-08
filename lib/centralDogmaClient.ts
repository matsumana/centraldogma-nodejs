import http2, { ClientHttp2Session } from 'http2';
import { OutgoingHttpHeaders } from 'http';

const {
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_STATUS,
    HTTP2_HEADER_AUTHORIZATION,
} = http2.constants;

const DEFAULT_AUTHORIZATION_TOKEN = 'anonymous';

export type CentralDogmaClientOptions = {
    baseURL: string;
    token?: string;
};

export type CentralDogmaResponse = {
    headers: OutgoingHttpHeaders;
    statusCode: number;
    body: string;
};

export class CentralDogmaClient {
    token: string;
    client: ClientHttp2Session;

    constructor(opts: CentralDogmaClientOptions) {
        this.token = opts.token ?? DEFAULT_AUTHORIZATION_TOKEN;
        this.client = http2.connect(opts.baseURL, {});
    }

    async request(path: string) {
        return new Promise<CentralDogmaResponse>((resolve, reject) => {
            const stream = this.client.request({
                [HTTP2_HEADER_AUTHORIZATION]: `Bearer ${this.token}`,
                [HTTP2_HEADER_PATH]: path,
            });
            stream.on('response', (headers) => {
                let body = '';
                stream.on('data', (chunk) => (body += chunk.toString()));
                stream.on('end', () => {
                    const statusCode = Number(headers[HTTP2_HEADER_STATUS]);
                    const response: CentralDogmaResponse = {
                        headers: headers,
                        statusCode: statusCode,
                        body: body,
                    };
                    if (statusCode >= 200 && statusCode <= 299) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                });
            });
        });
    }
}
