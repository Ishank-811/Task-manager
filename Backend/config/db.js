const mongoose = require("mongoose");

const connection = function () {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(
      "mongodb+srv://ishankgoel811:Ishank123@cluster0.vpmzkx8.mongodb.net/?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(function (e) {
      console.log("connected successfully");
    })
    .catch(function (e) {
      console.log(e);
    });
};

module.exports = connection;
