'use strict';
let mongoose = require('mongoose'),
    config = require('../config/config'),
    userSchema = new mongoose.Schema({email: String, jsonwebtoken: String});

userSchema.statics.findJwtUserByEmail = function (email, cb) {
    User.findOne({email: email}, {email: 1}, cb);
};

userSchema.statics.createUser = function (email, cb) {
    let admin = false;
    if (email === config.admin) admin = true;

    User.create({email: email, admin: admin},cb);
};

let User = mongoose.model("User", userSchema);

//noinspection SillyAssignmentJS,JSClosureCompilerSyntax,JSValidateJSDoc
/**
 * Find a user
 * @type {((conditions:Object, projection:Object, callback?:(err:any, res:T)=>void)=>"mongoose".DocumentQuery<T, T>)|((conditions:Object, projection:Object, options:Object, callback?:(err:any, res:T)=>void)=>"mongoose".DocumentQuery<T, T>)|((conditions?:Object, callback?:(err:any, res:T)=>void)=>"mongoose".DocumentQuery<T, T>)}
 */
User.findOne = User.findOne;
User.findJwtUserByEmail = User.findJwtUserByEmail;

module.exports = User;
