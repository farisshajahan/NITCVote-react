import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
    Header,
    Form,
    Button,
    Segment,
} from "semantic-ui-react";
import Cookies from 'js-cookie';
import {GoogleLogin, GoogleLogout} from "react-google-login";
import axios from "axios";

class Register extends Component {
    state = {

        email: "",
        emailChangedOnce: false,
        accessToken: "",
        password: "",
        passwordChangedOnce: false,
        errorMessage: "",
        errorMessageDetailed:"",
        modalOpen: false,
        modalState: ""
        
    };

    metamaskChanged = () => {
        window.location.reload();
    };

    handleChange = (e, { name, value }) => {
        switch (name) {
            case "email":
                this.setState({ emailChangedOnce: true });
                break;
            case "password":
                this.setState({ passwordChangedOnce: true });
                break;
            default:
                break;
        }

        this.setState({ [name]: value }, function() {
            // callback because state isn't updated immediately
            if (
                this.state.email &&
                this.state.password
            ) {
                this.setState({ inputsValid: true });
            } else {
                this.setState({ inputsValid: false });
            }
        });
    };

    googleResponse = (response) => {
        console.log(response)
        this.setState({
            accessToken: response.tokenObj.id_token
        });
        axios.post("/api/users/login", {
            id_token: response.tokenObj.id_token
        }).then((response) => {
            var UserInfo = response.data;
            Cookies.set('token', UserInfo.token, { expires: 1 })
            Cookies.set('user', UserInfo.user, { expires: 1 })
            Cookies.set('pic', UserInfo.pic, { expires: 1 })
            window.location.replace('/')
        }).catch( (error) => {
            var errorObj = Object.assign({}, error);
            var errorMssg = errorObj.response.data.error;
             console.log(error);
            alert(errorMssg);
        });
    }
    
    render() {
        return (
            <div>
                {this.state.redirect ? <Redirect to="/metamask" /> : null}

                {this.state.wrongNetwork ? (
                    <Redirect to="/wrongnetwork" />
                ) : null}

                {Cookies.get('token') ? (
                    <Redirect to="/elections" />
                ) : null}

                <Header as="h4" 
                    style={{display:"flex", alignItems:"center", justifyContent:"center", color:"#3283a8"}}
                >
                    An Online Voting System for NITC
                </Header>
                <div style={{width: "100%", height:"60vh", display:"flex", flexDirection: "column", justifyContent:"center"}}>
                    <div style={{display:"flex", alignItems:"center", justifyContent:"center", margin: "30px 0"}}>
                        <GoogleLogin
                            clientId="887688664674-jqpj4g1ap81heko2lcchg79venfitm52.apps.googleusercontent.com"
                            onSuccess={this.googleResponse}
                            theme='dark'
                            buttonText="Sign in with Google"
                            responseType='code,token'
                            hostedDomain="nitc.ac.in"
                        />
                    </div>
                    <div style={{display:"flex", alignItems:"center", justifyContent:"center", margin: "30px 0"}}>
                        <Button
                            type="button"
                            href="#/elections"
                            size="large"
                            style={{borderRadius: "10px", background: "#3283a8", color:"white"}}
                        >
                            Vote for an election
                        </Button>
                    </div>
                </div>

            </div>
        );
    }
}

export default Register;
