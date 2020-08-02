import React, { useContext } from "react";
import { Navbar, Button } from "rbx";
import { useHistory } from "react-router-dom";

import { AuthApiContext } from "../../components/AuthApiProvider";

import constants from "./constants.yaml";

const Appbar = () => {
  const history = useHistory();
  const { putToken, hasToken } = useContext(AuthApiContext);

  return (
    <Navbar>
      <Navbar.Brand>
        <Navbar.Item onClick={() => history.push("/")}>
          <img
            {...constants.logo}
            role="presentation"
            width="112"
            height="28"
          />
        </Navbar.Item>
        <Navbar.Burger />
      </Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Segment align="start">
          <Navbar.Item onClick={() => history.push("/")}>
            {constants.actions.home}
          </Navbar.Item>
          <Navbar.Item onClick={() => history.push("/search")}>
            {constants.actions.search}
          </Navbar.Item>
        </Navbar.Segment>

        <Navbar.Segment align="end">
          {hasToken ? (
            <Navbar.Item dropdown>
              <Navbar.Link>My Account</Navbar.Link>
              <Navbar.Dropdown>
                <Navbar.Item onClick={() => history.push("/account")}>
                  {constants.actions.account}
                </Navbar.Item>
                <Navbar.Divider />
                <Navbar.Item onClick={() => putToken(null)}>
                  {constants.actions.signOut}
                </Navbar.Item>
              </Navbar.Dropdown>
            </Navbar.Item>
          ) : (
            <Navbar.Item>
              <Button color="primary" onClick={() => history.push("/sign-in")}>
                <strong>{constants.actions.signIn}</strong>
              </Button>
            </Navbar.Item>
          )}
        </Navbar.Segment>
      </Navbar.Menu>
    </Navbar>
  );
};

export default Appbar;
