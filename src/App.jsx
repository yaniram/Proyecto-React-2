import React, { useState, useEffect } from 'react';
import AuthLayout from 'layouts/AuthLayout';
import PublicLayout from 'layouts/PublicLayout';
import PrivateLayout from 'layouts/PrivateLayout';
import Admin from 'pages/admin/IndexAdmin';
//import Clientes from 'pages/admin/Clientes';
import Usuarios from 'pages/admin/Usuarios';
import Cartuchos from 'pages/admin/Cartuchos';
import Ventas from 'pages/admin/Ventas';
import Index from 'pages/Index';
import Login from 'pages/Login';
import Registro from 'pages/Registro';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { DarkModeContext } from 'context/darkMode';
import 'styles/styles.css';
import { Auth0Provider } from "@auth0/auth0-react";


function App() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    console.log('modo dark:', darkMode);
  }, [darkMode]);

  return (
    <Auth0Provider
      domain="misiontic-todoink.us.auth0.com"
      clientId="1SAF13lQMIKVXQIQ263Mw5WxlXeTLqJ1"
      redirectUri={window.location.origin}
      >|
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
