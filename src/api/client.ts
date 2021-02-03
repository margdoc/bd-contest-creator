import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { getAuthToken } from './auth';
import * as Model from './models';

import Config from '../config.json';

const localhost = Config.localhost;
const url = Config.urls.backend;

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
            "Authorization": "Bearer " + token
        };
    }

    private buildHeaders(auth: boolean, sorting?: Model.Sorting) {
        return {
            headers: {
                ...(localhost ? {} : { 'Bypass-Tunnel-Reminder': 0 }),
                ...(auth ? this.authHeader() : { }),
                ...Model.sortHeader(sorting)
            }
        }
    }

    /* Login Request */
    private loginApi(loginRequest: Model.LoginRequest) {
        return this._client.post<Model.TokenResponse>('/user/login', {
            email: loginRequest.email
        }, {
            headers: {
                ...(localhost ? {} : { 'Bypass-Tunnel-Reminder': 0 }),
                password: loginRequest.password
            }
        });
    };

    public postLogin(
        request: Model.LoginRequest, 
        handler: (response: Model.TokenResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.loginApi.bind(this), request, handler, errorHandler);
    }

    /* Register Request */
    private registerApi(request: Model.RegisterRequest) {
        return this._client.post<Model.TokenResponse>('/user/register', request, this.buildHeaders(false));
    }

    public postRegister(
        request: Model.RegisterRequest,
        handler: (response: Model.TokenResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.registerApi.bind(this), request, handler, errorHandler);
    }

    /* Me Request */
    private meApi() {
        return this._client.get<Model.MeResponse>('/user/me',  this.buildHeaders(true));
    }

    public getMe(
        handler: (response: Model.MeResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.meApi.bind(this), 0, handler, errorHandler);
    }

    /* All Users Request */
    private allUsersApi(request: Model.AllUsersRequest) {
        const endpoint = request.accessLevel 
            ? `/user/all/${request.accessLevel.toString()}`
            :  `/user/all`;
        return this._client.get<Model.AllUsersResponse>(endpoint,   {
            headers: { 
                ...this.buildHeaders(true, request.sorting).headers,
                ...(request.filter !== undefined ? { filterby: request.filter } : {})
            }
        });
    }

    public getAllUsers(
        request: Model.AllUsersRequest,
        handler: (response: Model.AllUsersResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.allUsersApi.bind(this), request, handler, errorHandler);
    }

    /* All Contests Request */
    private allContestApi(request: Model.EmptyRequest) {
        return this._client.get<Model.AllContestsResponse>('/contest/all',  this.buildHeaders(true, request.sorting));
    }

    public getAllContests(
        request: Model.EmptyRequest,
        handler: (response: Model.AllContestsResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.allContestApi.bind(this), request, handler, errorHandler);
    }

    /* All Contests Request as Admin */
    private adminContestApi(request: Model.EmptyRequest) {
        return this._client.get<Model.AllContestsResponse>('/contest/my/as_admin', this.buildHeaders(true, request.sorting));
    }

    public getAdminContests(
        request: Model.EmptyRequest,
        handler: (response: Model.AllContestsResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.adminContestApi.bind(this), request, handler, errorHandler);
    }

    /* All Contests Request as User */
    private userContestApi(request: Model.EmptyRequest) {
        return this._client.get<Model.AllContestsResponse>('/contest/my/as_user',  this.buildHeaders(true, request.sorting));
    }

    public getUserContests(
        request: Model.EmptyRequest,
        handler: (response: Model.AllContestsResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.userContestApi.bind(this), request, handler, errorHandler);
    }

    /* All Contests Request as Commission */
    private commissionContestApi(request: Model.EmptyRequest) {
        return this._client.get<Model.AllContestsResponse>('/contest/my/as_commission',  this.buildHeaders(true, request.sorting));
    }

    public getCommissionContests(
        request: Model.EmptyRequest,
        handler: (response: Model.AllContestsResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.commissionContestApi.bind(this), request, handler, errorHandler);
    }

    /* Create Contest Request */
    private createContestApi(request: Model.CreateContestRequest) {
        return this._client.post<Model.ContestResponse>('/contest/create', request,  this.buildHeaders(true));
    }

    public postCreateContest(
        request: Model.CreateContestRequest,
        handler: (response: Model.ContestResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.createContestApi.bind(this), request, handler, errorHandler);
    }

    /* Create Task Request */
    private createTaskApi(request: Model.CreateTaskRequest) {
        return this._client.post<Model.TaskResponse>(`/task/by_contest/add/${request.contest_id}`, { text: request.text, title: request.title },  this.buildHeaders(true));
    }

    public postCreateTask(
        request: Model.CreateTaskRequest,
        handler: (response: Model.TaskResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.createTaskApi.bind(this), request, handler, errorHandler);
    }

    /* Get Contest Request */
    private getContestApi(request: Model.ContestRequest) {
        return this._client.get<Model.ContestResponse>(`/contest/${request.id}`,  this.buildHeaders(true));
    }

    public getContest(
        request: Model.ContestRequest,
        handler: (response: Model.ContestResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.getContestApi.bind(this), request, handler, errorHandler);
    }

    /* Get Contest Tasks Request */
    private getContestTasksApi(request: Model.ContestRequest) {
        return this._client.get<Array<Model.TaskResponse>>(`/task/by_contest/${request.id}`, this.buildHeaders(true, request.sorting));
    }

    public getContestTasks(
        request: Model.ContestRequest,
        handler: (response: Array<Model.TaskResponse>) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.getContestTasksApi.bind(this), request, handler, errorHandler);
    }

    /* Get Contest Solutions Request */
    private getContestSolutionsApi(request: Model.ContestSolutionsRequest) {
        const url = request.filter === undefined
            ? `/solution/by_contest/${request.id}`
            : request.filter
                ? `/solution/by_contest/${request.id}/with_mark`
                : `/solution/by_contest/${request.id}/without_mark`;

        return this._client.get<Array<Model.SolutionResponse>>(url, this.buildHeaders(true, request.sorting));
    }

    public getContestSolutions(
        request: Model.ContestSolutionsRequest,
        handler: (response: Array<Model.SolutionResponse>) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.getContestSolutionsApi.bind(this), request, handler, errorHandler);
    }

    /* Get Task Request */
    private getTaskApi(request: Model.TaskRequest) {
        return this._client.get<Model.TaskResponse>(`/task/${request.id}`,  this.buildHeaders(true));
    }

    public getTask(
        request: Model.TaskRequest,
        handler: (response: Model.TaskResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.getTaskApi.bind(this), request, handler, errorHandler);
    }

    /* Get Solution by Task Request */
    private getSolutionByTaskApi(request: Model.SolutionGetRequest) {
        return this._client.get<Model.SolutionResponse>(`/solution/my/by_task/${request.id}`,  this.buildHeaders(true));
    }

    public getSolutionByTask(
        request: Model.SolutionGetRequest,
        handler: (response: Model.SolutionResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.getSolutionByTaskApi.bind(this), request, handler, errorHandler);
    }

    /* Get Solution Request */
    private getSolutionApi(request: Model.SolutionGetRequest) {
        return this._client.get<Model.SolutionResponse>(`/solution/${request.id}`,  this.buildHeaders(true));
    }

    public getSolution(
        request: Model.SolutionGetRequest,
        handler: (response: Model.SolutionResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.getSolutionApi.bind(this), request, handler, errorHandler);
    }

    /* Add Solution Request */
    private addSolutionApi(request: Model.SolutionRequest) {
        return this._client.post<Model.SolutionResponse>(`/solution/add/${request.taskId}`, { text: request.text },  this.buildHeaders(true));
    }

    public postAddSolution(
        request: Model.SolutionRequest,
        handler: (response: Model.SolutionResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.addSolutionApi.bind(this), request, handler, errorHandler);
    }

    /* Patch Solution Request */
    private patchSolutionApi(request: Model.SolutionRequest) {
        return this._client.patch<Model.SolutionResponse>(`/solution/${request.taskId}`, { text: request.text },  this.buildHeaders(true));
    }

    public patchSolution(
        request: Model.SolutionRequest,
        handler: (response: Model.SolutionResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.patchSolutionApi.bind(this), request, handler, errorHandler);
    }

    /* Add Mark Request */
    private addMarkApi(request: Model.MarkRequest) {
        return this._client.post<Model.MarkResponse>(`/mark/by_solution/${request.id}`, { value: request.value, comment: request.comment },  this.buildHeaders(true));
    }

    public postAddMark(
        request: Model.MarkRequest,
        handler: (response: Model.MarkResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.addMarkApi.bind(this), request, handler, errorHandler);
    }

    /* Patch Mark Request */
    private patchMarkApi(request: Model.MarkRequest) {
        return this._client.patch<Model.MarkResponse>(`/mark/${request.id}`, { value: request.value, comment: request.comment },  this.buildHeaders(true));
    }

    public patchMark(
        request: Model.MarkRequest,
        handler: (response: Model.MarkResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.patchMarkApi.bind(this), request, handler, errorHandler);
    }

    /* Participation Request */
    private postParticipationApi(request: Model.ParticipationRequest) {
        return this._client.get<Model.ParticipationResponse>(`/participation/by_contest/add/${request.contest_secret}`,  this.buildHeaders(true));
    }

    public postParticipation(
        request: Model.ParticipationRequest,
        handler: (response: Model.ParticipationResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.postParticipationApi.bind(this), request, handler, errorHandler);
    }

    /* Get Contest Commision Request */
    private getCommissionApi(request: Model.ContestRequest) {
        return this._client.get<Array<Model.CommissionResponse>>(`/commission/by_contest/${request.id}`,  this.buildHeaders(true));
    }

    public getCommission(
        request: Model.ContestRequest,
        handler: (response: Array<Model.CommissionResponse>) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.getCommissionApi.bind(this), request, handler, errorHandler);
    }

    /* Get Contest Participation Request */
    private getParticipationApi(request: Model.ContestRequest) {
        return this._client.get<Array<Model.CommissionResponse>>(`/participation/by_contest/${request.id}`,  this.buildHeaders(true));
    }

    public getParticipation(
        request: Model.ContestRequest,
        handler: (response: Array<Model.CommissionResponse>) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.getParticipationApi.bind(this), request, handler, errorHandler);
    }

    /* Post Contest Commision Request */
    private postCommissionApi(request: Model.CommissionRequest) {
        return this._client.get<Model.CommissionResponse>(`/commission/by_contest/add/${request.contestId}/${request.userId}`,  this.buildHeaders(true));
    }

    public postCommission(
        request: Model.CommissionRequest,
        handler: (response: Model.CommissionResponse) => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.postCommissionApi.bind(this), request, handler, errorHandler);
    }

    /* Delete Contest Request */
    private deleteContestApi(request: Model.ContestRequest) {
        return this._client.delete(`/contest/${request.id}`,  this.buildHeaders(true));
    }

    public deleteContest(
        request: Model.ContestRequest,
        handler: () => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.deleteContestApi.bind(this), request, handler, errorHandler);
    }

    /* Delete Task Request */
    private deleteTaskApi(request: Model.TaskRequest) {
        return this._client.delete(`/task/${request.id}`,  this.buildHeaders(true));
    }

    public deleteTask(
        request: Model.TaskRequest,
        handler: () => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.deleteTaskApi.bind(this), request, handler, errorHandler);
    }

    /* Delete Commission Request */
    private deleteCommissionApi(request: Model.CommissionDeleteRequest) {
        return this._client.delete(`/commission/${request.id}`,  this.buildHeaders(true));
    }

    public deleteCommission(
        request: Model.CommissionDeleteRequest,
        handler: () => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.deleteCommissionApi.bind(this), request, handler, errorHandler);
    }

    /* Delete Participation Request */
    private deleteParticipationApi(request: Model.ParticipationDeleteRequest) {
        return this._client.delete(`/participation/${request.id}`,  this.buildHeaders(true));
    }

    public deleteParticipation(
        request: Model.ParticipationDeleteRequest,
        handler: () => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.deleteParticipationApi.bind(this), request, handler, errorHandler);
    }

    /* Block or Unblock User Request */
    private blockUserApi(request: Model.BlockRequest) {
        return this._client.put(`/user/disable_or_enable/${request.userId}`, {},  {
            headers: { 
                ...this.buildHeaders(true).headers,
                block: request.block
            }
        });
    }

    public blockUser(
        request: Model.BlockRequest,
        handler: () => void,
        errorHandler?: (error: AxiosError) => void
    ) {
        this.request(this.blockUserApi.bind(this), request, handler, errorHandler);
    }
}

export const WebAppClient = new WebAppApi();