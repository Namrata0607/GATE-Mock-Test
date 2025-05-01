const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    uploadedFiles:[
        {
            fileName: {
                type: String,
                required: true
            },
            uploadedAt:{
                type: Date,
                default: Date.now
            }
        }
    ],
},{ timestamps: true });

staffSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('Staff', staffSchema);