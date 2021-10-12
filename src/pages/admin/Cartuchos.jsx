import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { nanoid } from 'nanoid';
/*import { Dialog, Tooltip } from '@material-ui/core';*/
/*import { obtenerCartuchos } from 'utils/api';*/

const Cartuchos = () => {
  const [mostrarTabla, setMostrarTabla] = useState(true);
  const [cartuchos, setCartuchos] = useState([]);
  const [textoBoton, setTextoBoton] = useState('Crear Nuevo Cartucho');
  const [colorBoton, setColorBoton] = useState('indigo');
  const [ejecutarConsulta, setEjecutarConsulta] = useState(true);
      
  useEffect(() => {
    console.log('consulta', ejecutarConsulta);
    if (ejecutarConsulta) {
      obtenerCartuchos(setCartuchos, setEjecutarConsulta);
    }
  }, [ejecutarConsulta]);

  useEffect(() => {
    //obtener lista de cartuchos desde el backend
    if (mostrarTabla) {
      setEjecutarConsulta(true);
    }
  }, [mostrarTabla]);

  useEffect(() => {
    if (mostrarTabla) {
      setTextoBoton('Crear Nuevo Cartucho');
      setColorBoton('indigo');
    } else {
      setTextoBoton('Mostrar Todos los Cartuchos');
      setColorBoton('red');
    }
  }, [mostrarTabla]);

  return (
    <div className='flex h-full w-full flex-col items-center justify-start p-8'>
      <div className='flex flex-col w-full'>
        <h2 className='text-3xl font-extrabold text-gray-900'>
          Página de administración de cartuchos
        </h2>
        <button
          onClick={() => {
            setMostrarTabla(!mostrarTabla);
          }}
          className={`text-white bg-${colorBoton}-500 p-5 rounded-full m-6 w-28 self-end`}/*string literals*/
        >
          {textoBoton}
        </button>
      </div>
      {mostrarTabla ? (
        <TablaCartuchos listaCartuchos={cartuchos} setEjecutarConsulta={setEjecutarConsulta} />
        ) : (
          <FormularioCreacionCartuchos
            setMostrarTabla={setMostrarTabla}
            listaCartuchos={cartuchos}
            setCartuchos={setCartuchos}
          />
        )}
        <ToastContainer position='bottom-center' autoClose={5000} />
      </div>
    );
  };
  
