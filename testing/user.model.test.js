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