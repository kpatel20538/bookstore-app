import React from "react";
import {
  Hero,
  Title,
  Column,
  Navbar,
  Block,
  Notification,
  Container,
  Section,
} from "rbx";

const HeroSection = () => {
  return (
    <Hero color="primary" size="medium" textAlign="centered">
      <Hero.Body>
        <Title>Home Page</Title>
      </Hero.Body>
    </Hero>
  );
}


const SearchBar = () => <Navbar color="light" />
const CategoryBar = () => <Navbar color="dark" />;
const BestSellerSection = () => <Block><Notification color="primary"/></Block>
const CategoryGallery = () => <Notification color="dark" />;
const RecommendationsSection = () => (
  <Section>
    <Notification color="light" />
  </Section>
);

const Home = () => {
  return (
    <>
      <HeroSection />
      <SearchBar />
      <CategoryBar />
      <Container>
        <BestSellerSection />
        <Column.Group>
          <Column size="one-third">
            <Notification color="primary">
              <Title>Your Past Orders</Title>
            </Notification>
          </Column>
          <Column size="one-third">
            <Notification color="dark">
              <Title>Your Shopping Cart</Title>
            </Notification>
          </Column>
          <Column size="one-third">
            <Notification color="light">
              <Title>Best Sellers</Title>
            </Notification>
          </Column>
        </Column.Group>
        <CategoryGallery />
        <RecommendationsSection />
      </Container>
    </>
  );
};

export default Home;
