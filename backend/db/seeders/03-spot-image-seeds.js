'use strict';


const { SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
options.tableName = "SpotImages";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    SpotImage.bulkCreate([
      {
        url: 'https://tamriel-retreats.onrender.com/images/The_Bannered_Mare_preview.jpg',
        spotId: '1',
        isPreview: true
      },
      {
        url: 'https://tamriel-retreats.onrender.com/images/The_Bee_and_Barb_preview.jpg',
        spotId: '2',
        isPreview: true
      },
      {
        url: 'https://tamriel-retreats.onrender.com/images/The_Ragged_Flagon_preview.jpg',
        spotId: '3',
        isPreview: true
      },
      {
        url: 'https://tamriel-retreats.onrender.com/images/The_Bannered_Mare.jpg',
        spotId: '1',
        isPreview: false
      },
      {
        url: 'https://tamriel-retreats.onrender.com/images/The_Bee_and_Barb.jpg',
        spotId: '2',
        isPreview: false
      },
      {
        url: 'https://tamriel-retreats.onrender.com/images/Ragged_Flagon.jpg',
        spotId: '3',
        isPreview: false
      }
    ], {validate: true});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://tamriel-retreats.onrender.com/images/The_Bannered_Mare_preview.jpg',
                       'https://tamriel-retreats.onrender.com/images/The_Bee_and_Barb_preview.jpg',
                       'https://tamriel-retreats.onrender.com/images/The_Ragged_Flagon_preview.jpg',
                       'https://tamriel-retreats.onrender.com/images/The_Bannered_Mare.jpg',
                       'https://tamriel-retreats.onrender.com/images/The_Bee_and_Barb.jpg',
                       'https://tamriel-retreats.onrender.com/images/Ragged_Flagon.jpg',
                      ] }
    }, {});
  }
};
