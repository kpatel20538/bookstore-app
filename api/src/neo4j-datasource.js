const neo4j = require("neo4j-driver");
const client = neo4j.driver(
  "neo4j://neo4j-service.kpatel20538.svc.cluster.local",
  null,
  {disableLosslessIntegers: true}
);

const getBooksFromAuthor = async ({ book_id }) => {
  console.log(book_id);
  const session = client.session();
  const results = await session.run(
    `
    MATCH (:Book {book_id: $id})<-[:WROTE]-(:Author)-[:WROTE]->(a:Book) 
    RETURN DISTINCT a
    LIMIT 10;
  `,
    { id: book_id }
  );
  await session.close();
  return results.records.map((record) => record.get("a").properties);
}

const getBooksFromCustomersOfAuthor = async ({ author }) => {
  console.log(author)
  const session = client.session();
  const results = await session.run(
    `
    MATCH (:Author {name: $name})-[:WROTE]->(:Book)<-[:PURCHASED]-(:Customer)-[:PURCHASED]->(a:Book) 
    RETURN DISTINCT a
    LIMIT 10;
  `,
    { name: author }
  );
  await session.close();
  return results.records.map((record) => record.get("a").properties);
};

const getPersonalBooks = async ({ email }) => {
  console.log(email);
  const session = client.session();
  const results = await session.run(
    `
    MATCH (:Customer {email: $email})-[:PURCHASED]->(:Book)<-[:PURCHASED]-(:Customer)-[:PURCHASED]->(a:Book) 
    RETURN DISTINCT a
    LIMIT 10;
  `,
    { email }
  );
  await session.close();
  return results.records.map((record) => record.get("a").properties);
};

module.exports = {
  getBooksFromAuthor,
  getBooksFromCustomersOfAuthor,
  getPersonalBooks,
};