import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import Landing from "views/Landing";

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          {/* add routes without layouts */}
          <Route path="/" exact component={Landing} />
          {/* <Route path="/profile" exact component={Profile} /> */}

          {/* add redirect for first page */}
          <Redirect from="*" to="/" />
        </Switch>
      </BrowserRouter>
      ,
    </>
  );
}

export default App;
