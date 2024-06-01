'use strict';


const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
options.tableName = "Bookings";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    Booking.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: '2024-7-20',
        endDate: '2024-7-21'
      },
      {
        spotId: 2,
        userId: 1,
        startDate: '2024-7-1',
        endDate: '2024-7-12'
      },
      {
        spotId: 1,
        userId: 3,
        startDate: '2024-8-18',
        endDate: '2024-8-19'
      }
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: { [Op.in]: ['2024-8-18', '2024-6-1', '2024-7-20'] }
    }, {});
  }
};
