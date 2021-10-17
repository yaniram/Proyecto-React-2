import React from 'react'
import TriggerDarkMode from './TriggerDarkMode';
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { loginWithRedirect } = useAuth0();
    return (

      <nav className="bg-blue-200">
        <ul className='flex w-full justify-between my-5 text-black'>
            <li>
                <button>Logo</button></li>
            <li>
                <button>Quienes Somos</button></li>
            <li>
                <button>Marcas</button></li>
            <li>
             <TriggerDarkMode />
             </li>
            <li className='px-3'>
                  <button 
                  onClick={() => loginWithRedirect()}
                  className='bg-indigo-500 p-2 text-white rounded-lg shadow-md hover:bg-indigo-700'>
                  Iniciar Sesión
               </button>
              
             </li>
        </ul>
    </nav>
  );
};

export default Navbar;