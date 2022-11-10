const environment = process.env.NODE_ENV || "development";
const knexConfig = "/knexfile.js";
const config = require(knexConfig)[environment];

//initialize knex
const knex = require("knex")(config);

module.exports = knex;