import React from 'react';
import {
    Route,
    Switch,
    Redirect,
} from 'react-router-dom';
import Loadable from 'react-loadable';
import MyLoadingComponent from '../lib/loading/loading';
import Menus from '../pages/menu/menu';
import Login from '../pages/login/login';
import AnimatedRouter from '../lib/animation/AnimatedRouter';
import NoMatch from '../lib/nomatch/404';
import '../lib/animation/animate.css';
// import Pickup from '../pages/pickup/pickup';
// import Configuration from '../pages/configuration/configuration';

const Pickup = Loadable({
    loader: () => import('../pages/pickup/pickup'),
    loading: MyLoadingComponent,
    delay: 300,
});

const Orgcode = Loadable({
    loader: () => import('../pages/orgcode/orgcode'),
    loading: MyLoadingComponent,
    delay: 300,
});

const Router = () => (
    <Switch>
        <Route path="/login" component={Login}/>
        <Route
            path="/along"
            render={() => (
                <Switch>
                    <Menus>
                        <AnimatedRouter>
                            <Route path="/along/pickup" component={Pickup}/>
                            <Route path="/along/orgcode" component={Orgcode}/>
                            <Redirect to="/404"/>
                        </AnimatedRouter>
                    </Menus>
                </Switch>
            )}
        />
        <Route component={NoMatch}/>
    </Switch>
);

export default Router;
