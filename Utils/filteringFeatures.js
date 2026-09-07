class FilteringFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const exculdedFields = ["sort", "limit", "page", "fields"];

    exculdedFields.forEach((el) => delete queryObj[el]);

    const JobsRegexFields = ["title", "company", "type", "location", "skills"];

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|lt|gte|lte|eq)\b/g,
      (match) => `$${match}`,
    );
    const jsonParsedQuery = JSON.parse(queryStr);

    JobsRegexFields.forEach((f) => {
      if (jsonParsedQuery[f]) {
        const fieldValuesArray = jsonParsedQuery[f].split(",");
        const condition = fieldValuesArray.map(
          (el) => new RegExp(el.trim(), "i"),
        );
        jsonParsedQuery[f] = {
          $in: condition,
        };
      }
    });
    console.log(jsonParsedQuery);
    this.query = this.query.find(jsonParsedQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort.split(",").join(" "));
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      this.query = this.query.select(
        this.queryString.fields.split(",").join(" "),
      );
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;

    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = FilteringFeatures;
