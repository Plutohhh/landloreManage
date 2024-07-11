// 导入mongoose
const mongoose = require("mongoose")

// 创建Schema概要
const rentalSchema = new mongoose.Schema({
  id: String,
  roomNumber: {
    type: Number,
    require: true
  },
  electricity: Number, // 电量
  water: Number, // 水量
  electricityPrice: Number, // 电单位价格（后端自定）
  waterPrice: Number, // 水单位价格（后端自定）
  electricityCost: Number, // 电费
  waterCost: Number, // 水费
  environmentCost: Number, // 卫生费（未使用）
  updateTime: Date, // 更新时间（未使用）
  rentalVersion: String, // 年月
  isPay: Boolean, // 是否交租
  actualRental: Number, // 实际房租
  remark: String // 备注
})

// 创建model模型
const rentalModel = mongoose.model("rental", rentalSchema)

module.exports = rentalModel
