import { useState } from "react"
import useProyectos from "../hooks/useProyectos"
import Alerta from "./Alerta"

const FormularioColaborador = () => {

    const [email, setEmail] = useState('')
    const {mostrarAlerta,alerta,submitColaborador,} = useProyectos()

    const handleSubmit = e =>{
        e.preventDefault()

        if(email === ''){
            mostrarAlerta({
                msg: 'El Correo es Obligatorio',
                type: 'error'
            })
            return
        }

        submitColaborador(email)
    }
    
    const { msg } = alerta
    return (
        <>
             {msg && <Alerta alerta={alerta} />}
            <form
                className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg  shadow"
                onSubmit={handleSubmit}>
                <div className='mb-5'>
                    <label
                        className=' text-gray-700 uppercase font-bold text-sm'
                        htmlFor="email">Correo Colaborador</label>
                    <input type="text" id='email'
                        className=' border-2 w-full p-2 my-2 placeholder-gray-400 rounded-md'
                        placeholder='Correo del colaborador'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <input type="submit"
                    className=' bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded text-sm'
                    value={'Buscar Colaborador'}
                />
            </form>

        </>
    )
}

export default FormularioColaborador
