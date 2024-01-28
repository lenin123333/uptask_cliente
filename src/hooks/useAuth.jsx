import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth=()=>{
    //Obtenemos acceso a todos los valores del AuthContext
    return useContext(AuthContext)
}

export default useAuth;