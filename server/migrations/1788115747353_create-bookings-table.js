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
    pgm.createTable('bookings', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()')
        },
        showtime_id:{
            type: 'uuid',
            notNull: true,
            references: 'showtimes',
            onDelete: 'RESTRICT'
        },
        seat_id:{
            type: 'uuid',
            notNull: true,
            references: 'seats',
            onDelete: 'RESTRICT'
        },
        status:{
            type: 'varchar(50)',
            notNull: true,
            check: "status IN ('confirmed', 'cancelled')"
        },
    })

    pgm.addConstraint('bookings', 'unique_showtime_seat', {
        unique: ['showtime_id', 'seat_id'],
    });
};



/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('bookings')
};
