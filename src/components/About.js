import React, { Component } from "react";
import { Container, Header } from "semantic-ui-react";

class About extends Component {
    render() {
        return (
            <Container>
                <Header as="h1">About this project</Header>
                <p>
                    <i>
                        This is an E-voting system implemented as a part of Computer Security course. The votes are stored in a private blockchain "geth" run on our server.
                        
                    </i>
                </p>
                <p>
                    The project is modified from the project by Johannes Mols at Aalborg
                    University in Copenhagen in the context of a semester
                    project. The project report can be found on{" "}
                    <a
                        href="https://github.com/johannesmols/ethVote/blob/master/report/P5_Project.pdf"
                        target="_blank"
                    >
                        GitHub
                    </a>
                    , together with the source code.
                </p>
            </Container>
        );
    }
}

export default About;
