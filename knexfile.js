module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'gfight'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }

};
