import { BrowserRouter, Route, Switch } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import Landing from "views/Landing";
import Auth from "./layouts/Auth";
import { IndigoVotingProvider } from "context/IndigoVotingContext";
// import PrivateRoute from "routing/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <IndigoVotingProvider>
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route exact path="/" component={Landing} />
          {/* <Redirect from="*" to="/" /> */}
        </Switch>
      </IndigoVotingProvider>
    </BrowserRouter>
  );
}

export default App;
