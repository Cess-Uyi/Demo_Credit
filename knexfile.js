require("dotenv").config();

module.exports = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: "utf8",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + "/db/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeders",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

// knex
//   .raw("SELECT VERSION()")
//   .then((version) => console.log(version[0][0]))
//   .catch((err) => {
//     console.log(err);
//     throw err;
//   })
//   .finally(() => {
//     knex.destroy();
//   });
