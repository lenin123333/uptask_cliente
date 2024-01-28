import { formatearFecha } from "../helpers/formatearFecha"
import useAdmin from "../hooks/useAdmin"
import useProyectos from "../hooks/useProyectos"



const Tarea = ({ tarea }) => {
    const {handleModalEditarTarea,handleModalEliminarTarea,completarTarea} = useProyectos()
    const { descripcion, nombre, prioridad, fechaEntrega, estado, _id } = tarea
    const admin = useAdmin()
    return (
        <div className=" border-b p-5 flex justify-between items-center ">

            <div className=" flex flex-col items-start">
                <p className="mb-1 text-xl">{nombre}</p>
                <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
                <p className="mb-1 text-sm">{formatearFecha(fechaEntrega)}</p>
                <p className="mb-1 text-gray-600">Prioridad: {prioridad}</p>
                {estado && <p className="text-xs uppercase p-1 bg-green-600 rounded-lg text-white">Completada por: {tarea.completado.nombre}</p>}
            </div>
            <div className="flex  gap-2 flex-col md:flex-row">
            {admin && (
                <button
                 onClick={()=>handleModalEditarTarea(tarea)}
                 className=" bg-indigo-600 px-4 py-3 text-white rounded-lg uppercase font-bold text-sm">Editar</button>
                 )}
                

                <button 
                    className={`${estado ? 'bg-sky-600' : 'bg-gray-600'}  px-4 py-3 text-white rounded-lg uppercase font-bold text-sm`}
                    onClick={()=>completarTarea(_id)}
                    >{estado ? 'Completa' : 'Incompleta'}</button>


                {admin && (
                <button 
                onClick={()=>handleModalEliminarTarea(tarea)}
                className=" bg-red-600 px-4 py-3 text-white rounded-lg uppercase font-bold text-sm"
                >Eliminar</button>
                )}

            </div>

        </div>
    )
}

export default Tarea
