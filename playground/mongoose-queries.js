  const {mongoose}=require('./../server/db/mongoose');
const {Todo}=require('./../server/models/todo');
const {ObjectID}=require('mongodb');
const {User}=require('./../server/models/user');

// var id="588ea4808677b50811449273";
//
// if(!ObjectID.isValid(id)){
//   console.log('id not valid');
// }
// Todo.find({
//   _id:id
// }).then((todos)=>{
//   console.log("todos",todos);
// });
//
// Todo.findOne({
//   _id:id
// }).then((todo)=>{
//   console.log("todo",todo);
// });

// Todo.findById(id).then((todo)=>{
//   if(!todo){
//     return console.log("id not found");
//   }
//   console.log("todo:",todo);
// }).catch((e)=>console.log(e));

User.findById("588fcc66191fc0b012a16324").then((user)=>{
  if(!user){
    console.log("unable to find the user");
  }
  console.log(JSON.stringify(user,undefined,2));
},(e)=>{
  console.log(e);
});
