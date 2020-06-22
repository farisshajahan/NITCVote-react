import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
    Header,
    Form,
    Button,
    Segment,
} from "semantic-ui-react";
import Cookies from 'js-cookie';
import ProcessingModal from "./ProcessingModal";


    

class Register extends Component {
    state = {

        email: "",
        emailChangedOnce: false,
        
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

    handleSubmit = async event => {
        
        event.preventDefault();
        //this.setState({ modalOpen: true, modalState: "processing" });
        
        try
        {
            const axios = require('axios');

            axios.post('/api/users/login', {

              email: this.state.email,
              password: this.state.password
            })
            .then((response) => {
                var UserInfo = response.data;
                Cookies.set('token', UserInfo.token, { expires: 1 })
                Cookies.set('user', UserInfo.user, { expires: 1 })
                this.setState({ modalState: "success" });
                window.location.replace('/')
                
            }).catch( (error) => {
                var errorObj = Object.assign({}, error);
                var errorMssg = errorObj.response.data.error;
                 console.log(error);
                //alert(errorMssg);  
                this.setState({ modalOpen: true, modalState: "error", errorMessage: errorMssg, errorMessageDetailed: "We encountered an error. Please try again." });  
            });
        }
        catch (err) {
            this.setState({ modalOpen: true, modalState: "error", errorMessage: "We encountered an error. Please try again." ,errorMessageDetailed: err.message}); 
    
        }   
};

  handleModalClose = () => {
        this.setState({ modalOpen: false });
    };
 

    
    render() {
        return (
            <React.Fragment>
                {this.state.redirect ? <Redirect to="/metamask" /> : null}

                {this.state.wrongNetwork ? (
                    <Redirect to="/wrongnetwork" />
                ) : null}

                {Cookies.get('token') ? (
                    <Redirect to="/" />
                ) : null}

                <ProcessingModal
                    modalOpen={this.state.modalOpen}
                    modalState={this.state.modalState}
                    handleModalClose={this.handleModalClose}
                    errorMessageDetailed={this.state.errorMessageDetailed}
                    processingMessage="This usually takes around 30 seconds. Please stay with us."
                    errorMessage={this.state.errorMessage}
                    successMessage="Logged in Successfully!"
                />

                <Header as="h1">Login</Header>

                <Form onSubmit={this.handleSubmit} warning>
                    
                    <Segment attached>
                        <Form.Input
                            label="Email"
                            placeholder="Email"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            fluid
                            error={
                                !this.state.email&& this.state.emailChangedOnce
                            }
                        />
                        <Form.Input
                            type="password"
                            label="Password"
                            name="password"
                            placeholder="Enter Password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            fluid
                            error={
                                !this.state.password && this.state.passwordChangedOnce
                            }
                        />

                    </Segment>
                        

                    <Segment vertical>
                        <Button 
                            type="submit"
                            fluid
                            loading={this.state.modalState === "processing"}
                            color="green"
                            disabled={!this.state.inputsValid}
                            
                        >
                            Login
                        </Button>
                    </Segment>
                </Form>
            </React.Fragment>
        );
    }
}

export default Register;
