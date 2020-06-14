import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Icon, Dropdown } from "semantic-ui-react";

class Header extends Component {
    render() {
        return (
            <div>
            <Menu>
                <Menu.Item header as={Link} to="/">
                    Home
                </Menu.Item>
                <Menu.Menu position="right">
                    <Dropdown item text="Help">
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/metamask">
                                Metamask
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/register">
                                Register to vote
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item as={Link} to="/about" position="right">
                        About
                    </Menu.Item>
                    <Menu.Item
                        href="//github.com/farisshajahan/NITCVote"
                        target="_blank"
                    >
                        <Icon name="github" />
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
            <h1 style={{textAlign: "center"}}>NITC<span style={ {color:"#3283a8"} }>Vote</span></h1>
            </div>
        );
    }
}

export default Header;
