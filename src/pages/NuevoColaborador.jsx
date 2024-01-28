import { useEffect } from "react"
import FormularioColaborador from "../components/FormularioColaborador"
import useProyectos from "../hooks/useProyectos"
import { useParams } from "react-router-dom"
import Spiner from "../components/Spiner"



const NuevoColaborador = () => {
    const {obtenerProyecto,proyecto,cargando,colaborador,agregarColaborador} = useProyectos()
    const params = useParams()
    useEffect(()=>{
        obtenerProyecto(params.id)
    },[])

    if (cargando) return <Spiner />
  return (
    <>
        <h1 className=" text-4xl font-black"> Añanadir Colaborador(a) al Proyecto: {proyecto.nombre} </h1>
        <div className="flex justify-center mt-10  items-center ">
            <FormularioColaborador />
        </div>
        {cargando ? <Spiner/> : colaborador?._id && (
            <div className=" flex justify-center mt-10 ">
                <div className=" bg-white py-10 px-5 w-full md:w-1/2 raounded-lg shadow">
                    <h2 className=" text-center mb-10 text-2xl font-bold">Resultado:</h2>
                    <div className=" flex justify-between items-center">
                        <p>{colaborador.nombre}</p>
                        <button
                        onClick={()=>agregarColaborador({email:colaborador.email})}
                            type="button"
                            className=" bg-slate-500 px-5 py-2 rounded-lg uppercase text-white fotnb"
                        >Agregar al Proyecto</button>
                    </div>
                </div>
            </div>
        )}
    </>
  )
}

export default NuevoColaborador
