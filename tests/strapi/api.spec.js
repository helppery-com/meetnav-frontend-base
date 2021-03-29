process.env.BACKEND_URL = 'http://localhost:1337'
import Api from '../../quasar/src/store/api'
var expect  = require("chai").expect

const api = new Api()
describe("Test API", function() {
  it("check url", async function() {
    expect(api.url).to.equal(process.env.BACKEND_URL)
  })
})