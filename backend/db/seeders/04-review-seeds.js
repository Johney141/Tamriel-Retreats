'use strict';


const { Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
options.tableName = "SpotImages";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    Review.bulkCreate([
      {
        userId: 1,
        spotId: 2,
        review: 'There was a fight at the bar, but it was quite entertaning. Bed was comfortable, but food was kinda bland',
        stars: 4
      },
      {
        userId: 2,
        spotId: 1,
        review: 'Very comfortable and great location and food. Will visit again when in Whiterun',
        stars: 5
      },
      {
        userId: 1,
        spotId: 3,
        review: 'Spot is infested with skeevers, and when I woke up someone had stolen all of my gold',
        stars: 1
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.in]: [
        "Spot is infested with skeevers, and when I woke up someone had stolen all of my gold",
        "Very comfortable and great location and food. Will visit again when in Whiterun",
        "There was a fight at the bar, but it was quite entertaning. Bed was comfortable, but food was kinda bland"
      ] }
    }, {});
  }
};
