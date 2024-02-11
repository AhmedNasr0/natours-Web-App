

class APIFeature{
    mongoQuery: any;
    queryStr:any;
    constructor(mongoQuery:any,queryStr:any){
      this.mongoQuery=mongoQuery
      this.queryStr=queryStr
    }
    filter(){
      const queryObj:any={...this.queryStr}
      const excluded:string[]=['sort','page','field','limit'];
      excluded.forEach(el=> delete queryObj[el]);
      let querystr:string=JSON.stringify(queryObj)
      querystr=querystr.replace(/\b(gte|gt|lt|lte)\b/g,match=> `$${match}`);
      
      this.mongoQuery=this.mongoQuery.find((JSON.parse(querystr)))
      return this
    }
    sort(){
      if(this.queryStr.sort){
        let sort:string=(this.queryStr.sort as string).split(',').join(' ');
        this.mongoQuery=this.mongoQuery.sort(sort);
      }
      else{
        this.mongoQuery=this.mongoQuery.sort('-createAt');
      }
      return this
    }
    field(){
      if(this.queryStr.field){
        let field:string=(this.queryStr.field as string ).split(',').join(' ');
        this.mongoQuery=this.mongoQuery.select(field);
      }
      else{
        this.mongoQuery=this.mongoQuery.select('-__v');
      }
      return this 
    }
     pagginate(){
          let page:number = (this.queryStr.page as unknown as number) *1 || 1 ;
          let limit:number= (this.queryStr.limit as unknown as number)|| 5;
          let skip:number=(page -1 ) * limit
          this.mongoQuery=this.mongoQuery.skip(skip).limit(limit)
  
      return this
    }
  }
export default APIFeature