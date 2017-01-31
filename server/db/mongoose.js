var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
let db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: 'mongodb://<nodetodoapi>:<Qwertyui@324>@ds137749.mlab.com:37749/node-todo-api'
};
mongoose.connect( db.localhost || db.mlab);

module.exports = {mongoose};
