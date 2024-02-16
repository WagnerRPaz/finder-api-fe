import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import Register from "./Register.jsx";
import { AuthProvider } from "./AuthContext.jsx";

const Root = () => {
  return (
    <React.StrictMode>
      <Router>
        <AuthProvider>
          <div className="container-fluid mt-3">
            <Switch>
              <Route exact path="/" component={Login} />
              <Route path="/home" component={Home} />
              <Route path="/register" component={Register} />
            </Switch>
          </div>
        </AuthProvider>
      </Router>
    </React.StrictMode>
  );
};

const rootElement = document.getElementById("root");
createRoot(rootElement).render(<Root />);

export default Root;
