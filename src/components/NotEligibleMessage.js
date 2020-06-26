import React from "react";
import { Link } from "react-router-dom";
import { Message, Button } from "semantic-ui-react";

export default function NotEligibleMessage() {
    return (
        <Message error>
            <Message.Header>Not Eligible</Message.Header>
            <p>
                You are not eligible for this election. If you think this is a mistake, contact your Registration Authority.
            </p>
        </Message>
    );
}
