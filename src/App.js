import React, {useContext, useEffect, useState} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import Appbar from "./components/Layout/Appbar/Appbar";
import Sidebar from "./components/Layout/Appbar/Sidebar";
import style from './app.module.css';
import {Store} from "./Store";
import NotFound from "./404";
import Dashboard from "./components/Dashboard/Dashboard";
import Organization from "./components/Tables/Organizations/Organization";
import Users from "./components/Tables/Users/Users";
import Type from "./components/Tables/Settings/Types/Type";
import Login from "./Authorization/Login";
import Role from "./components/Tables/Settings/Roles/Roles";
import Access from "./components/Tables/Settings/Access/Access";
import Resoluton from "./components/Tables/Settings/Resolution/Resoluton";
import ReceiveApplications from "./components/Tables/Applications/RecieveApplications/ReceiveApplications"
import DefaultMap from "./components/Tables/Map/DefaultMap";
import Products from "./components/Tables/Products/Products";
import ProductCategory from "./components/Tables/Products/Category";
import ObjectController from "./components/Tables/Objects/ControllerObject";
import ObjectTypeController from "./components/Tables/Objects/ObjectTypeController";
import Add from "./components/Tables/Applications/AddApplications/Add";
import Progressbar from "./Progressbar";
import ConfirmedApplications from "./components/Tables/Applications/Confirmed/ConfirmedApplications";
import AcceptedContratcs from "./components/Tables/Contracts/Accepted/AcceptedContracts";
import Supplier from "./components/Tables/Supplier/Supplier";
import Snackbar from "./components/UI/Snackbar/Snackbar";

function App() {
    const [open, setOpen] = useState(true);
    const {state} = useContext(Store);
    // const {i18n} = useTranslation();
    const routes = [
        {
            path: "/dashboard",
            component: Dashboard
        },
        {
            path: "/users",
            component: Users
        },
        {
            path: "/org",
            component: Organization
        },
        {
            path: "/application/new",
            component: Add
        },
        {
            path: "/application/receive",
            component: ReceiveApplications
        },
        {
            path: "/application/confirmed",
            component: ConfirmedApplications
        },
        {
            path: "/settings/type",
            component: Type
        },
        {
            path: "/settings/roles",
            component: Role
        },
        {
            path: "/settings/access",
            component: Access
        },
        {
            path: "/settings/resolution",
            component: Resoluton
        },
        {
            path: "/products",
            component: Products
        },
        {
            path: "/products/category",
            component: ProductCategory
        },
        {
            path: "/objects",
            component: ObjectController
        },
        {
            path: "/object/types",
            component: ObjectTypeController
        },
        {
            path: '/contracts/accepted',
            component: AcceptedContratcs
        },
        {
            path: "/suppliers",
            component: Supplier
        },
    ]


    return (
        <div className={[style[state.mode], state.mode === 'dark' ? style.backgLight : style.backgDark].join(' ')}
             style={{display: 'flex'}}>
            {/*<Progressbar/>*/}
            <Appbar setOpen={setOpen} open={open}/>
            <Sidebar open={open}/>
            <div className={style.content}>
                <div className={style.toolbar}/>
                <Switch>
                    <Route exact path="/" render={() => <Redirect to="/dashboard"/>}/>
                    <Route exact path="/login" render={() => <Redirect to="/dashboard"/>}/>
                    {routes.map(r =>
                        <Route exact path={r.path} component={r.component}/>
                    )}
                    <Route exact path='*' render={() => <NotFound/>}/>
                </Switch>
            </div>
            <DefaultMap/>
        </div>
    );

}

export default App;
