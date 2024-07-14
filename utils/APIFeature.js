
const excludedFieldsFromQueryString=['page','sort','limit','fields']
class ApiFeature{
    constructor(mongoQuery,queryString){
        this.mongoQuery=mongoQuery
        this.queryString=queryString
    }
    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
    
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
        this.mongoQuery = this.mongoQuery.find(JSON.parse(queryStr));
    
        return this;
    }
    sort(){
        if(this.queryString.sort){
            const sort=this.queryString.sort.split(',').join(' ')
            this.mongoQuery=this.mongoQuery.sort(sort)
        }else{
            this.mongoQuery=this.mongoQuery.sort('-createdAt')
        }
        return this 
    }
    fields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongoQuery = this.mongoQuery.select(fields);
        } else {
            this.mongoQuery = this.mongoQuery.select('-__v');
        }
        return this 
    }
    paginate(){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.mongoQuery=this.mongoQuery.skip(skip).limit(limit)
        return this 
    }
}
module.exports=ApiFeature