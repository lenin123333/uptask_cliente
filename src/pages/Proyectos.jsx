
import Alerta from "../components/Alerta"
import PreviewProyectos from "../components/PreviewProyectos"
import useProyectos from "../hooks/useProyectos"


const Proyectos = () => {

  const { proyectos,alerta } = useProyectos()

  const { msg } = alerta
  return (
    <>
    {msg && <Alerta alerta={alerta} />}
      <h1 className=" text-4xl font-black">Proyectos</h1>

      <div className="bg-white shadow mt-10 rounded-lg ">
        {proyectos.length ?
          proyectos.map(proyecto => (
            <PreviewProyectos key={proyecto._id} proyecto={proyecto} />
          ))

          : <p className=" text-center text-gray-600 uppercase p-5">No hay proyectos aún</p>}
      </div>
    </>
  )
}

export default Proyectos
