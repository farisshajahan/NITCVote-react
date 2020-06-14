import React, { Component } from "react";
import {
    Button,
    Table,
    Form,
    Loader,
    Segment,
    Dimmer,
    Image,
    Icon,
    Header
} from "semantic-ui-react";
import ProcessingModal from "../ProcessingModal";
import crypto from "crypto";
import { join } from "shamir";

class OptionsTablePastElection extends Component {
    state = {
        modalOpen: false,
        modalState: "",
        errorMessage: "",
        statusMessage:
            "This usually takes around 60 seconds. Please stay with us.",
        electionManager: "",
        publishedResults: [],
        privateKey: "",
        privateKeyChangedOnce: false,
        inputsValid: false,
        keyParts: [{share: ""}, {share:""}]
    };

    async componentDidMount() {
        this.setState({
            publishedResults: await this.props.contract.methods
                .getResults()
                .call(),
            electionManager: await this.props.contract.methods
                .electionManager()
                .call()
        });
    }

    handleChange = (e, { name, value }) => {
        switch (name) {
            case "privateKey":
                this.setState({ privateKeyChangedOnce: true });
                break;
            default:
                break;
        }

        this.setState({ [name]: value }, function() {
            // callback because state isn't updated immediately
            if (this.state.privateKey) {
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
            const utf8Decoder = new TextDecoder();
            let parts = {};
            for (let j in this.state.keyParts) {
                let part = JSON.parse(this.state.keyParts[j]['share']);
                parts[part['id']] = Buffer.from(part['share'], 'hex');
            }
            var privateKey = utf8Decoder.decode(join(parts));

            // Get the list of addresses that voted
            const voters = await this.props.contract.methods
                .getListOfAddressesThatVoted()
                .call();

            if (voters.length === 0) {
                throw new Error("No votes found.");
            }

            let tallyForEachOption = new Array(this.props.options.length).fill(0);
            let vote;
            for (let i = 0; i < voters.length; i++) {
                this.setState({
                    statusMessage:
                        "Retrieving and tallying vote " +
                        (i + 1) +
                        " of " +
                        voters.length
                });
                
                var voteInvalid = false;
                var oneSeen = false;
                vote = JSON.parse(crypto.privateDecrypt(privateKey, Buffer.from(await this.props.contract.methods
                         .getEncryptedVoteOfVoter(voters[i])
                         .call(), 'hex'))).slice(0, this.props.options.length);
                // Validating the vote
                for (let j in vote) {
                    if (vote[j] !== 0 && vote[j] !== 1) {
                        voteInvalid = true;
                        break;
                    }
                    if (vote[j] === 1) {
                        if (oneSeen === false) {
                            oneSeen = true;
                        } else {
                            voteInvalid = true;
                            break;
                        }
                    }
                }
                if (voteInvalid) { continue; }
                // Adding to tally
                if (oneSeen) {
                    tallyForEachOption[vote.findIndex(elem => elem === 1)] += 1;
                    console.log(tallyForEachOption);
                }
            }

            const sumOfVotes = tallyForEachOption.reduce(
                (a, b) => a + b,
                0
            );


            if (sumOfVotes !== voters.length) {
                throw new Error(
                    "Number of tallied votes is not the same as the number of voters."
                );
            }

            // Convert to regular string array
            let result = new Array(this.props.options.length);
            for (let i = 0; i < tallyForEachOption.length; i++) {
                result[i] = tallyForEachOption[i].toString();
            }

            // Publish results
            this.setState({
                statusMessage: "Publishing result"
            });

            await this.props.contract.methods
                .publishResults(result)
                .send({ from: this.props.userAddresses[0] });

            this.setState({ modalState: "success" });
        } catch (err) {
            this.setState({ modalState: "error", errorMessage: err.message });
        }
    };
    
    handleAddKeyShare = () => {
        this.setState({
            keyParts: this.state.keyParts.concat([{share:""}])
        })
    }

    handleRemoveKeyShare = (index) => () => {
        this.setState({
            keyParts: this.state.keyParts.filter((part, i) => index !== i)
        })
    }

    handleKeyPartChange = (index) => evt => {
        const newKeyParts = this.state.keyParts.map((part, idx) => {
            if (idx !== index) return part;
            return {share: evt.target.value};
        });

        this.setState({ keyParts: newKeyParts });
    }

    handleModalClose = () => {
        this.setState({ modalOpen: false });
    };

    render() {
        return (
            <React.Fragment>
                <ProcessingModal
                    modalOpen={this.state.modalOpen}
                    modalState={this.state.modalState}
                    handleModalClose={this.handleModalClose}
                    errorMessageDetailed={this.state.errorMessage}
                    processingMessage={this.state.statusMessage}
                    errorMessage="We encountered an error. Please try again."
                    successMessage="The results have been decrypted and published."
                />

                {this.state.electionManager === this.props.userAddresses[0] &&
                this.state.publishedResults.length === 0 ? (
                    <Form onSubmit={this.handleSubmit} warning>
                        <Header as="h4" attached="top">
                            Decrypt and Publish
                        </Header>
                        <Segment attached>
                            { this.state.keyParts.map((part, i) => (
                                <div>
                                <React.Fragment>
                                    <strong>Private Key Share {i+1}</strong> 
                                    <Icon 
                                      onClick={this.handleRemoveKeyShare(i)} 
                                      name="trash alternate"
                                      color="red"
                                      style={{ cursor: "pointer"}}
                                    />
                                </React.Fragment>
                                <Form.TextArea
                                name={`privatekey-${i+1}`}
                                partId={i}
                                value={part.share}
                                onChange={this.handleKeyPartChange(i)}
                                style={{ minHeight: 100, marginBottom: "20px"}}
                                />
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={this.handleAddKeyShare}
                                className="large"
                                fluid
                                style={ {margin: "10px 0px"} }
                                >
                                    Add a share
                            </Button>
                            <Button
                                animated="fade"
                                type="submit"
                                fluid
                                loading={this.state.modalState === "processing"}
                                color="green"
                                //disabled={!this.state.inputsValid}
                            >
                                <Button.Content visible>
                                    Decrypt and Publish
                                </Button.Content>
                                <Button.Content hidden>
                                    <Icon name="lock open" />
                                </Button.Content>
                            </Button>
                        </Segment>
                    </Form>
                ) : null}

                <Table celled compact unstackable>
                    <Table.Header fullWidth>
                        <Table.Row>
                            <Table.HeaderCell>Title</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">
                                Result
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.props.options !== undefined ? (
                            this.props.options.map((option, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell>{option.title}</Table.Cell>
                                    <Table.Cell>
                                        {option.description}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        {this.state.publishedResults.length !==
                                        0 ? (
                                            this.state.publishedResults[i]
                                        ) : (
                                            <React.Fragment>
                                                <Icon name="lock" />
                                            </React.Fragment>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell colSpan="3" textAlign="center">
                                    <Segment>
                                        <Dimmer active inverted>
                                            <Loader inverted>Loading</Loader>
                                        </Dimmer>
                                        <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
                                    </Segment>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </React.Fragment>
        );
    }
}

export default OptionsTablePastElection;
