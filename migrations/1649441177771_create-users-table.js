/* eslint-disable camelcase */
const { PgTypes } = require('../src/Commons/utils/constants');

const tableName = 'users';

exports.up = (pgm) => {
  pgm.createTable(tableName, {
    id: {
      type: PgTypes.VARCHAR(50),
      primaryKey: true,
    },
    username: {
      type: PgTypes.VARCHAR(50),
      notNull: true,
      unique: true,
    },
    password: {
      type: PgTypes.TEXT,
      notNull: true,
    },
    fullname: {
      type: PgTypes.TEXT,
      notNull: true,
    },
    inserted_at: {
      type: PgTypes.TIMESTAMP,
      notNull: true,
    },
    updated_at: {
      type: PgTypes.TIMESTAMP,
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable(tableName);
};
