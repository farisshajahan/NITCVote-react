import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
    Header,
    Form,
    Button,
    Segment,
} from "semantic-ui-react";
import Cookies from "js-cookie";
import axios from "axios";
import ProcessingModal from "./ProcessingModal";

class EnterOtp extends Component {
    state = {
        ethereumaddress: "",
        emailChangedOnce: false,
        otp: "",
        passwordChangedOnce: false,
        modalOpen: false,
        modalState: "",
        errorMessage:"",
        errorMessageDetailed:"",
        otpSent: false
    };

    async componentDidMount() {
        if (!Cookies.get('token')) { window.location.replace('/'); }
        axios.get("/api/users/me/sendOTP",
                        {headers: {"Authorization": "Bearer " + Cookies.get('token')}}
        ).then((response) => {
            this.setState({ otpSent: true });
        });
    }

    metamaskChanged = () => {
        window.location.reload();
    };

    handleChange = (e, { name, value }) => {
        switch (name) {
            case "ethereumaddress":
                this.setState({ addressChangedOnce: true });
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
       this.setState({ modalOpen: true, modalState: "processing" });
        
        try
        {
            const axios = require('axios');
            var tokenVal=Cookies.get('token')
            //var tokenVal=JSON.stringify(Cookies.get('token'))
            axios.post(
                    "/api/users/me/verifyOTP", 
                    {
                        "otpInp": this.state.otp,
                        "ethAcctInp" : this.state.ethereumaddress,
                        "electionId": this.props.match.params.address
                    },
                    { headers: {"Authorization" : `Bearer ${tokenVal}`} }
                )
                .then((response) => {
                    this.setState({ modalState: "success" });
                }).catch( (error) => {
                var errorObj = Object.assign({}, error);
                var errorMssg = errorObj.response.data.error;
                 console.log(error);
                //alert(errorMssg);  
                this.setState({modalState: "error", errorMessage: errorMssg, errorMessageDetailed: "We encountered an error. Please try again." });
            });
        }
        catch (err) {
            this.setState({modalState: "error", errorMessage: "We encountered an error. Please try again." ,errorMessageDetailed: err.message});
        }       
        
        
    };

    handleModalClose = () => {
        this.setState({ modalOpen: false });
	this.props.history.push('/');
    };

        
        
    
    
 

    
    render() {
        return (
            <React.Fragment>
                {this.state.redirect ? <Redirect to="/metamask" /> : null}

                {this.state.wrongNetwork ? (
                    <Redirect to="/wrongnetwork" />
                ) : null}

                <ProcessingModal
                    modalOpen={this.state.modalOpen}
                    modalState={this.state.modalState}
                    handleModalClose={this.handleModalClose}
                    errorMessageDetailed={this.state.errorMessageDetailed}
                    processingMessage="This usually takes around 30 seconds. Please stay with us."
                    errorMessage={this.state.errorMessage}
                    successMessage="Ethereum Address registered successfully!"
                />

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
                                !this.state.ethereumaddress&& this.state.addressChangedOnce
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
                            disabled={!this.state.otpSent}
                            error={
                                !this.state.otp && this.state.passwordChangedOnce
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
                            Submit
                        </Button>
                    </Segment>
                </Form>
            </React.Fragment>
        );
    }
}

export default EnterOtp;
