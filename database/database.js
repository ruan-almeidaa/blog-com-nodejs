const Sequelize = require("sequelize");
let connection = 'string de conexão';

if (process.env.DATABASE_URL) {
    connection = new Sequelize(process.env.DATABASE_URL,{
        dialect:'postgres',
        protocol:'postgres',
        timezone:"-03:00",
        dialectOptions:{
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });
}else {
    connection = sequelize = new Sequelize('blog', 'postgres', 'postgres',{
        host:'localhost',
        dialect:'postgres',
        timezone:"-03:00"
    });
  }

module.exports = connection;
  