import React, {useEffect} from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import ReactLoading from 'react-loading';
import { obtenerDatosUsuario } from 'utils/api';
//import { Link } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();
    
  
    useEffect(() => {
      const fetchAuth0Token = async () => {

        // 1. React le pide el token a Auth0
        const accessToken = await getAccessTokenSilently({
            audience: `api-autenticacion-todoink-cartuchos`,
          });
        // 2. Auth0 le devuelve el token a React 
          localStorage.setItem('token', accessToken);
          console.log(accessToken);
        //3. React le evia el token al backend  
          await obtenerDatosUsuario(
            (response)=>{
             console.log("response", response);
            },
             (err)=>{
              console.log("err",err);
          });
          
        };
        if (isAuthenticated) {
          fetchAuth0Token();
        }
      }, [isAuthenticated, getAccessTokenSilently]);

          
      if (isLoading) return <ReactLoading type='cylon' color='#abc123' height={667} width={375} />;

      if (!isAuthenticated) {
        return loginWithRedirect();
      }
    
      return <>{children}</>;
}; 

 /* return isAuthenticated ? ( 
    <>{children}</>
   ): (
       <div>
        <div className= "text-2xl text-red-700">No estas autorizado para ver este sitio.</div>;
        <Link to= "/">
            <span className= "text-gray-900 font-bold">
            Llévame al home
            </span>
        </Link>
       </div>
   );   
};*/

export default PrivateRoute;
