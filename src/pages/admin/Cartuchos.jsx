import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading';
import { nanoid } from 'nanoid';
import { Dialog, Tooltip } from '@material-ui/core';
import { obtenerCartuchos, crearCartucho, editarCartucho, eliminarCartucho } from 'utils/api';
import PrivateComponent from 'components/PrivateComponent';

const Cartuchos = () => {
  const [mostrarTabla, setMostrarTabla] = useState(true);
  const [cartuchos, setCartuchos] = useState([]);
  const [textoBoton, setTextoBoton] = useState('Crear Nuevo Cartucho');
  const [colorBoton, setColorBoton] = useState('indigo');
  const [ejecutarConsulta, setEjecutarConsulta] = useState(true);
  const [loading, setLoading] = useState(false);
      
   useEffect(() => {
    const fetchCartuchos = async () => {
      setLoading(true);
      await obtenerCartuchos(
        (response) => {
          console.log('la respuesta que se recibio fue', response);
          setCartuchos(response.data);
          setEjecutarConsulta(false);
          setLoading(false);
        },
        (error) => {
          console.error('Salio un error:', error);
          setLoading(false);
        }
      );
    };
    
    
    console.log('consulta', ejecutarConsulta);
    if (ejecutarConsulta) {
      obtenerCartuchos(
        (response) => {
          console.log('la respuesta que se recibio fue', response);
          setCartuchos(response.data);
          setEjecutarConsulta(false);
        },
        (error) => {
          console.error('Salio un error:', error);
        }
      );
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
          Administración de cartuchos
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
        <TablaCartuchos
         loading={loading} 
         listaCartuchos={cartuchos}
         setEjecutarConsulta={setEjecutarConsulta}
        />
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
  
const TablaCartuchos = ({ loading, listaCartuchos, setEjecutarConsulta }) => {
    const [busqueda, setBusqueda] = useState('');
    const [cartuchosFiltrados, setCartuchosFiltrados] = useState(listaCartuchos);
  
    useEffect(() => {
      setCartuchosFiltrados(
        listaCartuchos.filter((elemento) => { /*me filtra la informacion*/
          return JSON.stringify(elemento).toLowerCase().includes(busqueda.toLowerCase()); /*esto me permite buscar en mayusculo o miniscula*/
        })
      );
    }, [busqueda, listaCartuchos]);

    return (
      <div className='flex flex-col items-center justify-center w-full'>
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder='Buscar en esta tabla'
          className='border-2 border-gray-700 px-3 py-1 self-start rounded-md focus:outline-none focus:border-indigo-500'
        />
        <h2 className='text-2xl font-extrabold text-gray-800'>Todos los cartuchos</h2>
        <div className='hidden md:flex w-full'>
          {loading ? (
            <ReactLoading type='cylon' color='#abc123' height={667} width={375} />
           ) : (
            <table className='tabla'>
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre del cartucho</th>
                <th>Marca del cartucho</th>
                <th>Ink del cartucho</th>
                <PrivateComponent roleList={['admin']}>
                  <th>Acciones </th> {/*me permite editar la tabla*/}
                  </PrivateComponent>  
              </tr>
            </thead>
            <tbody>
              {cartuchosFiltrados.map((cartucho) => {
                 return (
                  <FilaCartucho
                    key={nanoid()}
                    cartucho={cartucho}
                    setEjecutarConsulta={setEjecutarConsulta}
                  />
                );
              })}
            </tbody>
          </table>
           )}
        </div>
        <div className='flex flex-col w-full m-2 md:hidden'>
          {cartuchosFiltrados.map((el) => {
            
            return (
              <div className='bg-gray-400 m-2 shadow-xl flex flex-col p-2 rounded-xl'>
                <span>{el.name}</span>
                <span>{el.brand}</span>
                <span>{el.ink}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
const FilaCartucho = ({ cartucho, setEjecutarConsulta }) => {
    const [edit, setEdit] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [infoNuevoCartucho, setInfoNuevoCartucho] = useState({
      _id: cartucho._id,
      name: cartucho.name,
      brand: cartucho.brand,
      ink: cartucho.ink,
    });
  
const actualizarCartucho = async () => {
      //enviar la info al backend
      await editarCartucho(
        cartucho._id,
        {
          name: infoNuevoCartucho.name,
          brand: infoNuevoCartucho.brand,
          ink: infoNuevoCartucho.ink,
        },
        (response) => {
          console.log(response.data);
          toast.success('Cartucho modificado con éxito');
          setEdit(false);
          setEjecutarConsulta(true);
        },
        (error) => {
          toast.error('Error modificando el cartucho');
          console.error(error);
        }
      );
    };  
  
const deleteCartucho = async () => {
    await eliminarCartucho(
      cartucho._id,
      (response) => {
        console.log(response.data);
        toast.success('Cartucho eliminado con éxito');
        setEjecutarConsulta(true);
      },
      (error) => {
        console.error(error);
        toast.error('Error eliminando el cartucho');
      }
    );

    setOpenDialog(false);
  };  
    

  return (
    <tr>
      {edit ? (
        <>
          <td>{infoNuevoCartucho._id}</td>
          <td>
            <input
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              value={infoNuevoCartucho.name}
              onChange={(e) => setInfoNuevoCartucho({ ...infoNuevoCartucho, name: e.target.value })}
            />
          </td>
          <td>
            <input
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              value={infoNuevoCartucho.brand}
              onChange={(e) =>
                setInfoNuevoCartucho({ ...infoNuevoCartucho, brand: e.target.value })
              }
            />
          </td>
          <td>
            <input
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              value={infoNuevoCartucho.ink}
              onChange={(e) =>
                setInfoNuevoCartucho({ ...infoNuevoCartucho, ink: e.target.value })
              }
            />
          </td>
        </>
      ) : (
        <>
          <td>{cartucho._id.slice(20)}</td>
          <td>{cartucho.name}</td>
          <td>{cartucho.brand}</td>
          <td>{cartucho.ink}</td>
        </>
      )}

      <PrivateComponent roleList={['admin']}>
      <td>
        <div className='flex w-full justify-around'>
          {edit ? (
            <>
              <Tooltip title='Confirmar Edición' arrow>
                <i
                  onClick={() => actualizarCartucho()}
                  className='fas fa-check text-green-700 hover:text-green-500'
                />
              </Tooltip>
              <Tooltip title='Cancelar edición' arrow>
                <i
                  onClick={() => setEdit(!edit)}
                  className='fas fa-undo text-yellow-700 hover:text-yellow-500'
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
                onClick={() => deleteCartucho()}
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
      </PrivateComponent>
    </tr>
  );
};

const FormularioCreacionCartuchos = ({ setMostrarTabla, listaCartuchos, setCartuchos }) => {
  const form = useRef(null);

  const submitForm = async (e) => {
    e.preventDefault();
    const fd = new FormData(form.current);

    const nuevoCartucho = {};
    fd.forEach((value, key) => {
      nuevoCartucho[key] = value;
    });

    await crearCartucho(   //esta es la data
      {
        name: nuevoCartucho.name,
        brand: nuevoCartucho.brand,
        ink: nuevoCartucho.ink,
      },
      (response) => {        //función de éxito
        console.log(response.data);
        toast.success('Cartucho agregado con éxito');
      },
      (error) => {           //función de error
        console.error(error);
        toast.error('Error creando un cartucho');
      }
    );

   /* const options = {
      method: 'POST',
      url: 'http://localhost:5000/cartuchos/nuevo/',
      headers: { 'Content-Type': 'application/json' },
      data: { name: nuevoCartuchos.name, brand: nuevoCartuchos.brand, ink: nuevoCartuchos.ink},
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
      }); */

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
            placeholder='662XL'
            required
          />
        </label>
        <label className='flex flex-col' htmlFor='marca'>
          Marca del Cartucho
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
          Tipo de Tinta
          <select
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            name='ink'
            required
            defaultValue={0}
          >
            <option disabled value={0}>
              Seleccione una opción
            </option>
            <option>Negro</option>
            <option>Color</option>
            </select>
        </label>
          
        <button
          type='submit'/*este me muestra que campo falta por completar*/
          className='col-span-2 bg-green-400 p-2 rounded-full shadow-md hover:bg-green-600 text-white'
        >
          Guardar cartucho
        </button>
      </form>
    </div>
  );
};

export default Cartuchos;
