import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";

class ElectionButton extends Component {
    render() {
        return (
            <Button
                as={Link}
                to={`election/${this.props.electionid}`}
                floated="right"
                color={
                    this.props.activeItem === "past"
                        ? "blue"
                        : this.props.activeItem === "current"
                            ? this.props.userIsRegisteredVoter
                                ? this.props.userHasVoted
                                    ? "olive"
                                    : "green"
                                : "blue"
                            : this.props.userIsRegAuthority
                                ? "blue"
                                : "green"
                }
                animated="fade"
                disabled={ this.props.activeItem === "current"
                    ? this.props.userHasVoted 
                        ? true
                        : false
                    :null}
            >
                <Button.Content visible>
                    {this.props.activeItem === "past"
                        ? "View Results"
                        : this.props.activeItem === "current"
                            ? this.props.userIsRegisteredVoter
                                ? !this.props.userHasVoted
                                    ? "Vote"
                                    : "Already voted"
                                : "View"
                            : this.props.userIsRegAuthority
                                ? "Add Candidates"
                                : "View Candidates"}
                </Button.Content>
                <Button.Content hidden>
                    {this.props.activeItem === "past" 
                        ? (<Icon name="envelope open" />)
                        : this.props.activeItem === "current" 
                            ? (this.props.userIsRegisteredVoter 
                                ? (!this.props.userHasVoted
                                    ? (<Icon name="pencil" />)
                                    : null)
                                : (<Icon name="eye" />))
                            : this.props.userIsRegAuthority
                                ? (<Icon name="users" />)
                                : (<Icon name="eye" />)}
                </Button.Content>
            </Button>
        );
    }
}

export default ElectionButton;
