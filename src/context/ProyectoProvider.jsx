import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/axios";
import { useNavigate } from 'react-router-dom'
import io  from 'socket.io-client'
import useAuth from "../hooks/useAuth";
let socket
const ProyectoContext = createContext()

const ProyectosProvider = ({ children }) => {

    const [proyectos, setProyectos] = useState([])
    const [alerta, setAlerta] = useState({})
    const [proyecto, setProyecto] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [modalElminarTarea, setModalEliminarTarea] = useState(false)
    const [colaborador, setColaborador] = useState({})
    const [tarea, setTarea] = useState({})
    const navigate = useNavigate()
    const {auth} = useAuth()
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const[buscador,setBuscardor] = useState(false)

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios('/proyectos', config)
                setProyectos(data)
            } catch (error) {
                console.error(error)
            }
        }
        obtenerProyectos()
    }, [auth])

    useEffect(()=>{
        socket= io(import.meta.env.VITE_BAKCEND_URL)
        

        return() =>{
            socket.disconnect()
        }
    },[])


    const mostrarAlerta = alerta => {
        setAlerta(alerta)

    }


    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
            //Agrega el proyecto actualizado al state
            //agrega todos, pero si tiene el mismo id que el de la respuesta del servior entonces agrega el del servidor 
            //en caso contrario agrega el que tenemos en el state
            const proyectosActualizado = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizado)
            setAlerta({
                msg: "Proyecto Actualizado Correctamente",
                type: 'info'
            })
            setTimeout(() => {
                setAlerta({})
                navigate(`/proyectos/${proyecto.id}`)
            }, 3000)
        } catch (error) {
            console.error(error)
        }
    }

    const nuevoProyecto = async proyecto => {
        try {

            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos', proyecto, config)
            //agrega el nuevo agregado al state
            setProyectos([...proyectos, data])
            setAlerta({
                msg: 'Proyecto Agregado Correctamente',
                type: 'info'
            })
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000)

        } catch (error) {
            console.error(error)
        }
    }

    const submitProyecto = async proyecto => {
        if (proyecto.id) {
            await editarProyecto(proyecto)
        } else {
            await nuevoProyecto(proyecto)
        }


    }

    const obtenerProyecto = async id => {
        setCargando(true)
        setAlerta({})
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                type: 'error'
            })
            navigate('/proyectos')
            if(error.response.status === 401){
                setTimeout(() => {
                    setAlerta({})
                }, 2000)
            }
            
        } finally {
            setCargando(false)
        }
    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)
            //Para sincronizar el state es con filter
            //Le decimos al condigo trae todos los que sean diferentes a mi id
            const protectosActualizador = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(protectosActualizador)

            setAlerta({
                msg: data.msg,
                type: 'info'
            })
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 2000)


        } catch (error) {
            console.log(error)
        }
    }

    const handleModalTarea = () => {
        setAlerta({})
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/tareas', tarea, config)
            
            setAlerta({
                msg: 'Tarea Agregada',
                type: 'info'
            })
            setModalFormularioTarea(false)

            //evento de socketio
            socket.emit('nueva tarea',data)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                type: 'error'
            })
        }
    }

    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
            
            setAlerta({
                msg: 'Tarea Actualizada Correctamente',
                type: 'info'
            })
            setModalFormularioTarea(false)

            //Socket
            socket.emit('actualizar tarea', data)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                type: 'error'
            })
        }
    }


    const submitTarea = async tarea => {
        if (tarea?.id) {
            await editarTarea(tarea)
        } else {
            await crearTarea(tarea)
        }
    }

    const handleModalEditarTarea = tarea => {
        setAlerta({})
        setTarea(tarea)
        setModalFormularioTarea(true)

    }

    const handleModalEliminarTarea = tarea => {
        setAlerta({})
        setTarea(tarea)
        setModalEliminarTarea(!modalElminarTarea)
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config);
            
            setAlerta({
                msg: data.msg,
                type: 'error'
            })
             //SOKCET
            socket.emit('eliminar tarea',tarea)
            setModalEliminarTarea(false)
            setTarea({})
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                type: 'error'
            })
        }

    }

    const submitColaborador = async email => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/proyectos/colaboradores', { email }, config)
            setColaborador(data)
            setAlerta({})
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                type: 'error'
            })
        } finally {
            setCargando(false)
        }
    }

    const agregarColaborador = async email => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            setColaborador({})
            setAlerta({
                msg: data.msg,
                type: 'info'
            })

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                type: 'error'
            })
        }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }

    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config)
            const proyectoActualizado = { ...proyecto }
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(
                colaboradorState => colaboradorState._id !== colaborador._id
            )
            setProyecto(proyectoActualizado)
            setAlerta({
                msg: data.msg,
                type: 'error'
            })
            setModalEliminarColaborador(false)
            setColaborador({})


        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                type: 'error'
            })
        }
    }

    const completarTarea = async id => {
        try {
           
            const token = localStorage.getItem('token');
            if (!token) return
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)
            //socket
            socket.emit('cambiar estado',data)
            setAlerta({})
            setTarea({})


        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                type: 'error'
            })
        }
    }

    const handleBuscardor = () => {
        setBuscardor(!buscador)
    }

    //socket io
    const submitTareasProyectos = (tarea) => {
        
        const proyectoActualizado = { ...proyecto }
        console.log(proyectoActualizado.tareas)
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
        setProyecto(proyectoActualizado)
    }
    const submitTareasEliminada = tarea => {
        console.log(tarea)
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas
                .filter(tareaState => tareaState._id !== tarea._id);
            
        setProyecto(proyectoActualizado)
    }
    const submitTareasActualizar = tarea => {
        const proyectoActualizado = { ...proyecto }
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState =>
                tareaState._id === tarea._id ? tarea : tareaState)
            setProyecto(proyectoActualizado)
    }

    const submitNuevoEstado = tarea => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(
            tareaState => tareaState._id === tarea._id ? tarea : tareaState
        )
        setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () =>{
        setProyectos([])
        setProyecto({})
        setAlerta({})

        

    }
    return (
        <ProyectoContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                handleModalTarea,
                modalFormularioTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalElminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscardor,
                submitTareasProyectos,
                submitTareasEliminada,
                submitTareasActualizar,
                submitNuevoEstado,
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectoContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectoContext