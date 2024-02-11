

export interface ITour{
    name:string,
    ratingsAverage:number,
    price:number ,
    imageCover:string,
    images:string[],
    createAt:Date,
    startDates:Date[],
    description:string,
    difficulty:string,
    summary:string,
    maxGroupSize:number,
    duration:number,
    priceDiscount:number,
    ratingsQuantity:number,
    startLocation:Object,
    locations:Object[],
    guides:Object[]
}
export default ITour