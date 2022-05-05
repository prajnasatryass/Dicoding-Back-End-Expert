/* eslint-disable camelcase */
const { PgTypes } = require('../src/Commons/utils/constants');

const tableName = 'threads';

exports.up = (pgm) => {
  pgm.createTable(tableName, {
    id: {
      type: PgTypes.VARCHAR(50),
      primaryKey: true,
    },
    title: {
      type: PgTypes.TEXT,
      notNull: true,
    },
    body: {
      type: PgTypes.TEXT,
      notNull: true,
    },
    owner_id: {
      type: PgTypes.VARCHAR(50),
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
    deleted_at: {
      type: PgTypes.TIMESTAMP,
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable(tableName);
};
