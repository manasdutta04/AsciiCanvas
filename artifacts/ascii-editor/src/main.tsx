import { createRoot } from "react-dom/client";
import { Router, Route } from "wouter";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Router>
    <Route path="/draw" component={App} />
    <Route path="/" component={App} />
    <Route path="/:path*" component={App} />
  </Router>,
);
