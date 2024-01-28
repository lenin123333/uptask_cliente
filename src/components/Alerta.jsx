import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Alerta = ({ alerta }) => {

  useEffect(() => {
    // Muestra la alerta cuando el componente se monta
    toast[alerta.type](alerta.msg,{
      theme: "colored"
    });
  }, [alerta]);

  return (
    <div>
      {/* Contenedor de toast para mostrar las alertas */}
      <ToastContainer autoClose={5000} />
    </div>
  );
}

export default Alerta
