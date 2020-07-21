# (WIP) Bookstore App

Inspired by this amazon blog post.

https://aws.amazon.com/blogs/database/building-a-modern-application-with-purpose-built-aws-databases/

## Goals

### Primary Goals 

[~] SPA Frontend w/ Minio
[ ] GraphQL API w/ Apollo
[ ] Users w/ GoTrue
[ ] Catalog, Cart, Orders w/ Cassandra
[ ] Rakings w/ Redis
[ ] Search w/ ElasticSearch
[ ] Recommendations w/ Neo4j

### Stretch Goals 

[ ] Server Provision, Secrets w/ Terraform
[ ] Service Traffic Control, Auth, Reporting  w/ Istio
[ ] CI/CD w/ Github Actions 
[ ] Eventing  w/ Kafka


## Accounts

$ git clone https://github.com/netlify/gotrue
$ sudo docker build -t <DOCKER_USERNAME>/gotrue . 
$ sudo docker push <DOCKER_USERNAME>/gotrue
