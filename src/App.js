import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Component
import AppNavbar from "./components/AppNavbar";
import Home from "./components/Home";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="h-100">
          <AppNavbar />
          <div className="container" id="outNavbar">
            <Switch>
              <Route exact path="/" component={Home} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
