const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const dbtype = process.env.dbtype ? 'mongo' : 'localhost'
mongoose.connect('mongodb://' + dbtype + '/testUser', {
  useNewUrlParser: true
})
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database`)
})

// Initial Test Running
describe("initial test", () => {
  it("runs successfully", () => {
    expect(true).toEqual(true)
  })
})

// Close Database Connection
afterAll(async () => {
  try {
    await mongoose.connection.close()
  } catch (err) {
    console.log(err)
  }
})

const User = require('../../UserModelMongoose/model/user.model')

// Test if user schema contains username and email
describe("User Model", () => {
  it("has username and email attributes", () => {
    let expectedKeys = ["username", "email"]
    let keys = Object.keys(User.schema.paths)
    let userAttributes = [keys[0], keys[1]]
    expect(userAttributes).toStrictEqual(expectedKeys)
  })
})

// Create a User Object
it("should create a new user", async () => {
  try {
    const user = new User({
      username: "john",
      email: "john@smith.info"
    })
    let result = await user.save()
    expect(result.username).toEqual(user.username)
    expect(result.email).toEqual(user.email)
  } catch (err) {
    throw new Error(err)
  }
})

// Delete all documents after test
afterEach(async () => {
  try {
    await User.deleteMany({})
  } catch (err) {
    console.log(err)
  }
})

// Throw error if username is empty
it("should throw an error if the username field is empty", async () => {
  try {
    await new User({
      username: "",
      email: "john@smith.info"
    }).save()
  } catch (err) {
    expect(err.errors.username.kind).toEqual("required")
  }
})

// Unique User
it("should throw an error on save if two users use the same email", async () => {
  try {
    await new User({
      username: "sam",
      email: "sam@ed.info"
    }).save()
    await new User({
      username: "tom",
      email: "sam@ed.info"
    }).save()
  } catch (err) {
    expect(err.code).toEqual(11000)
  }
})

// User with invalid email address
it("should throw an error if the email is invalid", async () => {
  try {
    await new User({
      username: "john",
      email: "johnsmith.info"
    }).save()
  } catch (err) {
    expect(err.errors.email.message).toEqual("Please give a valid email address")
  }
})