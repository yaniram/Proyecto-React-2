import React, { useState, useEffect } from 'react';
import AuthLayout from 'layouts/AuthLayout';
import PublicLayout from 'layouts/PublicLayout';
import PrivateLayout from 'layouts/PrivateLayout';
import Admin from 'pages/admin/IndexAdmin';
import Clientes from 'pages/admin/Clientes';
import Cartuchos from 'pages/admin/Cartuchos';
import Index from 'pages/Index';
import Login from 'pages/Login';
import Registro from 'pages/Registro';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { DarkModeContext } from 'context/darkMode';
import Test from 'pages/test';
import 'styles/styles.css';


function App() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    console.log('modo dark:', darkMode);
  }, [darkMode]);

  return (
    <div className='App'>
      <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
    <Router>
      <Switch>
        {/*Aca dentro colocamos una ruta por cada layout*/}
        <Route path={['/admin','/admin/cartuchos','/admin/clientes','/test']}>
          <PrivateLayout>
            <Switch>
              <Route path='/admin/cartuchos'>
                <Cartuchos />
              </Route>
              <Route path='/test'>
                    <Test />
                  </Route>
              <Route path='/admin/clientes'>
                <Clientes />
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
  );
  
}

export default App;
