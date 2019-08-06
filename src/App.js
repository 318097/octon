import React, { Fragment } from 'react';
import { Switch, Route, BrowserRouter, Link } from 'react-router-dom';
import './App.scss';
import 'antd/dist/antd.css';
import axios from 'axios';

import Home from './components/Home';
import Expenses from './components/Expenses';
import Todos from './components/Todos';

axios.defaults.baseURL = 'http://localhost:3001/api';
axios.defaults.headers.common['authorization'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDNlZjVmMjc0MzcxNjRlYTdhMGJhM2UiLCJpYXQiOjE1NjQ0MDcyOTB9.NMMr1avMBlYtZ6hbG1UPy-pvQ56-D1D7UboBrpVHjkM';

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <div className="app">
          <header className="app-header">
            <h2>Brainbox</h2>
          </header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/expenses">Expenses</Link>
            <Link to="/todos">Todos</Link>
          </nav>
          <section>
            <Switch>
              <Route exact path="/expenses" component={Expenses} />
              <Route exact path="/todos" component={Todos} />
              <Route exact path="/" component={Home} />
            </Switch>
          </section>
        </div>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
