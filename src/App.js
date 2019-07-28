import React, { Fragment } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import 'antd/dist/antd.css';
import Home from './Components/home';
import Expenses from './Components/expenses';

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
              <Route exact path="/" component={Home} />
              <Route exact path="/expenses" component={Expenses} />
            </Switch>
          </BrowserRouter>
        </section>
      </div>
    </Fragment>
  );
}

export default App;
