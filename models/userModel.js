const { default: mongoose } = require("mongoose");
const validator=require('validator')
const bcrypt=require('bcryptjs')
const crypto=require('crypto')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Tell us Your name !"]
    },
    email:{
        type:String,
        required:[true,'Please Provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"Please Provide a valid email!"]
    },
    photo:{
        type:String ,
        default:'default.jpg'
    },
    password:{
        type:String,
        minlength:['6','Password Should be More Than 6 characters'],
        required:[true,"Password Required"]
    },
    confirmPassword:{
        type:String,
        required:[true,"Please Confirm Your Password"],
        validate:{
            validator:function(el){
                return el===this.password
            },
            message:"Password doesn't Match"
        }
    },
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin']
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpire:String
},{timestamps:true})

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,12);
        this.confirmPassword=undefined 
        next()
    }
    else next()
})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')||this.isNew) return next()
    this.passwordChangedAt=Date.now()
    next()
})

userSchema.methods.correctPassword=async function(candidatePass,userPass){   
    return await bcrypt.compare(candidatePass,userPass)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
  };

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const userModel= mongoose.model('user',userSchema);

module.exports=userModel