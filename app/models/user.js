'use strict';
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({email: String,jsonwebtoken:String});
userSchema.statics.findJwtUserByEmail = function (email, cb) {
    User.findOne({email: email}, {email: 1},cb);
};


var User = mongoose.model("User", userSchema);

//noinspection SillyAssignmentJS,JSClosureCompilerSyntax,JSValidateJSDoc
/**
 * Find a user
 * @type {((conditions:Object, projection:Object, callback?:(err:any, res:T)=>void)=>"mongoose".DocumentQuery<T, T>)|((conditions:Object, projection:Object, options:Object, callback?:(err:any, res:T)=>void)=>"mongoose".DocumentQuery<T, T>)|((conditions?:Object, callback?:(err:any, res:T)=>void)=>"mongoose".DocumentQuery<T, T>)}
 */
User.findOne = User.findOne;
User.findJwtUserByEmail = User.findJwtUserByEmail;

module.exports = User;
