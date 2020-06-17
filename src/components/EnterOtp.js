import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
    Header,
    Form,
    Button,
    Segment,
} from "semantic-ui-react";
import Cookies from 'js-cookie';



    

class Register extends Component {
    state = {

        ethereumaddress: "",
        emailChangedOnce: false,
        
        otp: "",
        passwordChangedOnce: false,
        errorMessage: "",
        
    };

    metamaskChanged = () => {
        window.location.reload();
    };

    handleChange = (e, { name, value }) => {
        switch (name) {
            case "ethereumaddress":
                this.setState({ passwordChangedOnce: true });
                break;
            case "otp":
                this.setState({ passwordChangedOnce: true });
                break;
            default:
                break;
        }

        this.setState({ [name]: value }, function() {
            // callback because state isn't updated immediately
            if (
                this.state.ethereumaddress &&
                this.state.otp
            ) {
                this.setState({ inputsValid: true });
            } else {
                this.setState({ inputsValid: false });
            }
        });
    };

    handleSubmit = async event => {
        
        event.preventDefault();
        const axios = require('axios');
        var tokenVal=Cookies.get('token')
        //var tokenVal=JSON.stringify(Cookies.get('token'))
        axios.post(
                "http://localhost:8000/users/me/verifyOTP", 
                {
                    "otpInp": this.state.otp,
                    "ethAcctInp" : this.state.ethereumaddress
                },
                { headers: {"Authorization" : `Bearer ${tokenVal}`} }
            )
            .then((response) => {
                alert("Ethereum Account Address registered successfully!")
                this.props.history.push("/")
            }, (error) => {
            var errorObj = Object.assign({}, error);
            var errorMssg = errorObj.response.data.error;
             console.log(error);
            alert(errorMssg);
           
        });       
        
        
    };
    
 

    
    render() {
        return (
            <React.Fragment>
                {this.state.redirect ? <Redirect to="/metamask" /> : null}

                {this.state.wrongNetwork ? (
                    <Redirect to="/wrongnetwork" />
                ) : null}

               

                

                <Header as="h1">Ethereum Address Registration</Header>

                <Form onSubmit={this.handleSubmit} warning>
                    <Header as="h4" attached="top">
                        OTP Verification
                    </Header>
                    
                    <Segment attached>
                        <Form.Input
                            label="Ethereum Account Public Address"
                            placeholder="Ethereum Account Public Address"
                            name="ethereumaddress"
                            value={this.state.ethereumaddress}
                            onChange={this.handleChange}
                            fluid
                            error={
                                !this.state.ethereumaddress&& this.state.emailChangedOnce
                            }
                        />
                        <Form.Input
                            type="otp"
                            label="OTP"
                            name="otp"
                            placeholder="Enter OTP"
                            value={this.state.otp}
                            onChange={this.handleChange}
                            fluid
                            error={
                                !this.state.otp && this.state.passwordChangedOnce
                            }
                        />

                    </Segment>
                        

                    <Segment vertical>
                        <Button 
                            type="submit"
                            fluid
                            color="green"
                            disabled={!this.state.inputsValid}
                            
                        >
                            Submit
                        </Button>
                    </Segment>
                </Form>
            </React.Fragment>
        );
    }
}

export default Register;
