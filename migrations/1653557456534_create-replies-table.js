const { PgTypes } = require('../src/Commons/utils/constants');

const tableName = 'replies';

exports.up = (pgm) => {
  pgm.createTable(tableName, {
    id: {
      type: PgTypes.VARCHAR(50),
      primaryKey: true,
    },
    comment_id: {
      type: PgTypes.VARCHAR(50),
      notNull: true,
    },
    content: {
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
      default: null,
    },
    deleted_at: {
      type: PgTypes.TIMESTAMP,
      notNull: false,
      default: null,
    },
  });

  pgm.addConstraint(tableName, 'fk_comment_id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
  pgm.addConstraint(tableName, 'fk_owner_id', 'FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable(tableName);
};
