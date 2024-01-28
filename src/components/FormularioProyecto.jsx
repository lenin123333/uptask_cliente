import { useState,useEffect } from "react"
import {useParams} from 'react-router-dom'
import useProyectos from "../hooks/useProyectos"
import Alerta from "./Alerta"


const FormularioProyecto = () => {
  const [id,setId] = useState(null)
  const [nombre,setNombre] = useState('')
  const [descripcion,setDescripcion] = useState('')
  const [fechaEntrega,setFechaEntrega] = useState('')
  const [cliente,setCliente] = useState('')
  const {mostrarAlerta,alerta,submitProyecto,proyecto} =useProyectos()

  const params = useParams()
  useEffect(()=>{
    if(params.id){
      setId(params.id)
      setNombre(proyecto.nombre)
      setDescripcion(proyecto.descripcion)
      setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
      setCliente(proyecto.cliente)



    }
  },[params])
  const handleSubmit = async e=>{
    e.preventDefault()

    if([nombre, descripcion,fechaEntrega,cliente].includes('')){
        mostrarAlerta({
          msg:'Todos los campos son Obligatorios',
          type: 'error'
        })
        return
    }
   await submitProyecto({
    id,
      nombre, descripcion,fechaEntrega,cliente
    })
    setId('')
    setNombre('')
    setDescripcion('')
    setFechaEntrega('')
    setCliente('')
    

  }
  const {msg} = alerta
  console.log(msg)
  return (
    
    <form onSubmit={handleSubmit} className="bg-white py-10 px-5 md:w-1/2 rounded-lg">
     {msg && <Alerta alerta={alerta} />}
      <div className=" mb-5">
        <label htmlFor="nombre"
          className=" text-gray-700 uppercase font-bold text-sm shadow"
        >Nombre Proyecto</label>
        <input type="text" 
          className=" border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Nombre del Proyecto"
          id="nombre"
          value={nombre}
          onChange={e=>setNombre(e.target.value)}
        />
      </div>
      <div className=" mb-5">
        <label htmlFor="descripcion"
          className=" text-gray-700 uppercase font-bold text-sm shadow"
        >Descripción</label>
        <textarea 
          className=" border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Descripcion del Proyecto"
          id="descripcion"
          value={descripcion}
          onChange={e=>setDescripcion(e.target.value)}
        />
      </div>
      <div className=" mb-5">
        <label htmlFor="fecha-entrega"
          className=" text-gray-700 uppercase font-bold text-sm shadow"
        >Fecha Entrega</label>
        <input 
          type="date" 
          className=" border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          id="fecha-entrega"
          value={fechaEntrega}
          onChange={e=>setFechaEntrega(e.target.value)}
        />
      </div>
      <div className=" mb-5">
        <label htmlFor="cliente"
          className=" text-gray-700 uppercase font-bold text-sm shadow"
        >Nombre Cliente</label>
        <input type="text" 
          className=" border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Nombre del Cliente"
          id="cliente"
          value={cliente}
          onChange={e=>setCliente(e.target.value)}
        />
      </div>
      <input 
      type="submit" 
      className=" bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
      value={id ? 'Actualizar Proyecto' : 'Nuevo Proyecto'}
      />
    </form>
  )
}

export default FormularioProyecto
