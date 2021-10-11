import PublicLayout from 'layouts/PublicLayout';
import PrivateLayout from 'layouts/PrivateLayout';
import Admin from 'pages/Admin';
import Index from 'pages/Index';
import Login from 'pages/Login';
import Registro from 'pages/Registro';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'styles/styles.css';
import AuthLayout from 'layouts/AuthLayout';

function App() {
  return (
    <Router>
      <Switch>
        {/*Aca dentro colocamos una ruta por cada layout*/}
        <Route path={['/admin']}>
          <PrivateLayout>
            <Switch>
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

        <Route>
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
  );
  
}

export default App;
