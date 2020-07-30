const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: "https://elasticsearch-master-kpatel20538.cloud.okteto.net",
});

const searchBooks = async ({ query, category = null }) => {
  const result = await client.search({
    index: "book",
    body: {
      query: {
        bool: {
          must: {
            query_string: {
              query: query || "*",
            },
          },
          ...(category
            ? {
                filter: {
                  term: { "category.keyword": category },
                },
              }
            : {}),
        },
      },
      aggs: {
        price_ranges: {
          histogram: {
            field: "price",
            interval: 2500,
            min_doc_count: 1,
          },
        },
        rating_ranges: {
          histogram: {
            field: "rating",
            interval: 1,
          },
        },
        categories: {
          terms: {
            field: "category.keyword",
          },
        },
      },
    },
  });
  return {
    results: result.body.hits.hits.map(({ _source }) => _source),
    price_ranges: result.body.aggregations.price_ranges.buckets,
    rating_ranges: result.body.aggregations.rating_ranges.buckets,
    categories: result.body.aggregations.categories.buckets,
  };
};

module.exports = {
  searchBooks,
};
