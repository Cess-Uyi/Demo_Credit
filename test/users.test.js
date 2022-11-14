const chai = require("chai");
const chaiHttp = require("chai-http");
const server = "http://localhost:3000/api/v1";
const expect = chai.expect;
// const assert = chai.assert;
let should = chai.should();
chai.use(chaiHttp);
const user = require("../controllers/userController");


/* test the POST route */
describe("Signup API", () => {
  it("it should POST a new user", (done) => {
    const user = {
      firstName: "john",
      lastName: "doe",
      email: "johndoe07@gmail.com",
      password: "ABcd1234.",
    };
    chai
      .request(server)
      .post("/users/register")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(user)
      .end((error, res, body) => {
        console.log(res.body);
        
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.data.should.have.property("token");
        res.body.data.should.have.property("user");
        res.body.data.should.have.property("wallet");
        
        res.body.data.user.should.have.property("id");
        res.body.data.user.should.have.property("first_name");
        res.body.data.user.should.have.property("last_name");
        res.body.data.user.should.have.property("email");
        
        res.body.should.not.have.property("error");
        done();
      });
  });
});

describe("Login API", () => {
  it("Should successfully log a user in", (done) => {
    const user = {
      email: "johndoe1@gmail.com",
      password: "ABcd1234.",
    };
    chai
      .request(server)
      .post("/users/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(user)
      .end((error, res, body) => {
        console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.data.should.have.property("token");
        res.body.should.not.to.be.empty
        done();
      } )
  });
});
