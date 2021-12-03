const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
    username: {required: true, type: String},
    email: {required: true, type: String},
    password: {required: true, type: String},
    avatar: {type: String, default: null},
    tracks: [],
    likes: [],
    following: [],
    followers: [],
});

UserSchema.pre('save', async function(next){

    if(!this.isModified('password')){
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next();
      } catch (e) {
        return next(e);
      }

});


UserSchema.methods.isPasswordMatch = function (password, hashed, callback){
    bcrypt.compare(password, hashed, (err, success)=>{
        if(err){
          return callback(err);
        }
  
        callback(null, success);
    });
  };

  UserSchema.methods.toJSON = function(){
    const userObject = this.toObject(); 
    delete userObject.password;
    return userObject; 
  };

module.exports = mongoose.model('User', UserSchema)