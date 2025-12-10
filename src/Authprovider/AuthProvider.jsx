import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase.init";
import { GoogleAuthProvider } from "firebase/auth";


const googleProvider = new GoogleAuthProvider();

const AuthProvider =({children})=>{

    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    const createUser = (email,password)=>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth,email,password);
    }

    const  signInWithGoogle =()=>{
        setLoading(true);
        return signInWithPopup(auth,googleProvider);
    }

    const signInUser = (email,password)=>{
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

    const signOutUser = () =>{
        setLoading(true);
        return signOut(auth);
    }

    const updateUser = (updatedData)=>{
        return updateProfile(auth.currentUser,updatedData);
        
    };

    useEffect(()=>{

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log('current user  in auth state change', currentUser)
            setUser(currentUser);
            setLoading(false);
        })
        // clear the observer on unmount
        return () => {
            unsubscribe();
        }

        
    },[])


    const authInfo ={
        user,
        loading,
        createUser,
        signInUser,
        signOutUser,
        signInWithGoogle,
        updateUser,
    };

    return(
    <AuthContext value={authInfo}>
        {children}
    </AuthContext>
    );

};

export default AuthProvider;