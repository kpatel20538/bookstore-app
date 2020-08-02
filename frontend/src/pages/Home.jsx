import React from "react";
import { Hero, Title } from "rbx";

import Ratings from "../components/Ratings";

const Home = () => {
  return (
    <>
      <Hero color="primary" size="medium" textAlign="centered">
        <Hero.Body>
          <Title>Home Page</Title>
        </Hero.Body>
      </Hero>
      <Ratings rating={3} />
      <br />
      <Ratings rating={2} />
      <br />
      <Ratings rating={4.5} />
      <br />
      <Ratings rating={5} />
      <br />
    </>
  );
};

export default Home;
