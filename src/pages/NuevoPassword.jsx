import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/axios"


const NuevoPassword = () => {
  const[password,setPassword] = useState('')
  const [alerta, setAlerta] = useState('')
  const { token } = useParams()
  const [tokenValido, setTokenValido] = useState(false)
  const [passwordModificado,setPasswordModificado] = useState(false)
  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await clienteAxios(`/usuarios/olvide-password/${token}`)
        setTokenValido(true)
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          type: 'error'
        })
      }
    }
    comprobarToken()
  }, [])

  const handleSubmit = async e =>{
    e.preventDefault()

    if (password.length < 6) {
      setAlerta({
        msg: 'La contraseña es muy corta, agrega minimo 6 caracteres',
        type: 'error'
      })
      return
    }

    try {
      const {data}= await clienteAxios.post(`/usuarios/olvide-password/${token}`,{password})
      setAlerta({
        msg: data.msg,
        type: 'info'
      })
      setPasswordModificado(true)

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
      <h1 className=" text-sky-600 font-black text-6xl capitalize">Restablece tu contraseña y no pierdas acceso
        <span className=" text-slate-700"> tus proyectos </span></h1>
      {msg && <Alerta alerta={alerta} />}
      {tokenValido && (
        <form onSubmit={handleSubmit} className="bg-white my-10 shadow rounded-lg px-10 py-10">
          <div className="my-5 ">
            <label
              className=" uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password">Nueva Contraseña</label>
            <input
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
              type="password"
              name=""
              id="password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              placeholder="Escribe tu nueva Contraseña" />
          </div>

          <input
            type="submit"
            value="Guardar Nueva Contraseña"
            className="  mb-5 bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
        </form>
      )}

        {passwordModificado && (
           <Link to="/" className="mt-10 block text-center my-5 text-slate-500 uppercase text-lg">Inicia Sesión</Link>
        )}
    </>
  )
}

export default NuevoPassword
