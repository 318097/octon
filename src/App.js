import React, { Fragment } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import 'antd/dist/antd.css';
import axios from 'axios';

import Home from './Components/Home';
import Expenses from './Components/Expenses';
import Todos from './Components/Todos';

axios.defaults.baseURL = 'http://localhost:3001/api';
axios.defaults.headers.common['authorization'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDNlZjVmMjc0MzcxNjRlYTdhMGJhM2UiLCJpYXQiOjE1NjQ0MDcyOTB9.NMMr1avMBlYtZ6hbG1UPy-pvQ56-D1D7UboBrpVHjkM';

function App() {
  return (
    <Fragment>
      <div className="App">
        <header className="App-header">
          Brainbox
      </header>
        <section>
          <BrowserRouter>
            <Switch>
              <Route exact path="/expenses" component={Expenses} />
              <Route exact path="/todos" component={Todos} />
              <Route exact path="/" component={Home} />
            </Switch>
          </BrowserRouter>
        </section>
      </div>
    </Fragment>
  );
}

export default App;
