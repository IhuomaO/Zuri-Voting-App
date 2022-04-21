import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { IndigoVotingProvider } from "context/IndigoVotingContext";

ReactDOM.render(
  <IndigoVotingProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </IndigoVotingProvider>,
  document.getElementById("root")
);
