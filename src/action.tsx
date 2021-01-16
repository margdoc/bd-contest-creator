interface LoginAction {
    type: "LoginAction";
    email: string;
    password: string;
}

export type Action = LoginAction;

export type Dispatcher<A extends Action = Action> = (action: A) => void;