const Branch = require('../models/branch');

const getBranches = async (req, res, next) => {
    try {
        const branches = await Branch.find(); // Fetch all branches
        res.json(branches);
    } catch (error) {
        next(error);
    }
};

module.exports = { getBranches };