

export interface IUser{
    name:string,
    email:string,
    photo:string,
    password:string,
    passwordConfirm:string,
    passwordChangeAt:Date,
    role:'user'|'guid'|'lead-guid'|'admin',
    passwordResetToken:String ,
    passwordResetExpire:Date,
    active:boolean
}