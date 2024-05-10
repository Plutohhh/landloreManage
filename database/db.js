// 数据库连接函数（启动项目必调用）
module.exports = function (success, error) {
  // 导入mongoose
  const mongoose = require("mongoose")
  // 导入配置项
  const { DBHOST, DBPORT, DBNAME } = require("../config/config")
  // 严格查询模式
  mongoose.set("strictQuery", true)

  // 连接mongo数据库
  mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`)

  mongoose.connection.once("open", () => {
    success()
  })

  mongoose.connection.on("error", () => {
    error()
  })

  mongoose.connection.once("close", () => {
    console.log("关闭数据库连接")
  })
}
