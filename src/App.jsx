import React, { useState, useEffect } from 'react';
import PrivateLayout from 'layouts/PrivateLayout';
import PublicLayout from 'layouts/PublicLayout';
import Index from 'pages/Index';
import Admin from 'pages/admin/IndexAdmin';
import Cartuchos from 'pages/admin/Cartuchos';
import Login from 'pages/Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'styles/styles.css';
import Registro from 'pages/Registro';
import AuthLayout from 'layouts/AuthLayout';
import { DarkModeContext } from 'context/darkMode';
import Ventas from 'pages/admin/Ventas';
import { Auth0Provider } from "@auth0/auth0-react";
//import Clientes from 'pages/admin/Clientes';
import Usuarios from 'pages/admin/Usuarios';


function App() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    console.log('modo dark:', darkMode);
  }, [darkMode]);

  return (
    <Auth0Provider
      domain="misiontic-todoink.us.auth0.com"
      clientId="1SAF13lQMIKVXQIQ263Mw5WxlXeTLqJ1"
      redirectUri="http://localhost:3000/admin"
      audience= 'api-autenticacion-todoink-cartuchos'
      >
    <div className='App'>
      <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
    <Router>
      <Switch>
        {/*Aca dentro colocamos una ruta por cada layout*/}
        <Route path={['/admin','/admin/cartuchos','/admin/usuarios','/admin/ventas']}>
          <PrivateLayout>
            <Switch>
              <Route path='/admin/cartuchos'>
                <Cartuchos />
              </Route>
              <Route path='/admin/ventas'>
                    <Ventas />
                  </Route>
  
              <Route path='/admin/usuarios'>
                <Usuarios />
              </Route>
              <Route path='/admin'>
                <Admin />
              </Route>
            </Switch>
          </PrivateLayout>
        </Route>

        <Route path={['/login', '/registro']}>
          <AuthLayout>
          <Switch>
              <Route path='/login'>
                <Login />
              </Route>
              <Route path='/registro'>
                <Registro />
              </Route>
            </Switch>
          </AuthLayout>
        </Route>

        <Route path={['/']}>
          <PublicLayout>
          <Switch>
              <Route path='/index'>
                <Index />
              </Route>
            </Switch>
          </PublicLayout>
        </Route>


      </Switch>
      
    </Router>
    </DarkModeContext.Provider>
    </div>
    </Auth0Provider>
  );
  
}

export default App;
