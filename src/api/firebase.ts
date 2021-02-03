import firebase from 'firebase/app';
import 'firebase/auth';

import FirebaseConfig from './firebase.config.json';
import { setAuthToken } from './auth';

if (firebase.apps.length === 0) {
    firebase.initializeApp(FirebaseConfig);
}

export const GoogleProvider = new firebase.auth.GoogleAuthProvider();

export const signInWithPopup = (
    provider: firebase.auth.AuthProvider, 
    handler: (user: firebase.User | null) => void,
    errorHandler?: (error: firebase.auth.Error) => void
) => 
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            handler(user);
        })
        .catch(errorHandler)
;

export interface FirebaseLogin {
    email: string;
    password: string;
};
    
export const login = (
    loginInfo: FirebaseLogin,
    handler: (user: firebase.User | null) => void,
    errorHandler?: (error: firebase.auth.Error) => void
) =>
    firebase.auth()
        .signInWithEmailAndPassword(loginInfo.email, loginInfo.password)
        .then((userCredential) => {
            const user = userCredential.user;
            handler(user);
        })
        .catch(errorHandler)
;

export interface FirebaseRegister {
    email: string;
    displayName: string;
    password: string;
};
    
export const register = (
    registerInfo: FirebaseRegister,
    handler: (user: firebase.User | null) => void,
    errorHandler?: (error: firebase.auth.Error) => void
) =>
    firebase.auth()
        .createUserWithEmailAndPassword(registerInfo.email, registerInfo.password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            await user?.updateProfile({ displayName: registerInfo.displayName });
            await user?.reload();
            handler(user);
        })
        .catch(errorHandler)
;

export const refreshToken = () => 
    firebase.auth().currentUser?.getIdToken(true)
        .then(setAuthToken)
;

//export refreshToken = () => firebase.auth