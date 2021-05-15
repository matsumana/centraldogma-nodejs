import http2, { ClientHttp2Session } from 'http2';
import { OutgoingHttpHeaders } from 'http';
import { CentralDogmaClientOptions } from '../centralDogma';

const {
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_STATUS,
    HTTP2_HEADER_AUTHORIZATION,
} = http2.constants;

const DEFAULT_AUTHORIZATION_TOKEN = 'anonymous';

type CentralDogmaResponse = {
    headers: OutgoingHttpHeaders;
    statusCode: number;
    body: string;
};

export class HttpClient {
    private readonly token: string;
    private readonly session: ClientHttp2Session;

    constructor(opts: CentralDogmaClientOptions) {
        this.token = opts.token ?? DEFAULT_AUTHORIZATION_TOKEN;
        this.session = http2.connect(opts.baseURL, {});
    }

    async request(path: string, requestHeaders?: OutgoingHttpHeaders) {
        return new Promise<CentralDogmaResponse>((resolve, reject) => {
            const defaultHeaders = {
                [HTTP2_HEADER_AUTHORIZATION]: `Bearer ${this.token}`,
                [HTTP2_HEADER_PATH]: path,
            };
            const stream = this.session.request({
                ...defaultHeaders,
                ...(requestHeaders ?? {}),
            });
            stream.on('response', (responseHeaders) => {
                let body = '';
                stream.on('data', (chunk) => (body += chunk.toString()));
                stream.on('end', () => {
                    const statusCode = Number(
                        responseHeaders[HTTP2_HEADER_STATUS]
                    );
                    const response: CentralDogmaResponse = {
                        headers: responseHeaders,
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
