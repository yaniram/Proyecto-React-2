import { nanoid } from 'nanoid';
import React, { useState, useEffect, useRef } from 'react';
import { crearVenta } from 'utils/api';
import { obtenerCartuchos } from 'utils/api';
import { obtenerUsuarios } from 'utils/api';

const Ventas = () => {
  const form = useRef(null);
  const [vendedores, setVendedores] = useState([]);
  const [cartuchos, setCartuchos] = useState([]);
  const [cartuchosTabla, setCartuchosTabla] = useState([]);

  useEffect(() => {
    const fetchVendores = async () => {
      await obtenerUsuarios(
        (response) => {
          console.log('respuesta de usuarios', response);
          setVendedores(response.data);
        },
        (error) => {
          console.error(error);
        }
      );
    };
    const fetchCartuchos = async () => {
      await obtenerCartuchos(
        (response) => {
          setCartuchos(response.data);
        },
        (error) => {
          console.error(error);
        }
      );
    };

    fetchVendores();
    fetchCartuchos();
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    const fd = new FormData(form.current);

    const formData = {};
    fd.forEach((value, key) => {
      formData[key] = value;
    });

    console.log('form data', formData);

    const listaCartuchos = Object.keys(formData)
      .map((k) => {
        if (k.includes('cartucho')) {
          return cartuchosTabla.filter((v) => v._id === formData[k])[0];
        }
        return null;
      })
      .filter((v) => v);

    console.log('lista antes de cantidad', listaCartuchos);

    Object.keys(formData).forEach((k) => {
      if (k.includes('cantidad')) {
        const indice = parseInt(k.split('_')[1]);
        listaCartuchos[indice]['cantidad'] = formData[k];
      }
    });

    console.log('lista despues de cantidad', listaCartuchos);

    const datosVenta = {
      vendedor: vendedores.filter((v) => v._id === formData.vendedor)[0],
      cantidad: formData.valor,
      cartuchos: listaCartuchos,
    };

    console.log('lista cartuchos', listaCartuchos);

    await crearVenta(
      datosVenta,
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <form ref={form} onSubmit={submitForm} className='flex flex-col h-full'>
        <h1 className='text-3xl font-extrabold text-gray-900 my-3'>Crear una nueva venta</h1>
        <label className='flex flex-col' htmlFor='vendedor'>
          <span className='text-2xl font-gray-900'>Vendedor</span>
          <select name='vendedor' className='p-2' defaultValue='' required>
            <option disabled value=''>
              Seleccione un Vendedor
            </option>
            {vendedores.map((el) => {
              return <option key={nanoid()} value={el._id}>{`${el.name} ${el.lastname}`}</option>;
            })}
          </select>
        </label>

        <TablaCartuchos
          cartuchos={cartuchos}
          setCartuchos={setCartuchos}
          setCartuchosTabla={setCartuchosTabla}
        />

        <label className='flex flex-col'>
          <span className='text-2xl font-gray-900'>Valor Total Venta</span>
          <input
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            type='number'
            name='valor'
            required
          />
        </label>
        <button
          type='submit'
          className='col-span-2 bg-green-400 p-2 rounded-full shadow-md hover:bg-green-600 text-white'
        >
          Crear Venta
        </button>
      </form>
    </div>
  );
};

const TablaCartuchos = ({ cartuchos, setCartuchos, setCartuchosTabla }) => {
  const [cartuchoAAgregar, setCartuchoAAgregar] = useState({});
  const [filasTabla, setFilasTabla] = useState([]);

  useEffect(() => {
    console.log(cartuchoAAgregar);
  }, [cartuchoAAgregar]);

  useEffect(() => {
    console.log('filasTabla', filasTabla);
    setCartuchosTabla(filasTabla);
  }, [filasTabla, setCartuchosTabla]);

  const agregarNuevoCartucho = () => {
    setFilasTabla([...filasTabla, cartuchoAAgregar]);
    setCartuchos(cartuchos.filter((v) => v._id !== cartuchoAAgregar._id));
    setCartuchoAAgregar({});
  };

  const eliminarCartucho = (cartuchoAEliminar) => {
    setFilasTabla(filasTabla.filter((v) => v._id !== cartuchoAEliminar._id));
    setCartuchos([...cartuchos, cartuchoAEliminar]);
  };

  return (
    <div>
      <div className='flex '>
        <label className='flex flex-col' htmlFor='cartucho'>
          <select
            className='p-2'
            value={cartuchoAAgregar._id ?? ''}
            onChange={(e) =>
              setCartuchoAAgregar(cartuchos.filter((v) => v._id === e.target.value)[0])
            }
          >
            <option disabled value=''>
              Seleccione un Cartucho
            </option>
            {cartuchos.map((el) => {
              return (
                <option
                  key={nanoid()}
                  value={el._id}
                >{`${el.name} ${el.brand} ${el.ink}`}</option>
              );
            })}
          </select>
        </label>
        <button
          type='button'
          onClick={() => agregarNuevoCartucho()}
          className='col-span-2 bg-green-400 p-2 rounded-full shadow-md hover:bg-green-600 text-white'
        >
          Agregar Cartucho
        </button>
      </div>
      <table className='tabla'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Ink</th>
            <th>Cantidad</th>
            <th>Eliminar</th>
            <th className='hidden'>Input</th>
          </tr>
        </thead>
        <tbody>
          {filasTabla.map((el, index) => {
            return (
              <tr key={nanoid()}>
                <td>{el._id}</td>
                <td>{el.name}</td>
                <td>{el.brand}</td>
                <td>{el.ink}</td>
                <td>
                  <label htmlFor={`valor_${index}`}>
                    <input type='number' name={`cantidad_${index}`} />
                  </label>
                </td>
                <td>
                  <i
                    onClick={() => eliminarCartucho(el)}
                    className='fas fa-minus text-red-500 cursor-pointer'
                  />
                </td>
                <input hidden defaultValue={el._id} name={`cartucho_${index}`} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Ventas;