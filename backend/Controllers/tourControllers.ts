import {Response,NextFunction, Request} from 'express'

export const CheckID=(req:Request,res:Response,next:NextFunction,val:unknown)=>{

}



export const getAllTour=(req:Request,res:Response)=>{
    // console.log(req.requestTime);
    res.status(200).json({
        status:'success',
        // result:tours.length,
        data:{
            // req.user.id,
        }
    })
}
export const getTour=(req:Request,res:Response,next:NextFunction)=>{
    const id = req.params.id;

  res.status(200).json({
    status: 'success',
    // data: {
    //   tour
    // }
  });
}
export const createTour = (req:Request, res:Response) => {
        res.status(201).json({
          status: 'success',
          data: {
            // tour: newTour
          }
        });
}
  
export const updateTour = (req:Request, res:Response) => {
    res.status(200).json({
      status: 'success',
      data: {
        // tour: '<Updated tour here...>'
      }
    });
};
  
export const deleteTour = (req:Request, res:Response) => {
    res.status(204).json({
      status: 'success',
      data: null
    });
  };