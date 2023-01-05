class ApiFeatures {
  constructor(query, queryStr) {
    //Query is the url which we send before the query string
    this.query = query;
    // it is the string which a user miught search like samosa , hat , ball etc . Example - "URL/?keyword=ball"
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", //it means case insentive,
          },
        }
      : {};
    // console.log(keyword); // TO SEE THE KEYWORD

    this.query = this.query.find({ ...keyword });
    // console.log("THe class which is returned", this); TO SEE THE WHOLE CLASS VALUE
    return this;
  }

  filter() {
    //making an actual copy of {this.queryStr}.
    const queryCopy = { ...this.queryStr };

    // Removing same fields fo category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]); // we are deleting the above string present in the object beacuase we dont need that to come while filteration

    // Filter for price and rating
    let queryStr = JSON.stringify(queryCopy);
    //gte = greater than equal to , gt greater than . likewise
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage){

    const currentPage = Number (this.queryStr.page) || 1;
    //LOGIC
    //Suppose their is 50 products
    // we need to show 10 on each page
    // so we will show 10 in first page and then skip first 10 product for the 2nd page and first 20 products for the 3rd page

    const skip = resultPerPage * (currentPage - 1)
    //LOGIC resultPerPage = 10
    //1st page  = 10 * (1 - 1) == 0 . So 0 products skip
    //2nd page = 10 * (2 - 1) == 10 . So 10 products skipped
    //3rd page = 10 * (3 - 1) == 20 . So 20 prodcuts skipped

    this.query = this.query.limit(resultPerPage).skip(skip);
    //Above funtion will take the query and will limit the number of products in the page and skip the products according

    return this;
  }
}

module.exports = ApiFeatures;
