import knex from 'knex';

var connection = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'nlw'
    }
});

export default connection;
