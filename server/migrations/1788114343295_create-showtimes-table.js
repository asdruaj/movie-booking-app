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
    pgm.createTable('showtimes', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()')
        },
        movie_id:{
            type: 'uuid',
            notNull: true,
            references: 'movies',
            onDelete: 'RESTRICT'
        },
        room_id:{
            type: 'uuid',
            notNull: true,
            references: 'rooms',
            onDelete: 'RESTRICT'
        },
        start_time:{
            type: 'timestamptz',
            notNull: true,
        }

    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('showtimes')
};
