const mongoose = require("mongoose");

module.exports = async (dbUrl) => {
    return mongoose
        .connect(dbUrl)
        .then(() => console.log(">>> Mongodb connection open !!! "))
        .catch((error) => {
            console.log(">>> Mongodb connection error !!! ");
            console.log(error);
        });
};
