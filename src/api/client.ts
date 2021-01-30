import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { getAuthToken } from './auth';
import * as Model from './models';

const url = 'http://localhost:3000';

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
    private loginApi(loginRequest: Model.LoginRequest) {
        return this._client.post<Model.TokenResponse>('/user/login', {
            email: loginRequest.email
        }, {
            headers: {
                password: loginRequest.password
            }
        });
    };

    public postLogin(
        loginRequest: Model.LoginRequest, 
        handler: (response: Model.TokenResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.loginApi.bind(this), loginRequest, handler, errorHandler);
    }

    /* Register Request */
    private registerApi(registerRequest: Model.RegisterRequest) {
        return this._client.post<Model.TokenResponse>('/user/register', registerRequest);
    }

    public postRegister(
        registerRequest: Model.RegisterRequest,
        handler: (response: Model.TokenResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.registerApi.bind(this), registerRequest, handler, errorHandler);
    }

    /* Me Request */
    private meApi() {
        return this._client.get<Model.MeResponse>('/user/me',  this.authHeader());
    }

    public getMe(
        handler: (response: Model.MeResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.meApi.bind(this), 0, handler, errorHandler);
    }

    /* All Users Request */
    private allUsersApi() {
        return this._client.get<Model.AllUsersResponse>('/user/all',  this.authHeader());
    }

    public getAllUsers(
        handler: (response: Model.AllUsersResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.allUsersApi.bind(this), 0, handler, errorHandler);
    }

    /* All Contests Request */
    private allContestApi() {
        return this._client.get<Model.AllContestsResponse>('/contest/all',  this.authHeader());
    }

    public getAllContests(
        handler: (response: Model.AllContestsResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.allContestApi.bind(this), 0, handler, errorHandler);
    }

    /* All Contests Request as Admin */
    private adminContestApi() {
        return this._client.get<Model.AllContestsResponse>('/contest/my/as_admin',  this.authHeader());
    }

    public getAdminContests(
        handler: (response: Model.AllContestsResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.adminContestApi.bind(this), 0, handler, errorHandler);
    }

    /* All Contests Request as User */
    private userContestApi() {
        return this._client.get<Model.AllContestsResponse>('/contest/my/as_user',  this.authHeader());
    }

    public getUserContests(
        handler: (response: Model.AllContestsResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.userContestApi.bind(this), 0, handler, errorHandler);
    }

    /* Create Contest Request */
    private createContestApi(contestRequest: Model.CreateContestRequest) {
        return this._client.post<Model.ContestResponse>('/contest/create', contestRequest,  this.authHeader());
    }

    public postCreateContest(
        contestRequest: Model.CreateContestRequest,
        handler: (response: Model.ContestResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.createContestApi.bind(this), contestRequest, handler, errorHandler);
    }

    /* Create Task Request */
    private createTaskApi(taskRequest: Model.CreateTaskRequest) {
        return this._client.post<Model.TaskResponse>(`/task/by_contest/add/${taskRequest.contest_id}`, { text: taskRequest.text },  this.authHeader());
    }

    public postCreateTask(
        taskRequest: Model.CreateTaskRequest,
        handler: (response: Model.TaskResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.createTaskApi.bind(this), taskRequest, handler, errorHandler);
    }

    /* Get Contest Request */
    private getContestApi(contestRequest: Model.ContestRequest) {
        return this._client.get<Model.ContestResponse>(`/contest/${contestRequest.id}`,  this.authHeader());
    }

    public getContest(
        contestRequest: Model.ContestRequest,
        handler: (response: Model.ContestResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.getContestApi.bind(this), contestRequest, handler, errorHandler);
    }

    /* Get Contest Tasks Request */
    private getContestTasksApi(contestRequest: Model.ContestRequest) {
        return this._client.get<Array<Model.TaskResponse>>(`/task/by_contest/${contestRequest.id}`,  this.authHeader());
    }

    public getContestTasks(
        contestRequest: Model.ContestRequest,
        handler: (response: Array<Model.TaskResponse>) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.getContestTasksApi.bind(this), contestRequest, handler, errorHandler);
    }

    /* Get Task Request */
    private getTaskApi(taskRequest: Model.TaskRequest) {
        return this._client.get<Model.TaskResponse>(`/task/by_contest/${taskRequest.contestId}`,  this.authHeader());
    }

    public getTask(
        taskRequest: Model.TaskRequest,
        handler: (response: Model.TaskResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.getTaskApi.bind(this), taskRequest, (response: Array<Model.TaskResponse>) => {
            const task = response.find(task => task.id === taskRequest.id);

            if (task !== undefined) {
                return handler(task);
            }
            else {
                return undefined;
            }
        }, errorHandler);
    }

    /* Get Task Request */
    private getSolutionApi(taskRequest: Model.TaskRequest) {
        return this._client.get<Model.SolutionResponse>(`/solution/by_contest/${taskRequest.contestId}`,  this.authHeader());
    }

    public getSolution(
        taskRequest: Model.TaskRequest,
        handler: (response: Model.SolutionResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.getSolutionApi.bind(this), taskRequest, (response: Array<Model.SolutionResponse>) => {
            const task = response.find(task => task.taskId === taskRequest.id);

            if (task !== undefined) {
                return handler(task);
            }
            else {
                return undefined;
            }
        }, errorHandler);
    }

    /* Create Task Request */
    private addSolutionApi(taskRequest: Model.SolutionRequest) {
        return this._client.post<Model.SolutionResponse>(`/solution/add/${taskRequest.taskId}`, { text: taskRequest.text },  this.authHeader());
    }

    public postAddSolution(
        taskRequest: Model.SolutionRequest,
        handler: (response: Model.SolutionResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.addSolutionApi.bind(this), taskRequest, handler, errorHandler);
    }

    /* Participation Request */
    private postParticipationApi(participation: Model.ParticipationRequest) {
        return this._client.get<Model.ParticipationResponse>(`/participation/by_contest/add/${participation.contest_secret}`,  this.authHeader());
    }

    public postParticipation(
        participation: Model.ParticipationRequest,
        handler: (response: Model.ParticipationResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.postParticipationApi.bind(this), participation, handler, errorHandler);
    }

    /* Get Contest Commision Request */
    private getCommissionApi(contestRequest: Model.ContestRequest) {
        return this._client.get<Array<Model.CommissionResponse>>(`/commission/by_contest/${contestRequest.id}`,  this.authHeader());
    }

    public getCommission(
        contestRequest: Model.ContestRequest,
        handler: (response: Array<Model.CommissionResponse>) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.getCommissionApi.bind(this), contestRequest, handler, errorHandler);
    }

    /* Post Contest Commision Request */
    private postCommissionApi(commissionRequest: Model.CommissionRequest) {
        return this._client.get<Model.CommissionResponse>(`/commission/by_contest/add/${commissionRequest.contestId}/${commissionRequest.userId}`,  this.authHeader());
    }

    public postCommission(
        commissionRequest: Model.CommissionRequest,
        handler: (response: Model.CommissionResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.postCommissionApi.bind(this), commissionRequest, handler, errorHandler);
    }
}

export const WebAppClient = new WebAppApi();