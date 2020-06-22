import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
    Header,
    Form,
    Button,
    Segment,
    Icon
} from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import Election from "../ethereum/Election.json";
import regAuthority from "../ethereum/RegistrationAuthority.json"
import convertTimeStringToDate from "../utils/convertTimeStringToDate";
import addresses from "../ethereum/addresses";
import Web3 from "web3";
import ProcessingModal from "./ProcessingModal";
import axios from "axios";
import Cookies from "js-cookie";

class CreateNewElection extends Component {
    state = {
        electionFactory: undefined,
        election: undefined,
        userIsManager: true,
        title: "",
        titleChangedOnce: false,
        description: "",
        descriptionChangedOnce: false,
        startTime: "",
        startTimeChangedOnce: false,
        timeLimit: "",
        timeLimitChangedOnce: false,
        inputsValid: false,
        modalOpen: false,
        modalState: "",
        errorMessage: "",
        publicKey: "",
        publicKeyChangedOnce: false,
        keyGenerated: false,
        emails: ["", ""]
    };

    async componentDidMount() {
        await this.loadContract();
    }

    async loadContract() {
        let web3, regAuthority; 
        try {
            await window.web3.currentProvider.enable();
            web3 = new Web3(window.web3.currentProvider);
            regAuthority = this.getRegistrationAuthority(web3);

            window.web3.currentProvider.on(
                "accountsChanged",
                this.metamaskChanged
            );

            window.web3.currentProvider.autoRefreshOnNetworkChange = false;
            window.web3.currentProvider.on(
                "networkChanged",
                this.metamaskChanged
            );

            const userAddresses = await web3.eth.getAccounts();

            if (
                (await regAuthority.methods.registrationAuthority().call()) !==
                userAddresses[0]
            ) {
                this.setState({ userIsManager: false });
            }

            this.setState({
                regAuthority,
                userAddresses
            });
        } catch (err) {
            if (window.web3 === undefined) {
                // Metamask not installed
                this.setState(function(prevState, props) {
                    return { redirect: true };
                });
            } else {
                // Wrong Ethereum network
                this.setState(function(prevState, props) {
                    return { wrongNetwork: true };
                });
            }
        }
    }

    getRegistrationAuthority(web3) {
         const address = addresses.registrationAuthority;
         const abi = regAuthority.abi;
         const contract = new web3.eth.Contract(abi, address);
         return contract;
    }


    metamaskChanged = () => {
        window.location.reload();
    };

