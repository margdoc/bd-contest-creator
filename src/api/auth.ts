const key = "auth-token";

export const setAuthToken = (token: string) => {
    console.log(token);
    window.localStorage.setItem(key, token);
}

export const getAuthToken = (): string | null => {
    return window.localStorage.getItem(key);
}

export const removeAuthToken = () => {
    window.localStorage.removeItem(key);
}