import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import WorkerList from "./components/WorkerList.jsx";
import Register from "./components/Register.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

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
              <Route path="/workers/:categoryName" component={WorkerList} />
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
