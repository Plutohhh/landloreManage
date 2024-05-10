// 导入mongoose
const mongoose = require("mongoose")

// 创建Schema概要
const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    require: true
  },
  renterName: String,
  phone: Number,
  deposit: Number,
  rentCost: Number,
  isRenting: Boolean
})

// 创建model模型
const roomModel = mongoose.model("room", roomSchema)

module.exports = roomModel
