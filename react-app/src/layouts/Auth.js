import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import Sidebar from "../components/Sidebar/Sidebar.js";
import HeaderStats from "../components/Headers/HeaderStats.js";
import FooterAdmin from "../components/Footers/FooterAdmin.js";

// views

import Dashboard from "../views/auth/Dashboard";
import Settings from "../views/auth/Settings.js";
import Tables from "../views/auth/Tables.js";
// import AdminResponsibilities from "views/auth/AdminResponsibilities.js";
// import Maps from "../views/auth/Maps.js";

export default function Auth() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />

        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/auth/dashboard" exact component={Dashboard} />
            <Route path="/auth/actions" exact component={Settings} />
            <Route path="/auth/results" exact component={Tables} />

            {/* <Route path="/auth/admin" exact component={AdminResponsibilities} /> */}
            {/* <Route path="/auth/maps" exact component={Maps} /> */}
            <Redirect from="/auth" to="/auth/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
