import {
    constants as http2constants,
    connect as http2connect,
    ClientHttp2Session,
} from 'http2';
import { OutgoingHttpHeaders } from 'http';
import { CentralDogmaOptions } from '../centralDogma';

const {
    HTTP2_HEADER_METHOD,
    HTTP2_METHOD_GET,
    HTTP2_METHOD_POST,
    HTTP2_METHOD_DELETE,
    HTTP2_METHOD_PATCH,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_HEADER_CONTENT_LENGTH,
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_STATUS,
    HTTP2_HEADER_AUTHORIZATION,
} = http2constants;

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
        this.session = http2connect(opts.baseURL, {});
    }

    async get(
        path: string,
        requestHeaders?: OutgoingHttpHeaders,
    ): Promise<CentralDogmaResponse> {
        const body = {};
        return await this.request(HTTP2_METHOD_GET, path, body, requestHeaders);
    }

    async post(
        path: string,
        body?: Record<string, unknown>,
        requestHeaders?: OutgoingHttpHeaders,
    ): Promise<CentralDogmaResponse> {
        return await this.request(
            HTTP2_METHOD_POST,
            path,
            body,
            requestHeaders,
        );
    }

    async delete(
        path: string,
        requestHeaders?: OutgoingHttpHeaders,
    ): Promise<CentralDogmaResponse> {
        const body = {};
        return await this.request(
            HTTP2_METHOD_DELETE,
            path,
            body,
            requestHeaders,
        );
    }

    async patch(
        path: string,
        body?: unknown,
        requestHeaders?: OutgoingHttpHeaders,
    ): Promise<CentralDogmaResponse> {
        return await this.request(
            HTTP2_METHOD_PATCH,
            path,
            body,
            requestHeaders,
        );
    }

    private async request(
        method: string,
        path: string,
        body?: unknown,
        requestHeaders?: OutgoingHttpHeaders,
    ) {
        return new Promise<CentralDogmaResponse>((resolve, reject) => {
            const defaultHeaders = {
                [HTTP2_HEADER_METHOD]: method,
                [HTTP2_HEADER_AUTHORIZATION]: `Bearer ${this.token}`,
                [HTTP2_HEADER_PATH]: path,
            };
            const buffer = Buffer.from(JSON.stringify(body));
            const postHeaders = [
                HTTP2_METHOD_POST,
                HTTP2_METHOD_PATCH,
            ].includes(method)
                ? {
                      [HTTP2_HEADER_CONTENT_TYPE]:
                          method === HTTP2_METHOD_POST
                              ? 'application/json'
                              : 'application/json-patch+json',
                      [HTTP2_HEADER_CONTENT_LENGTH]: Buffer.byteLength(buffer),
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
                        responseHeaders[HTTP2_HEADER_STATUS],
                    );
                    const response: CentralDogmaResponse = {
                        headers: responseHeaders,
                        statusCode,
                        data,
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

            if ([HTTP2_METHOD_POST, HTTP2_METHOD_PATCH].includes(method)) {
                stream.setEncoding('utf8');
                stream.end(buffer);
            }
        });
    }
}
