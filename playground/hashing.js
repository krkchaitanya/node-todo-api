const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

var password="123abc";

bcrypt.genSalt(10,(err,salt)=>{
  bcrypt.hash(password,salt,(err,hash)=>{
    console.log(hash);
  })
});

// var data={
//   id:10
// };



// var token=jwt.sign(data,'abc123');
// console.log(token);
//
//
// var decoded=jwt.verify(token,'abc123');
// console.log("decoded",decoded);
// var message="i am user no 3";
// var hash= SHA256(message).toString();
//
// console.log(`message:${message}`);
// console.log(`hash: ${hash}`);
