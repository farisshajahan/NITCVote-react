import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Icon, Dropdown, Image } from "semantic-ui-react";
import Cookies from "js-cookie";

class Header extends Component {
    render() {
        return (
            <div>
            <Menu>
                <Menu.Item header as={Link} to="/">
                    Home
                </Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item href="//metamask.io" target="_blank">
                        Install Metamask
                    </Menu.Item>
                    { this.props.login ?
                    (<Dropdown item text="My Account">
                        <Dropdown.Menu style={{width: "180px"}}>
                            <Dropdown.Item
                                style={{height: "70px", display:"flex", alignItems: "center", justifyContent:"center"}}
                            >
                                <Image
                                    src={Cookies.get('pic')}
                                    style={{borderRadius: "50%"}}
                                /> {this.props.login}
                            </Dropdown.Item>
                            <Dropdown.Item
                                style={{display:"flex", margin: "5px", color: "red", alignItems: "center", justifyContent:"center"}}
                                as={Link} to="/logout"
                            >
                                Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                     </Dropdown>) :
                    (<Menu.Item as={Link} to="/login">
                        Login to vote
                    </Menu.Item>)}
                    <Menu.Item
                        href="//github.com/farisshajahan/NITCVote"
                        target="_blank"
                    >
                        <Icon name="github" />
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
            <h1 style={{textAlign: "center"}}>
                <Link to="/" style={{color:"black"}}>
                    NITC<span style={ {color:"#3283a8"} }>Vote</span>
                </Link>
            </h1>
            </div>
        );
    }
}

export default Header;
