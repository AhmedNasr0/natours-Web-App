import { Request } from "express"

interface customRequest extends Request{
    user:any 
}

export default  customRequest