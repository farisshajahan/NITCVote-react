import React, { Component } from "react";
import { Card, Icon } from "semantic-ui-react";
import ElectionButton from "./ElectionButton";
import formatTimestamp from "../../utils/formatTimestamp";
import RegAuthInfoMessage from "../RegAuthInfoMessage";
import EnterOtpMessage from "../EnterOtpMessage";
import Cookies from "js-cookie";
import RegisteredMessage from "../RegisteredMessage";

class ElectionCard extends Component {
    render() {
        return (
            <Card fluid>
                <Card.Content>
                    <ElectionButton
                        activeItem={this.props.activeItem}
                        userHasVoted={this.props.userHasVoted}
                        userIsRegisteredVoter={this.props.userIsRegisteredVoter}
                        electionid={this.props.address}
                        userIsRegAuthority={this.props.userIsRegAuthority}
                    />
                    <Card.Header>{this.props.title}</Card.Header>
                    <Card.Meta>{this.props.description}</Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <Icon name="clock" />
                    {this.props.activeItem === "past" ? (
                        <React.Fragment>
                            from{" "}
                            <strong>
                                {formatTimestamp(this.props.startTime)}
                            </strong>{" "}
                            to{" "}
                            <strong>
                                {formatTimestamp(this.props.timeLimit)}
                            </strong>
                        </React.Fragment>
                    ) : this.props.activeItem === "current" ? (
                        <React.Fragment>
                            ending{" "}
                            <strong>
                                {formatTimestamp(this.props.timeLimit)}
                            </strong>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            starting{" "}
                            <strong>
                                {formatTimestamp(this.props.startTime)}
                            </strong>
                            , lasting until{" "}
                            <strong>
                                {formatTimestamp(this.props.timeLimit)}
                            </strong>

                            { this.props.userIsRegAuthority ? (
                            <RegAuthInfoMessage
                                  electionid={this.props.address}
                            /> ) : Cookies.get('token') ?
                                this.props.submitted.includes(this.props.address) ?
                                (<RegisteredMessage />) :
                                (<EnterOtpMessage electionid={this.props.address}/>)
                                : null
                            }

                        </React.Fragment>
                       
                        
                        
                    )}
                </Card.Content>
            </Card>
        );
    }

    formatTimestamp(timestamp) {
        const options = {
            day: "2-digit",
            year: "numeric",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        };

        return new Date(timestamp * 1000).toLocaleDateString("da", options);
    }
}

export default ElectionCard;
