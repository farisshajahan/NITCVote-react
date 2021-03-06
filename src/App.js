import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import Elections from "./components/Elections";
import Metamask from "./components/Metamask";
import MetamaskWrongNetwork from "./components/MetamaskWrongNetwork";
import Register from "./components/Register";
import About from "./components/About";
import Error from "./components/Error";
import Header from "./components/Header";
import { Container } from "semantic-ui-react";
import ViewElection from "./components/ViewElection";
import CreateNewElection from "./components/CreateNewElection";
import RegistrationAuthority from "./components/RegistrationAuthority";
import Logout from "./components/Logout";
import EnterOtp from "./components/EnterOtp";
import Cookies from "js-cookie";

class App extends Component {
    render() {
        return (
            <HashRouter>
                <Container style={{ margin: "1em" }}>
                { (<Header login={Cookies.get('user')} />) }
                    <link
                        rel="stylesheet"
                        href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
                    />

                    <Switch>
                        <Route path="/" exact component={Register} />
                        <Route path="/metamask" component={Metamask} />
                        <Route
                            path="/wrongnetwork"
                            component={MetamaskWrongNetwork}
                        />
                        <Route path="/login" component={Register} />
                        <Route path="/elections" component={Elections} />
                        <Route
                            path="/registrationauthority/:address"
                            component={RegistrationAuthority}
                        />
                        <Route path="/about" component={About} />
                        <Route
                            path="/election/:address"
                            component={ViewElection}
                        />
                        <Route path="/new" component={CreateNewElection} />
                        <Route path="/verify/:address" component={EnterOtp} />
                        <Route path="/logout" render={Logout} />
                        <Route component={Error} />
                    </Switch>
                </Container>
            </HashRouter>
        );
    }
}

export default App;
