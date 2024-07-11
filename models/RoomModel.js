// 租客表
const mongoose = require("mongoose")

// 创建Schema概要
const roomSchema = new mongoose.Schema({
  roomNumber: {
    // 房号
    type: Number,
    require: true
  },
  renterName: String, // 租客名
  phone: Number, // 手机号
  deposit: Number, // 押金
  rentCost: Number, // 房租
  isRenting: Boolean // 是否在租
})

// 创建model模型
const roomModel = mongoose.model("room", roomSchema)

module.exports = roomModel
