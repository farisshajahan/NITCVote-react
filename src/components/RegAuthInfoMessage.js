import React from "react";
import { Link } from "react-router-dom";
import { Message, Button } from "semantic-ui-react";

export default function RegAuthInfoMessage(props) {
    return (
        <Message info>
            <Button basic floated="right" as={Link} to={`registrationauthority/${props.electionid}`}>
                Registration
            </Button>
            <Message.Header>Register Voters</Message.Header>
            <p>
                You can manage and see registered voters by clicking on the
                button to the right.
            </p>
        </Message>
    );
}
