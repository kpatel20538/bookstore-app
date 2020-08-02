import React from "react";
import { Navbar, Button } from "rbx";
import { useHistory } from "react-router-dom";
import constants from "./constants.yaml";

const Appbar = () => {
  const history = useHistory();

  return (
    <Navbar>
      <Navbar.Brand>
        <Navbar.Item onClick={() => history.push("/")}>
          <img {...constants.logo} role="presentation" width="112" height="28" />
        </Navbar.Item>
        <Navbar.Burger />
      </Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Segment align="start">
          <Navbar.Item onClick={() => history.push("/")}>
            {constants.pages.home}
          </Navbar.Item>
          <Navbar.Item onClick={() => history.push("/books")}>
            {constants.pages.bookList}
          </Navbar.Item>
        </Navbar.Segment>

        <Navbar.Segment align="end">
          <Navbar.Item>
            <Button.Group>
              <Button color="primary" onClick={() => history.push("/signup")}>
                <strong>{constants.pages.signUp}</strong>
              </Button>
              <Button color="light" onClick={() => history.push("/login")}>
                {constants.pages.logIn}
              </Button>
              <Button color="primary" onClick={() => history.push("/account")}>
                <strong>{constants.pages.account}</strong>
              </Button>
            </Button.Group>
          </Navbar.Item>
        </Navbar.Segment>
      </Navbar.Menu>
    </Navbar>
  );
};

export default Appbar;
