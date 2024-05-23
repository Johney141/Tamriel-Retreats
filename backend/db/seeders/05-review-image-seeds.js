'use strict';
const { ReviewImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
options.tableName = "ReviewImages";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    ReviewImage.bulkCreate([
      {
        url: 'https://th.bing.com/th/id/OIP.oPlhfioAYG6Y7yO-9DL6bwHaEK?w=294&h=180&c=7&r=0&o=5&pid=1.7',
        reviewId: 1
      },
      {
        url: 'https://th.bing.com/th/id/OIP.R1h2lssbRM7_y-iWO-TYKwHaEo?w=273&h=180&c=7&r=0&o=5&pid=1.7',
        reviewId: 2
      },
      {
        url: 'https://th.bing.com/th/id/OIP.BCVWxK35CsMC13k733DQlgHaEL?w=267&h=180&c=7&r=0&o=5&pid=1.7',
        reviewId: 3
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: [
        "https://th.bing.com/th/id/OIP.oPlhfioAYG6Y7yO-9DL6bwHaEK?w=294&h=180&c=7&r=0&o=5&pid=1.7",
        "https://th.bing.com/th/id/OIP.R1h2lssbRM7_y-iWO-TYKwHaEo?w=273&h=180&c=7&r=0&o=5&pid=1.7",
        "https://th.bing.com/th/id/OIP.BCVWxK35CsMC13k733DQlgHaEL?w=267&h=180&c=7&r=0&o=5&pid=1.7"
      ] }
    }, {});
  }
};
