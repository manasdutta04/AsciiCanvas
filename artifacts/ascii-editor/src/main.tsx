import { createRoot } from "react-dom/client";
import { Router, Route } from "wouter";
import App from "./App";
import LandingPage from "./LandingPage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Router>
    <Route path="/" component={LandingPage} />
    <Route path="/draw" component={App} />
  </Router>,
);
