const { exec } = require("child_process");

class CICDControllers {
  async push ({ body }) {
    const res = await new Promise((resolve, reject) => {
      exec("./hooks/push.sh", (error, stdout, stderr) => {
        console.log({ error, stdout, stderr })
        if (error) {
          reject()
        } else {
          resolve({ stdout })
        }
      })
    })
    return res
  }
}

module.exports = CICDControllers