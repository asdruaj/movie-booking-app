/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createExtension('btree_gist', { ifNotExists: true });

  pgm.addColumn('showtimes', {
    end_time: { type: 'timestamptz', notNull: true },
  });

  pgm.sql(`
    ALTER TABLE showtimes
    ADD CONSTRAINT no_overlapping_showtimes
    EXCLUDE USING gist (
      room_id WITH =,
      tstzrange(start_time, end_time) WITH &&
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql('ALTER TABLE showtimes DROP CONSTRAINT no_overlapping_showtimes;');
  pgm.dropColumn('showtimes', 'end_time');
};