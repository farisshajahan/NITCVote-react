import React from "react";
import { Link } from "react-router-dom";
import { Message, Button } from "semantic-ui-react";

export default function EnterOtpMessage(props) {
    return (
        <Message info>
            <Button basic floated="right" as={Link} to={`EnterOTP/${props.electionid}`}>
                Registration
            </Button>
            <Message.Header>Register Ethereum Address</Message.Header>
            <p>
                You must register your public Ethereum address that you will be using to Vote.
            </p>
        </Message>
    );
}
