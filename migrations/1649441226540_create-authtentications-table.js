/* eslint-disable camelcase */

const { PgTypes } = require('../src/Commons/utils/constants');

const tableName = 'authentications';

exports.up = (pgm) => {
  pgm.createTable(tableName, {
    token: {
      type: PgTypes.TEXT,
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable(tableName);
};
