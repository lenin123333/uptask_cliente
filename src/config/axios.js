import  axios  from "axios";

const clienteAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BAKCEND_URL}/api`
})

export default clienteAxios;