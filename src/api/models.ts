export interface Sorting {
    by: string;
    how: 'DESC' | 'ASC';
};

export const sortHeader = (sorting?: Sorting) => sorting 
    ? {
        'orderby': `${sorting.by} ${sorting.how}`,
    }
    : { }
;

export interface EmptyRequest {
    sorting?: Sorting;
}

export interface DisplayUser {
    displayName: string;
}

export interface LoginRequest {
    email: string;
    password: string;
};

export interface TokenResponse {
    token: string;
};

export interface User {
    id: string;
    displayName: string;
    email: string;
    accessLevel: number;
    photoURL: string | null;
    disabled: boolean;
};

export interface MeResponse {
    id: string;
    firebaseUID: string;
    displayName: string;
    email: string;
    accessLevel: number;
    photoURL: string | null;
    disabled: boolean;
};

export interface RegisterRequest {
    displayName: string;
    email: string;
    password: string;
};

export interface AllUsersRequest {
    sorting?: Sorting;
    filter?: boolean;
    accessLevel?: 1 | 2 | 3;
}

export type AllUsersResponse = Array<MeResponse>;

export interface ContestResponse {
    id: string;
    title: string;
    createdAt: string;
    startDate: string;
    endDate: string;
    userId: number;
    secret: string;
    user: DisplayUser;
};

export interface CreateContestRequest {
    title: string;
    startDate: string;
    endDate: string;
}

export type AllContestsResponse = Array<ContestResponse>;

export interface ContestRequest {
    id: number;
    sorting?: Sorting;
}

export interface ParticipationRequest {
    contest_secret: string;
}

export interface ParticipationResponse {
    id: number;
    contestId: number;
    userId: number;
    user: DisplayUser;
}

export interface CreateTaskRequest {
    contest_id: number;
    text: string;
    title: string;
}

export interface TaskResponse {
    id: number
    contestId: number;
    title: string;
    text: string;
}

export interface SolutionRequest {
    taskId: number;
    text: string;
}

export interface SolutionResponse {
    id: number
    taskId: number;
    userId: number;
    text: string;
    mark: MarkResponse;
}

export interface MarkResponse {
    id: number
    solutionId: number;
    userId: number;
    comment: string;
    value: number;
    user: DisplayUser;
}

export interface TaskRequest {
    id: number;
}

export interface CommissionRequest {
    contestId: number;
    userId: number;
}

export interface CommissionResponse {
    id: number;
    contestId: number;
    userId: number;
    user: DisplayUser;
}

export interface CommissionDeleteRequest {
    id: number;
}

export interface ParticipationDeleteRequest {
    id: number;
}

 export interface ContestSolutionsRequest {
     id: number;
     sorting?: Sorting;
     filter?: boolean;
 }

export interface MarkRequest {
    id: number;
    value: number;
    comment: string;
}

export interface BlockRequest {
    block: boolean;
    userId: number;
}

export interface SolutionGetRequest {
    id: number;
}