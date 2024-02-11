
const jwt=require('jsonwebtoken')

export const generateToken=(payload:any)=>{
    let token=jwt.sign(payload,process.env.JWT_SECRET)
    return token 
}
