import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext"
import { useNavigate } from "react-router-dom";

// export const useUserAuth = () => {
//     console.log("Entered useUserAuth");
//     const {user, loading, clearUser} = useContext(UserContext);
//     console.log(user, loading, clearUser);
//     const navigate = useNavigate();

//     useEffect(()=>{
//         console.log("Use effct triggered in useUserAuth");
//         if(loading) return;
//         if(user) return;

//         if(!user){
//             clearUser();
//             navigate('/login');
//         }
//     },[ user, loading, clearUser, navigate] )
    

// };

export const useUserAuth = () => {
    
    const navigate = useNavigate();
    const { user, loading, clearUser } = useContext(UserContext);

    useEffect(() => {

        if (loading) {
            return;
        }
        if (user) {
            return;
        }

        clearUser();
        navigate('/login');

    }, [user, loading, clearUser, navigate]);
};