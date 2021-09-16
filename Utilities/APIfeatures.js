// const Tour = require("../Models/tourModel")

class ApiFeatures{
   constructor(query,queryString){
       this.query = query
       this.queryString = queryString
   }

   filter(){
//? This is a query filter
       
       const queryObj = {...this.queryString}
       const excluded = ['page','limit','sort','fields']

       excluded.forEach(el=> delete queryObj[el])

//? Advance Query Filtering

       let queryStr = JSON.stringify(queryObj)
       queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`)
      
       this.query = this.query.find(JSON.parse(queryStr))
       return this
   }
//? Sorting 
      sort(){
        if(this.queryString.sort){
            let sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort("-createdAt")
        }
        return this
      }
       
    
// //? Fields Limiting
       limit(){
        if(this.queryString.fields){
            let fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        }else{
            this.query = this.query.select('-__v')
        }
        return this
       }
       

// //? Pagination
        page(){
        
        let page = this.queryString.page * 1 || 1
        let limit = this.queryString.limit || 100
        let skip = (page - 1) * 10

        this.query = this.query.skip(skip).limit(limit)
       
        
        //! warning
        // if(this.queryString.page){
        //     let numOfTours = Tour.countDocuments()
        //     if(numOfTours >= skip) throw new Error("there is no page")

        // }
        return this
        }
        
      

      
       

   
}

module.exports =  ApiFeatures