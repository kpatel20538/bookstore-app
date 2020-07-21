import React from "react";
import { Navbar, Button } from "rbx";
import { Link, useHistory } from "react-router-dom";

const Appbar = () => {
  const history = useHistory();

  return (
    <Navbar>
      <Navbar.Brand>
        <Navbar.Item onClick={() => history.push("/")}>
          <img
            src="https://bulma.io/images/bulma-logo.png"
            alt=""
            role="presentation"
            width="112"
            height="28"
          />
        </Navbar.Item>
        <Navbar.Burger />
      </Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Segment align="start">
          <Navbar.Item onClick={() => history.push("/")}>Home</Navbar.Item>
        </Navbar.Segment>

        <Navbar.Segment align="end">
          <Navbar.Item>
            <Button.Group>
              <Button color="primary" onClick={() => history.push("/signup")}>
                <strong>Sign up</strong>
              </Button>
              <Button color="light" onClick={() => history.push("/login")}>
                Log in
              </Button>
              <Button color="primary" onClick={() => history.push("/account")}>
                <strong>My Account</strong>
              </Button>
            </Button.Group>
          </Navbar.Item>
        </Navbar.Segment>
      </Navbar.Menu>
    </Navbar>
  );
};

export default Appbar;
