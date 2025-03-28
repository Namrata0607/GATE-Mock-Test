const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// bcrypt is used to hash passwords

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    confirmPassword : {
        type: String,
        required: true
    },
    branch : {
        type: String,
        required: true
    },
    mobile : {
        type: Number,
        required: true
    },

}, {timestamps: true});
// timestamps: true will automatically add createdAt and updatedAt fields in the database


userSchema.pre("save", async function(next) {
    if (!this.isModified("password")){
        return next();
    } 
// If the password is not modified, then we don't need to hash it again 
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
// 10 is the number of rounds of hashing

// pre() is a middleware function that runs before
// the save() method is called on the mongoose model instance

module.exports = mongoose.model('User', userSchema);