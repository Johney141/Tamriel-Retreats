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
        url: 'https://tamrielretreats.s3.us-east-2.amazonaws.com/The_Bannered_Mare_preview.jpg',
        spotId: '1',
        isPreview: true
      },
      {
        url: 'https://tamrielretreats.s3.us-east-2.amazonaws.com/The_Bee_and_Barb_preview.jpg',
        spotId: '2',
        isPreview: true
      },
      {
        url: 'https://tamrielretreats.s3.us-east-2.amazonaws.com/TESV_Ragged_Flagon.webp',
        spotId: '3',
        isPreview: true
      },
      {
        url: 'https://tamrielretreats.s3.us-east-2.amazonaws.com/The_Bannered_Mare.jpg',
        spotId: '1',
        isPreview: false
      },
      {
        url: 'https://tamrielretreats.s3.us-east-2.amazonaws.com/The_Bee_and_Barb.jpg',
        spotId: '2',
        isPreview: false
      },
      {
        url: 'https://tamrielretreats.s3.us-east-2.amazonaws.com/Ragged_Flagon.jpg',
        spotId: '3',
        isPreview: false
      }, 
      {
        url: 'https://tamrielretreats.s3.us-east-2.amazonaws.com/Bannered_Mare_Shop_Sign.webp',
        spotId: '1',
        isPreview: false
      },
      {
        url: 'https://tamrielretreats.s3.us-east-2.amazonaws.com/The_Bannered_Mare_Inside.webp',
        spotId: '1',
        isPreview: false
      },
      {
        url: 'https://tamrielretreats.s3.us-east-2.amazonaws.com/The_Bannered_Mare_outside.webp',
        spotId: '1',
        isPreview: false
      }
    ], {validate: true});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://tamrielretreats.s3.us-east-2.amazonaws.com/The_Bannered_Mare_preview.jpg',
                       'https://tamrielretreats.s3.us-east-2.amazonaws.com/The_Bee_and_Barb_preview.jpg',
                       'https://tamrielretreats.s3.us-east-2.amazonaws.com/The_Ragged_Flagon_preview.jpg',
                       'https://tamrielretreats.s3.us-east-2.amazonaws.com/The_Bannered_Mare.jpg',
                       'https://tamrielretreats.s3.us-east-2.amazonaws.com/The_Bee_and_Barb.jpg',
                       'https://tamrielretreats.s3.us-east-2.amazonaws.com/Ragged_Flagon.jpg',
                      ] }
    }, {});
  }
};
