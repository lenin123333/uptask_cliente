import { Link,useNavigate } from "react-router-dom"
import Alerta from "../components/Alerta"
import { useState } from "react"
import clienteAxios from "../config/axios"
import useAuth from "../hooks/useAuth"

const Login = () => {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [alerta,setAlerta] = useState('')
  const {setAuth} = useAuth();
  const navigate= useNavigate()
  const handleSubmit = async e=>{
    e.preventDefault();

    if([email,password].includes('')){
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        type: 'error'
      })
      return
    }
    try {
      const {data} = await clienteAxios.post('/usuarios/login',{email,password})
      localStorage.setItem('token',data.token)
      setAuth(data)
      navigate('/proyectos')
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        type: 'error'
      })
    }
  }
  const { msg } = alerta
  return (
    <>
      <h1 className=" text-sky-600 font-black text-6xl capitalize">Inicia Sesión y administra
        <span className=" text-slate-700"> tus proyectos </span></h1>
        {msg && <Alerta alerta={alerta} />}
      <form onSubmit={handleSubmit} className=" bg-white my-10 shadow rounded-lg px-10 py-10">
        <div className="my-5 ">
          <label
            className=" uppercase text-gray-600 block text-xl font-bold"
            htmlFor="email">Correo</label>
          <input
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            type="email"
            name=""
            id="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="Correo de Registro" />
        </div>
        <div className="my-5 ">
          <label
            className=" uppercase text-gray-600 block text-xl font-bold"
            htmlFor="password">Contraseña</label>
          <input
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            type="password"
            name=""
            id="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="Password de Registro" />
        </div>
        <input 
        type="submit" 
        value="Iniciar sesión"
        className="  mb-5 bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
         />
      </form>
      <nav className="lg:flex lg:justify-between">
        <Link to="/registrar" className="block text-center my-5 text-slate-500 uppercase text-sm">¿No tienes una cuenta? Registrate</Link>
        <Link to="/olvide-password" className="block text-center my-5 text-slate-500 uppercase text-sm">Olvidaste tu Contraseña</Link>


      </nav>
    </>
  )
}

export default Login
