const mongoose = require("mongoose")

var schema = new mongoose.Schema({

    user_name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true,

    },
    password: {
        type: String,
        require: true
    },
})


// const user_register = mongoose.model("usercollection", schema)
// // "usercollection" is the collection name of database in the mongoDB Atlas

// module.exports = {
//     user_register: user_register,
// };
module.exports=mongoose.model("customerData", schema)
