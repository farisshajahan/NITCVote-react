import React from "react";
import { Link } from "react-router-dom";
import { Message, Button } from "semantic-ui-react";

export default function EnterOtpMessage(props) {
    return (
        <Message success>
            <Message.Header>Registered</Message.Header>
            <p>
                You have registered your address for this election. For the sake of your privacy, it is not possible to change your address.
            </p>
        </Message>
    );
}
