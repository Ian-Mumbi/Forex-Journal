const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost/ForexAppDevelopment", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});