const TablaCartuchos = ({ listaCartuchos, setEjecutarConsulta }) => {
    const [busqueda, setBusqueda] = useState('');
    const [cartuchosFiltrados, setCartuchosFiltrados] = useState(listaCartuchos);
  
    useEffect(() => {
      setCartuchosFiltrados(
        listaCartuchos.filter((elemento) => {
          return JSON.stringify(elemento).toLowerCase().includes(busqueda.toLowerCase());
        })
      );
    }, [busqueda, listaCartuchos]);

    return (
      <div className='flex flex-col items-center justify-center w-full'>
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder='Buscar'
          className='border-2 border-gray-700 px-3 py-1 self-start rounded-md focus:outline-none focus:border-indigo-500'
        />
        <h2 className='text-2xl font-extrabold text-gray-800'>Todos los cartuchos</h2>
        <div className='hidden md:flex w-full'>
          <table className='tabla'>
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre del cartucho</th>
                <th>Marca del cartucho</th>
                <th>Tinta del cartucho</th>
                <th>Modelo </th>
              </tr>
            </thead>
            <tbody>
              {cartuchosFiltrados.map((cartuchos) => {
                
                return (
                  <FilaCartuchos
                    key={nanoid()}
                    cartuchos={cartuchos}
                    setEjecutarConsulta={setEjecutarConsulta}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        <div className='flex flex-col w-full m-2 md:hidden'>
          {cartuchosFiltrados.map((el) => {
            
            return (
              <div className='bg-gray-400 m-2 shadow-xl flex flex-col p-2 rounded-xl'>
                <span>{el.name}</span>
                <span>{el.brand}</span>
                <span>{el.tinta}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const FilaCartuchos = ({ cartuchos, setEjecutarConsulta }) => {
    const [edit, setEdit] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [infoNuevoCartuchos, setInfoNuevoCartuchos] = useState({
      _id: cartuchos._id,
      name: cartuchos.name,
      brand: cartuchos.brand,
      color: cartuchos.color,
    });
  
    const actualizarCartuchos = async () => {
      //enviar la info al backend
      const options = {
        method: 'PATCH',
        url: `http://localhost:5000/vehiculos/${cartuchos._id}/`,
        headers: { 'Content-Type': 'application/json' },
        data: { ...infoNuevoCartuchos },
      };
  
      await axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        toast.success('Cartucho modificado con éxito');
        setEdit(false);
        setEjecutarConsulta(true);
      })
      .catch(function (error) {
        toast.error('Error modificando el vehículo');
        console.error(error);
      });
  };  
  
  const eliminarCartuchos = async () => {
    const options = {
      method: 'DELETE',
      url: 'http://localhost:5000/cartuchos/eliminar/',
      headers: { 'Content-Type': 'application/json' },
      data: { id: cartuchos._id },
    };

    await axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        toast.success('cartucho eliminado con éxito');
        setEjecutarConsulta(true);
      })
      .catch(function (error) {
        console.error(error);
        toast.error('Error eliminando el cartucho');
      });
    setOpenDialog(false);
  };

  return (
    <tr>
      {edit ? (
        <>
          <td>{infoNuevoCartuchos._id}</td>
          <td>
            <input
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              value={infoNuevoCartuchos.name}
              onChange={(e) => setInfoNuevoCartuchos({ ...infoNuevoCartuchos, name: e.target.value })}
            />
          </td>
          <td>
            <input
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              value={infoNuevoCartuchos.brand}
              onChange={(e) =>
                setInfoNuevoCartuchos({ ...infoNuevoCartuchos, brand: e.target.value })
              }
            />
          </td>
          <td>
            <input
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              value={infoNuevoCartuchos.color}
              onChange={(e) =>
                setInfoNuevoCartuchos({ ...infoNuevoCartuchos, tinta: e.target.value })
              }
            />
          </td>
        </>
      ) : (
        <>
          <td>{cartuchos._id.slice(20)}</td>
          <td>{cartuchos.name}</td>
          <td>{cartuchos.brand}</td>
          <td>{cartuchos.tinta}</td>
        </>
      )}
      <td>
        <div className='flex w-full justify-around'>
          {edit ? (
            <>
              <Tooltip title='Confirmar Edición' arrow>
                <i
                  onClick={() => actualizarCartuchos()}
                  className='fas fa-check text-green-700 hover:text-green-500'
                />
              </Tooltip>
              <Tooltip title='Cancelar edición' arrow>
                <i
                  onClick={() => setEdit(!edit)}
                  className='fas fa-ban text-yellow-700 hover:text-yellow-500'
                />
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title='Editar Cartucho' arrow>
                <i
                  onClick={() => setEdit(!edit)}
                  className='fas fa-pencil-alt text-yellow-700 hover:text-yellow-500'
                />
              </Tooltip>
              <Tooltip title='Eliminar Cartucho' arrow>
                <i
                  onClick={() => setOpenDialog(true)}
                  className='fas fa-trash text-red-700 hover:text-red-500'
                />
              </Tooltip>
            </>
          )}
        </div>

        <Dialog open={openDialog}>
          <div className='p-8 flex flex-col'>
            <h1 className='text-gray-900 text-2xl font-bold'>
              ¿Está seguro de querer eliminar el cartucho?
            </h1>
            <div className='flex w-full items-center justify-center my-4'>
              <button
                onClick={() => eliminarCartuchos()}
                className='mx-2 px-4 py-2 bg-green-500 text-white hover:bg-green-700 rounded-md shadow-md'
              >
                Sí
              </button>
              <button
                onClick={() => setOpenDialog(false)}
                className='mx-2 px-4 py-2 bg-red-500 text-white hover:bg-red-700 rounded-md shadow-md'
              >
                No
              </button>
            </div>
          </div>
        </Dialog>
      </td>
    </tr>
  );
};

const FormularioCreacionCartuchos = ({ setMostrarTabla, listaCartuchos, setCartuchos }) => {
  const form = useRef(null);

  const submitForm = async (e) => {
    e.preventDefault();
    const fd = new FormData(form.current);

    const nuevoCartuchos = {};
    fd.forEach((value, key) => {
      nuevoCartuchos[key] = value;
    });

    const options = {
      method: 'POST',
      url: 'http://localhost:5000/cartuchos/nuevo/',
      headers: { 'Content-Type': 'application/json' },
      data: { name: nuevoCartuchos.name, brand: nuevoCartuchos.brand, tinta: nuevoCartuchos.tinta },
    };

    await axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        toast.success('Cartucho agregado con éxito');
      })
      .catch(function (error) {
        console.error(error);
        toast.error('Error creando un cartucho');
      });

    setMostrarTabla(true);
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <h2 className='text-2xl font-extrabold text-gray-800'>Crear nuevo cartucho</h2>
      <form ref={form} onSubmit={submitForm} className='flex flex-col'>
        <label className='flex flex-col' htmlFor='nombre'>
          Nombre del cartucho
          <input
            name='name'
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            type='text'
            placeholder='662'
            required
          />
        </label>
        <label className='flex flex-col' htmlFor='marca'>
          Marca del toner
          <select
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            name='brand'
            required
            defaultValue={0}
          >
            <option disabled value={0}>
              Seleccione una opción
            </option>
            <option>Hp</option>
            <option>Epson</option>
            <option>Canon</option>
            <option>Brother</option>
            <option>Lexmark</option>
          </select>
        </label>
        <label className='flex flex-col' htmlFor='tintas'>
          tinta del cartucho: Negro ó Colors
          <input
            name='tinta'
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            type='text'
            placeholder='negro'
            required
          />
        </label>

        <button
          type='submit'/*este me muestra que campo falta por completar*/
          className='col-span-2 bg-green-400 p-2 rounded-full shadow-md hover:bg-green-600 text-white'
        >
          Guardar cartuchos
        </button>
      </form>
    </div>
  );
};

export default Cartuchos;
