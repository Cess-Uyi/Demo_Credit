const chai = require("chai");
const chaiHttp = require("chai-http");
// const request = require("supertest");
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
      email: "johndoe38@gmail.com",
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
        console.log(
          "TYPE: ",
          typeof res.body.data.user,
          Object.keys(res.body.data.user).length
        );
        // res.body.should.have.property("id");
        // res.body.should.have.property("first_name").eq("John");
        // res.body.should.have.property("last_name").eq("Doe");
        // res.body.should.have.property("email").eq("johndoe11@gmail.com");
        // res.body.should.have.property("password");
        res.body.should.not.have.property("error");
        done();
      });
  });
});

// describe("Login API", () => {
//   it("Should successfully log a user in", (done) => {
//     const user = {
//       email: "test68@gmail.com",
//       password: "ABcd1234.",
//     };
//     chai
//       .request(server)
//       .post("/users/login")
//       .set("Accept", "application/json")
//       .set("Content-Type", "application/json")
//       .send(user)
//       .end((error, res, body) => {
//         res.should.have.status(200);
//         res.body.should.be.a("object");
//         res.body.data.should.have.property("token");
//         res.body.should.not.to.be.empty
//         console.log(res.body);
//         done();
//       } )
//   });
// });
