import React, { useState } from 'react';
import './App.scss';
import { BrowserRouter, useNavigate, useRoutes } from "react-router-dom";
import { Home } from './page/home';
import { Admin } from './page/admin';
import { Nav } from './components/nav/Nav';
import { Header } from './components/header/Header';
import { Detail } from './page/detail';
import { Login } from './page/login';
import { getCredentials, ICredentials } from './utils/login';
function App() {
  const [isShowModal, setShowModal] = useState(false)
  const [credentials, setCredentials] = useState(null as unknown as ICredentials)
  const App = () => {
      const routes = useRoutes([
          { path: '/login', element: <Login setHookCredentials={setCredentials}/> },
          { path: '/', element: <Home /> },
          { path: 'admin', element: <Admin /> },
          { path: 'detail', element: <Detail /> },
      ]);
      return routes;
  };
  // if((!credentials?.token ?? '' ) && !window.location.href.includes('login')) {
  //   window.location.href = '/login';
  // }
  const isLogin = window.location.href.includes('login')
  return (
    <div className="App">
      <BrowserRouter>
        <div className="appContainer">
            { !isLogin && (<Header isShowModal={isShowModal} setShowModal={setShowModal}/>)}
            <div className='main'>
                { !isLogin && (<Nav/>)}
                <App/>
            </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
