const { exec } = require("child_process");

class CICDControllers {
  async push ({ body }) {
    const res = await new Promise((resolve, reject) => {
      try {
        exec("./hooks/push.sh", (error, stdout, stderr) => {
          console.log({ error, stdout, stderr })
          if (error) {
            reject(error)
          } else {
            resolve({ stdout })
          }
        })
      } catch (ex) {
        reject(ex)
      }
    })
    return res
  }
}

module.exports = CICDControllers