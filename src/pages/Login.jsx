import React from 'react'
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="flex flex-col w-full justify-center items-center">
            <h2 className="m-3 text-center text-3xl font-extrabold text-gray-900">
                Inicia sesion en tu cuenta
            </h2>
            <form className="mt-8 max-w-md">
              <div>  
                <input className="appearance-none rounded-none relative block w-full px-3 py-2 border border-blue-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-s" 
                 type="email" 
                 placeholder="micorreo@correo.com" 
                 required
                />
                <input className="appearance-none rounded-none relative block w-full px-3 py-2 border border-blue-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-s"
                 type="password"
                 placeholder="contraseña" 
                 required
                />
              </div>
              <div className='flex justify-between'>
                <div>
                  <label htmlFor="recuerdame">
                  <br></br>
                    <input type="checkbox" name="recuerdame" />
                     Recuerdame
                  </label>
                </div>  
                <div>
                    <Link to="/">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
                </div>
                <div>
                    <Link to="/admin">
                  <br>
                  </br>
                      <button type="submit">Iniciar Sesion</button> {/*Este tyipe=submit es el que va a enviar información a la basa de datos*/ }
                    </Link>  
                </div>
                <div>
                <br>
                  </br>
                    ó
                </div>
                <div>
                <br></br>
                   <button>Continua con google</button> 
                </div>
            </form>
        </div>
    );
};

export default Login;
