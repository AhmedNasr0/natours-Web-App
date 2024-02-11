import jwt from 'jsonwebtoken'

export const verifyToken=async (token:any)=>{
    return await jwt.verify(token ,`${process.env.JWT_SECRET}`)
}