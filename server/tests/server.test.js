const {ObjectID}=require('mongodb');
const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {populateTodos,todos,users,populateUsers}= require("./seed/seed");
const {User}=require("./../models/user");


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);

          done();
        }).catch((e) => done(e));
      });
  });
});
describe("GET/todos",()=>{
  it("should get all todos ",(done)=>{
    request(app)
    .get("/todos")
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});


  describe("GET/todos/:id",()=>{
    it("should return todo doc ",(done)=>{
  request(app)
  .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
    });
  });


describe("DELETE/todos/:id",()=>{
  it("should remove a todo",(done)=>{
    var hexId= todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(hexId);
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }
Todo.findById(hexId).then((todo)=>{
  expect(todo).toNotExist();
  done();
}).catch((e)=>done(e));
    });
  });
});

// it("should send 404 if todo not found",(done)=>{
//
// });
//
// it("should reutrn 404 if object id is invalid",(done)=>{
//
// });
//

describe("PATCH/todos/:id",()=>{
  it("should update todo",(done)=>{
    var hexId=todos[0]._id.toHexString();
    var text="this is the nes text";
    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed:true,
      text:text
    })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
        })
      .end(done);
    });

  it("sould clear completedAt when todo is not completed ",(done)=>{
    var hexId=todos[1]._id.toHexString();
    var text="this is the nes text";
    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed:false,
      text:text
    })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
        })
      .end(done);
    });
  });

  describe("GET/users/me",()=>{
    it("should return user if autheticated",(done)=>{
    request(app)
    .get('/users/me')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
})
it("should return 401 if not authenticated",(done)=>{
  request(app)
  .get('/users/me')
  .expect(401)
  .expect((res)=>{
    expect(res.body).toEqual({});
  })
  .end(done);
})
  });



describe("POST/user",()=>{
it("should create the user",(done)=>{
  var email="example@example.com";
  var password="123abc!";
  request(app)
  .post('/users')
  .send({email,password})
  .expect((res)=>{
    expect(res.headers["x-auth"]).toExist();
    expect(res.body.email).toBe(email);
    expect(res.body._id).toExist();
    })
    .end((err)=>{
      if(err){
        return done(err);
      }

      User.findOne({email}).then((user)=>{
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done()
      })
    });
});

it("should create validation error if rwquest invalid",(done)=>{
request(app)
.post('/users')
.send({
  email:'and',
  pass:'123'
})
.expect(400)
.end(done)
});
it("should not create the user already exists",(done)=>{
request(app)
.post('/users')
.send({
  email:users[0].eamil,
  password:'aseppd'
})
.expect(400)
.end(done)
});

});



describe("POST/users/login",()=>{
  it("should login user and return the token",(done)=>{
    request(app)
    .post('/users/login')
    .send({
      email:users[1].email,
      password:users[1].password
    })
.expect(200)
.expect((res)=>{
  expect(res.header['x-auth']).toExist();
})

.end((err,res)=>{
  if(err){
    return done(err);
  }
User.findById(users[1]._id).then((user)=>{
  expect(user.tokens[0]).toInclude({
    access:"auth",
    token:res.headers['x-auth']
  });
  done();
}).catch((e)=>done(e));

});

  });
});


describe("DELETE/users/me/token",()=>{
  it("should remove the auth token and logout",(done)=>{
    request(app)
    .delete('/users/me/token')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      User.findById(users[0]._id).then((user)=>{
        expect(user.tokens.length).toBe(0);
        done();

      }).catch((e)=>done(e));
    })
  })
});
