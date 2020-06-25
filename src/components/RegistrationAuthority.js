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

class RegistrationAuthority extends Component {
    state = {
        //ethereumaddress: "",
        //addressChangedOnce: false,
        selectedFile: null,
        modalOpen: false,
        modalState: "",
        errorMessage:"",
        errorMessageDetailed:"",
        
    };


    metamaskChanged = () => {
        window.location.reload();
    };

    handleChange = (e, { name}) => {
        switch (name) {
            //case "ethereumaddress":
                //this.setState({ addressChangedOnce: true });
                //break;
            case "fileupload":
                this.setState({ selectedFile: e.target.files[0] }); 
                this.setState({ fileChangedOnce: true });
                break;
            default:
                break;
        }

        this.setState({ }, function() {
            // callback because state isn't updated immediately
            if (this.state.selectedFile) {
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

        const formData = new FormData(); 
     
      // Update the formData object 
      formData.append('file', this.state.selectedFile)
      formData.append('filename', this.state.selectedFile.name);
      formData.append('electionId', this.props.match.params.address);
      
      /*formData.append(
        "file", 
        this.state.selectedFile, 
        this.state.selectedFile.name 
      ); */
     
      // Details of the uploaded file 
      //console.log(this.state.selectedFile); 
      try
      {
      axios.post("http://localhost:8000/users/me/registerusers",formData,
                { headers: {
                    'Content-Type': 'multipart/form-data',
                "Authorization" : `Bearer ${tokenVal}`} }
                  
               
                ).then((response) => {
                    console.log(response)
                    this.setState({ modalState: "success" });
                    this.props.history.push("/")
                    
                }).catch( (error) => {
                //var errorObj = Object.assign({}, error);
                //var errorMssg = errorObj.response.data.error;
                 console.log(error);
                //alert(errorMssg);  
                this.setState({ modalOpen: true, modalState: "error", errorMessage: "We encountered an error. Please try again." ,errorMessageDetailed: error.message}); 
                
                });
     }
     catch(err) {
            this.setState({ modalOpen: true, modalState: "error", errorMessage: "We encountered an error. Please try again." ,errorMessageDetailed: err.message}); 
    
            } 
        
        
            
        
        
    };

    handleModalClose = () => {
        this.setState({ modalOpen: false });
    };

    fileData = () => { 
     
      if (this.state.selectedFile) { 
          
        return ( 
          <div> 
            <h4>File Details:</h4> 
            <p>File Name: {this.state.selectedFile.name}</p> 
            <p>File Type: {this.state.selectedFile.type}</p> 
            <p> 
              Last Modified:{" "} 
              {this.state.selectedFile.lastModifiedDate.toDateString()} 
            </p> 
          </div> ); 
      }
    
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
                    successMessage="Registered uccessfully!"
                />

                <Header as="h1">Voters List Registration</Header>

                <Form onSubmit={this.handleSubmit} warning>
                    <Header as="h5" attached="top">
                        Upload the voters list as a csv file
                    </Header>
                    
                    <Segment attached>
                        
                        <Form.Input type="file"  name="fileupload" onChange={this.handleChange} /> 
                
                        {this.fileData()}
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

export default RegistrationAuthority;
