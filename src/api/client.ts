import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { getAuthToken } from './auth';

const url = "http://localhost:3000";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface TokenResponse {
    token: string;
}

export interface MeResponse {
    id: string;
    firebaseUID: string;
    displayName: string;
    email: string;
    accessLevel: number;
}

export interface RegisterRequest {
    displayName: string;
    email: string;
    password: string;
}

export type AllUsersResponse = Array<MeResponse>;

class WebAppApi {
    private _client: AxiosInstance;

    public constructor() {
        this._client = axios.create({
            baseURL: url,
        });
    }

    private request<Request, Response>(
        fun: (a: Request) => any, 
        request: Request,
        handler: (response: Response) => void,
        errorHandler: (error: AxiosError) => void = (error) => console.error(error)
    ) {
        fun(request)
            .then((response: any) => response.data)
            .then((response: AxiosResponse<Response>) => handler(response.data))
            .catch(errorHandler);
    }

    private authHeader() {
        const token = getAuthToken();

        return {
            headers: {
                "Authorization": "Bearer " + token
            }
        };
    }

    /* Login Request */
    private loginApi(loginRequest: LoginRequest) {
        return this._client.post<TokenResponse>('/user/login', {
            email: loginRequest.email
        }, {
            headers: {
                password: loginRequest.password
            }
        });
    };

    public postLogin(
        loginRequest: LoginRequest, 
        handler: (response: TokenResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.loginApi.bind(this), loginRequest, handler, errorHandler);
    }

    /* Register Request */
    private registerApi(registerRequest: RegisterRequest) {
        return this._client.post<TokenResponse>('/user/register', registerRequest);
    }

    public postRegister(
        registerRequest: RegisterRequest,
        handler: (response: TokenResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.registerApi.bind(this), registerRequest, handler, errorHandler);
    }

    /* Me Request */
    private meApi() {
        return this._client.get<MeResponse>('/user/me',  this.authHeader());
    }

    public getMe(
        handler: (response: MeResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.meApi.bind(this), 0, handler, errorHandler);
    }

    /* All Users Request */
    private allUsersApi() {
        return this._client.get<AllUsersResponse>('/user/all',  this.authHeader());
    }

    public getAllUsers(
        handler: (response: AllUsersResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.allUsersApi.bind(this), 0, handler, errorHandler);
    }
}

export const WebAppClient = new WebAppApi();