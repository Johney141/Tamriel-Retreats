'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
options.tableName = "Spots";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   Spot.bulkCreate([
    {
      address: 'Plains District',
      city: 'Whiterun',
      country: 'Skyrim',
      lat: 15.0000001,
      lng: 70.0000002,
      name: 'Bannered Mare',
      description: 'The inn has two stories split into multiple rooms. On the first floor there is the common room, a small bedroom, and the kitchen. The second floor contains three bedrooms split across two areas',
      price: 100,
      ownerId: 1

    },
    {
      address: 'City Center',
      city: 'Rifton',
      country: 'Skyrim',
      lat: -40.0000001,
      lng: 120.0000002,
      name: 'The Bee and Barb',
      description: 'An inn located in the center of city of Riften, next to the marketplace.',
      price: 100,
      ownerId: 2

    },
    {
      address: 'Thieves Guild',
      city: 'Rifton',
      country: 'Skyrim',
      lat: -40.0202111,
      lng: 120.1200002,
      name: "The Ragged Flagon",
      description: "An inn that is part of the Thieves Guild's headquarters.",
      price: 100,
      ownerId: 3

    },
  ], {validate: true});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Bannered Mare', 'The Bee and Barb', 'The Ragged Flagon'] }
    }, {});
  }
};
