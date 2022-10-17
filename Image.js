const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        filePath: String,
    },
    {
        timestamp: true,
    },
);

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;