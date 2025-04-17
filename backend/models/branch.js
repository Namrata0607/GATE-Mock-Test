const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    branchName: {
        type: String,
        required: true,
        unique: true
    },
    // subjects: [
    //     { 
    //         type: mongoose.Schema.Types.ObjectId, 
    //         ref: "Subjects" 
    //     }
    // ]

})

module.exports = mongoose.model('Branch', branchSchema);