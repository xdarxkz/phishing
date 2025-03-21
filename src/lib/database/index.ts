import { Sequelize } from 'sequelize';
import 'dotenv/config';

// SQLite-konfigurasjon
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Filen der dataene lagres
  logging: false, // Skru av SQL-logging
});

const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // Oppdaterer tabeller automatisk
    console.log('Tilkoblet database!');
  } catch (error) {
    console.error('Databasefeil:', error);
  }
};

export { sequelize, initializeDB };