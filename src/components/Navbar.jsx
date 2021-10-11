import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
    return <nav className="bg-blue-200">
        <ul className='flex w-full justify-between my-5 text-black'>
            <li>
                <button>Logo</button></li>
            <li>
                <button>Quienes Somos</button></li>
            <li>
                <button>Servicios</button></li>
            <li>
                <button>Contacto</button></li>
            
            <li className='px-3'>
                <Link to='/login'>
                  <button className='bg-indigo-500 p-2 text-white rounded-lg shadow-md hover:bg-indigo-800'>
                      Iniciar Sesion
                  </button>
                </Link>  
            </li>
        </ul>
    </nav>;
    
};
export default Navbar;
