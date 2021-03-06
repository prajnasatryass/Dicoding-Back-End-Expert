const { PgTypes } = require('../src/Commons/utils/constants');

const tableName = 'comment_likes';

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
    user_id: {
      type: PgTypes.VARCHAR(50),
      notNull: true,
    },
    inserted_at: {
      type: PgTypes.TIMESTAMP,
      notNull: true,
    },
  });

  pgm.addConstraint(tableName, 'fk_comment_id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
  pgm.addConstraint(tableName, 'fk_user_id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint(tableName, 'unique_comment_and_liker_pair', 'UNIQUE(comment_id, user_id)');
};

exports.down = (pgm) => {
  pgm.dropTable(tableName);
};
