interface FetchingLocalStorage {
    type: "FetchingLocalStorage"
}

type Access = "User" | "Admin" | "ContestCreator";

interface LoggedInState {
    type: "LoggedInState";
    access: Access;
}

interface LoggedOutState {
    type: "LoggedOutState"
}

export type State = FetchingLocalStorage | LoggedInState | LoggedOutState;