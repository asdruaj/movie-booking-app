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
    pgm.createTable('movies', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()')
        },
        name: {
            type: 'varchar(50)',
            notNull: true,
        },
        description: {
            type: 'text',
            notNull: true,
        },
        genre: {
            type: 'varchar(50)',
            notNull: true,
        },
        duration: {
            type: 'integer',
            notNull: true,
        },
        poster_url: {
            type: 'text',
            notNull: false,
        },
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('movies')
};