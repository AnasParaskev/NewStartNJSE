const mongoose = require('mongoose');
const paspportLocalMongoose  = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(paspportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);