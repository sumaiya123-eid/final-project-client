import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
  } from "firebase/auth";
  import { createContext, useEffect, useState } from "react";
  import { updateProfile } from "firebase/auth";
  import { auth } from "../firebase.init";
//   import useAxiosPublic from "../hooks/useAxiosPublic";
  
  export const AuthContext = createContext(null);
  export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const provider = new GoogleAuthProvider();
    // const axiosPublic=useAxiosPublic()
  
    const userRegister = (email, password) => {
      setLoading(true)
      return createUserWithEmailAndPassword(auth, email, password);
    };
  
    const userLogin = (email, password) => {
      setLoading(true)
      return signInWithEmailAndPassword(auth, email, password);
    };
  
    const googleLogin = () => {
      setLoading(true)
      return signInWithPopup(auth, provider)
         .then((result) => {
            const user = result.user;
            user.email = user.email;
            console.log(user)
            setUser(user);
            return result;
         })
         .catch((error) => {
            console.error('Google Login Error:', error.message);
         });
   };
  
   const userUpdate=(name,photo)=>{
        updateProfile(auth.currentUser,{
        displayName: name, photoURL: photo
      })
  }
  
    const userLogOut = () => {
      setLoading(true)
      return signOut(auth);
    };
  
  
//     useEffect(() => {
//       const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//         setUser(currentUser);
//         if (currentUser) {
//           // get token and store client
//           const userInfo = { email: currentUser.email };
//           axiosPublic.post('/jwt', userInfo)
//               .then(res => {
//                   if (res.data.token) {
//                       localStorage.setItem('access-token', res.data.token);
//                       setLoading(false);
//                   }
//               })
//       }
//       else {
//           // TODO: remove token (if token stored in the client side: Local storage, caching, in memory)
//           localStorage.removeItem('access-token');
//           setLoading(false);
//       }
//   });
//       return () => {
//         unsubscribe();
//       };
//     }, [axiosPublic]);

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth , currentUser=>{
            setUser(currentUser);
            setLoading(false);
        })
        return()=>{
            unsubscribe();
        }
     },[])
  
    const authInfo = {
      userRegister,
      userLogin,
      googleLogin,
      userUpdate,
      user,
      setUser,
      userLogOut,
      loading,
    };
    return (
      <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    );
  }
  