    handleChange = (e, { name, value }) => {
        switch (name) {
            case "title":
                this.setState({ titleChangedOnce: true });
                break;
            case "description":
                this.setState({ descriptionChangedOnce: true });
                break;
            case "startTime":
                this.setState({ startTimeChangedOnce: true });
                break;
            case "timeLimit":
                this.setState({ timeLimitChangedOnce: true });
                break;
            case "publicKey":
                this.setState({ publicKeyChangedOnce: true });
                break;
            default:
                break;
        }

        this.setState({ [name]: value }, function() {
            // callback because state isn't updated immediately
            if (
                this.state.title &&
                this.state.description &&
                this.state.startTime &&
                this.state.timeLimit &&
                this.state.publicKey
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

        try {
            await this.state.regAuthority.methods
                .createElection(
                    this.state.title,
                    this.state.description,
                    convertTimeStringToDate(this.state.startTime),
                    convertTimeStringToDate(this.state.timeLimit),
                    this.state.publicKey
                )
                .send({ from: this.state.userAddresses[0] });

            this.setState({ modalState: "success" });
        } catch (err) {
            this.setState({ modalState: "error", errorMessage: err.message });
        }
    };

    handleModalClose = () => {
        this.setState({ modalOpen: false });
    };

    generateKeys = () => {
        axios.post('http://localhost:8000/shamirshare', {
                emails: this.state.emails
        }, { headers: {"Authorization": "Bearer " + Cookies.get('token')}
        }).then((response) => {
            this.setState({
                publicKey: response.data,
                keyGenerated: true
            })
        })
    }

    handleEmailChange = (index) => evt => {
        this.setState({ emails: this.state.emails.map((email, idx) => {
            if (idx !== index) return email;
            else return evt.target.value;
        })})
    }

    handleRemoveEmail = (index) => () => {
        this.setState({
            emails: this.state.emails.filter((email, idx) => idx !== index)
        })
    }

    handleAddEmail = () => {
        this.setState({
            emails: [...this.state.emails, ""]
        })
    }

    render() {
        return (
            <React.Fragment>
                {this.state.redirect ? <Redirect to="/metamask" /> : null}
		
		{this.state.wrongNetwork ? (
                    <Redirect to="/wrongnetwork" />
                ) : null}

                {this.state.userIsManager ? null : <Redirect to="/" />}

                <ProcessingModal
                    modalOpen={this.state.modalOpen}
                    modalState={this.state.modalState}
                    handleModalClose={this.handleModalClose}
                    errorMessageDetailed={this.state.errorMessage}
                    processingMessage="This usually takes around 30 seconds. Please stay with us."
                    errorMessage="We encountered an error. Please try again."
                    successMessage="The contract has been created."
                />

                <Header as="h1">Create Election</Header>

                <Form onSubmit={this.handleSubmit} warning>
                    <Header as="h4" attached="top">
                        General Information
                    </Header>
                    <Segment attached>
                        <Form.Input
                            label="Title"
                            placeholder="Title"
                            name="title"
                            value={this.state.title}
                            onChange={this.handleChange}
                            fluid
                            error={
                                !this.state.title && this.state.titleChangedOnce
                            }
                        />
                        <Form.Input
                            label="Description"
                            placeholder="Description"
                            name="description"
                            value={this.state.description}
                            onChange={this.handleChange}
                            fluid
                            error={
                                !this.state.description &&
                                this.state.descriptionChangedOnce
                            }
                        />
                        <Form.Group widths={2}>
                            <DateTimeInput
                                label="Start Time"
                                name="startTime"
                                placeholder="Start Time"
                                value={this.state.startTime}
                                iconPosition="left"
                                onChange={this.handleChange}
                                dateFormat={"DD.MM.YYYY"}
                                clearable
                                closable
                                hideMobileKeyboard
                                error={
                                    !this.state.startTime &&
                                    this.state.startTimeChangedOnce
                                }
                            />
                            <DateTimeInput
                                label="Time Limit"
                                name="timeLimit"
                                placeholder="Time Limit"
                                value={this.state.timeLimit}
                                iconPosition="left"
                                onChange={this.handleChange}
                                dateFormat={"DD.MM.YYYY"}
                                clearable
                                closable
                                hideMobileKeyboard
                                error={
                                    !this.state.timeLimit &&
                                    this.state.timeLimitChangedOnce
                                }
                            />
                        </Form.Group>
                    </Segment>

                    <Header as="h4" attached="top">
                        Encryption Settings
                    </Header>
                    <Segment attached>
                        {this.state.emails.map((part, idx) => (
                            <div>
                            <div style={{ margin: "5px 0" }}>
                                <strong>Email {idx+1}</strong>
                                <Icon
                                    onClick={this.handleRemoveEmail(idx)}
                                    name="trash alternate"
                                    color="red"
                                    style={{ cursor: "pointer"}}
                                />
                            </div>
                            <Form.Input
                                value={part}
                                onChange={this.handleEmailChange(idx)}
                            />
                            </div>
                        ))}
                        <Button
                            type="button"
                            onClick={this.handleAddEmail}
                            style={{ width: "100%", margin: "10px 0" }}
                        >
                            Add Email
                        </Button>
                        <Button
                            type="button"
                            onClick={this.generateKeys}
                            color="green"
                            style={{ width: "100%", marginBottom: "10px" }}
                        >
                            Generate Keys
                        </Button>
                        <Form.TextArea
                            label="Public key"
                            name="publicKey"
                            placeholder="Enter Public key for encryption"
                            value={this.state.publicKey}
                            onChange={this.handleChange}
                            fluid
                            disabled={!this.state.keyGenerated}
                            error={
                                !this.state.publicKey && this.state.publicKeyChangedOnce
                            }
                            style={{ minHeight: 100 }}
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
                            Create
                        </Button>
                    </Segment>
                </Form>
            </React.Fragment>
        );
    }
}

export default CreateNewElection;

