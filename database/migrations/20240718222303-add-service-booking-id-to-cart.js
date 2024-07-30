'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tbl_carts', 'service_booking_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint('tbl_carts', {
      fields: ['service_booking_id'],
      type: 'foreign key',
      name: 'fk_service_booking_id', // optional, can be omitted or renamed
      references: {
        table: 'tbl_service_bookings', // name of the referenced table
        field: 'booking_id', // name of the referenced field
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('tbl_carts', 'fk_service_booking_id');
    await queryInterface.removeColumn('tbl_carts', 'service_booking_id');
  }
};
