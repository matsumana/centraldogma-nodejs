import http2, { ClientHttp2Session } from 'http2';
import { OutgoingHttpHeaders } from 'http';
import { CentralDogmaOptions } from '../centralDogma';

const {
    HTTP2_HEADER_METHOD,
    HTTP2_METHOD_GET,
    HTTP2_METHOD_POST,
    HTTP2_METHOD_DELETE,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_HEADER_CONTENT_LENGTH,
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_STATUS,
    HTTP2_HEADER_AUTHORIZATION,
} = http2.constants;

const DEFAULT_AUTHORIZATION_TOKEN = 'anonymous';

type CentralDogmaResponse = {
    headers: OutgoingHttpHeaders;
    statusCode: number;
    data: string;
};

export class HttpClient {
    private readonly token: string;
    private readonly session: ClientHttp2Session;

    constructor(opts: CentralDogmaOptions) {
        this.token = opts.token ?? DEFAULT_AUTHORIZATION_TOKEN;
        this.session = http2.connect(opts.baseURL, {});
    }

    async get(
        path: string,
        requestHeaders?: OutgoingHttpHeaders
    ): Promise<CentralDogmaResponse> {
        return this.request(HTTP2_METHOD_GET, path, {}, requestHeaders);
    }

    async post(
        path: string,
        body?: Record<string, unknown>,
        requestHeaders?: OutgoingHttpHeaders
    ): Promise<CentralDogmaResponse> {
        return this.request(HTTP2_METHOD_POST, path, body, requestHeaders);
    }

    async delete(
        project: string,
        requestHeaders?: OutgoingHttpHeaders
    ): Promise<CentralDogmaResponse> {
        return this.request(HTTP2_METHOD_DELETE, project, {}, requestHeaders);
    }

    private async request(
        method: string,
        path: string,
        body?: Record<string, unknown>,
        requestHeaders?: OutgoingHttpHeaders
    ) {
        return new Promise<CentralDogmaResponse>((resolve, reject) => {
            const defaultHeaders = {
                [HTTP2_HEADER_METHOD]: method,
                [HTTP2_HEADER_AUTHORIZATION]: `Bearer ${this.token}`,
                [HTTP2_HEADER_PATH]: path,
            };
            const buffer = Buffer.from(JSON.stringify(body));
            const postHeaders =
                method === HTTP2_METHOD_POST
                    ? {
                          [HTTP2_HEADER_CONTENT_TYPE]: 'application/json',
                          [HTTP2_HEADER_CONTENT_LENGTH]: Buffer.byteLength(
                              buffer
                          ),
                      }
                    : {};
            const stream = this.session.request({
                ...defaultHeaders,
                ...postHeaders,
                ...(requestHeaders ?? {}),
            });

            stream.on('response', (responseHeaders) => {
                let data = '';
                stream.on('data', (chunk) => (data += chunk.toString()));
                stream.on('end', () => {
                    const statusCode = Number(
                        responseHeaders[HTTP2_HEADER_STATUS]
                    );
                    const response: CentralDogmaResponse = {
                        headers: responseHeaders,
                        statusCode: statusCode,
                        data: data,
                    };
                    if (statusCode >= 200 && statusCode <= 299) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                });
            });
            stream.on('error', (err) => {
                reject(err);
            });

            if (method === HTTP2_METHOD_POST) {
                stream.setEncoding('utf8');
                stream.end(buffer);
            }
        });
    }
}
