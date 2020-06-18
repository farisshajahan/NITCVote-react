import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Dimmer, Loader, Image, Segment } from "semantic-ui-react";
import Web3 from "web3";
import RegistrationAuthority from "../ethereum/RegistrationAuthority.json";
import Election from "../ethereum/Election.json";
import ElectionMenu from "./electionComponents/ElectionMenu";
import ElectionCards from "./electionComponents/ElectionCards";
import addresses from "../ethereum/addresses";
import ManagerInfoMessage from "./ManagerInfoMessage.js";
import RegAuthInfoMessage from "./RegAuthInfoMessage.js";

class Elections extends Component {
    state = {
        redirect: false,
        showLoader: true,
        userIsRegisteredVoter: false,
        userIsManager: false,
        userIsRegAuthority: false,
        wrongNetwork: false,
        activeItem: "current",
        elections: []
    };

    async componentDidMount() {
        await this.loadAllRelevantData();
    }

    async loadAllRelevantData() {
        let web3, regAuthority;
        try {
            // Get Web3 and contracts
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

            // Get Elections
            const addresses = await regAuthority.methods
                .getDeployedElections()
                .call();

            const userAddresses = await web3.eth.getAccounts();

            // forEach doesn't await all instructions
            // See: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
            await Promise.all(
                addresses.map(async e => {
			console.log("Check");
                    const contract = this.getElectionContract(web3, e);
                    const contractDetails = {
                        address: await contract._address,
                        title: await contract.methods.title().call(),
                        description: await contract.methods
                            .description()
                            .call(),
                        startTime: await contract.methods.startTime().call(),
                        timeLimit: await contract.methods.endTime().call(),
                        userHasVoted: await contract.methods
                            .hasVoted(userAddresses[0])
                            .call()
                    };

                    this.setState({
                        elections: [...this.state.elections, contractDetails]
                    });
                })
            );


            // Check if user is registration authority
            const regAuthorityManager = await regAuthority.methods
                .registrationAuthority()
                .call();
            const userIsRegAuthority = regAuthorityManager === userAddresses[0];

            this.setState(function(prevState, props) {
                return {
                    showLoader: false,
                    web3,
                    regAuthority,
                    userIsRegAuthority
                };
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
                console.log(err)
            }
        }
    }

    getRegistrationAuthority(web3) {
        const address = addresses.registrationAuthority;
        const abi = RegistrationAuthority.abi;
        const contract = new web3.eth.Contract(abi, address);
        return contract;
    }

    getElectionContract(web3, address) {
        const abi = Election.abi;
        const contract = new web3.eth.Contract(abi, address);
        return contract;
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    metamaskChanged = () => {
        window.location.reload();
    };

    render() {
        return (
            <React.Fragment>
                {this.state.userIsRegAuthority && this.state.showLoader === false ? (
                    <ManagerInfoMessage />
                ) : null}

                <ElectionMenu
                    activeItem={this.state.activeItem}
                    onItemClick={this.handleItemClick}
                />

                {this.state.redirect ? <Redirect to="/metamask" /> : null}

                {this.state.showLoader ? (
                    <Segment>
                        <Dimmer active inverted>
                            <Loader>Loading</Loader>
                        </Dimmer>
                        <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
                    </Segment>
                ) : null}

                <ElectionCards
                    elections={this.state.elections}
                    activeItem={this.state.activeItem}
                    userIsRegAuthority={this.state.userIsRegAuthority}
                />
            </React.Fragment>
        );
    }
}

export default Elections;

