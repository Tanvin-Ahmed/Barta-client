import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";

export const initializationLoginFramework = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
}


export const SignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            // if (result.credential) {
            //     const credential = result.credential;
            //     const token = credential.accessToken;
            // }
            const user = result.user;
            return user;
        }).catch((error) => {
            const errorMessage = error.message;
            return errorMessage;
        });
}


export const signOutFromGoogle = () => {
    return firebase.auth().signOut().then(() => {
        return 'logout successfully.';
    }).catch((error) => {
        return error;
    });
}