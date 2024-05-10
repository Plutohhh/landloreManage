// 导入mongoose
const mongoose = require("mongoose")

// 创建Schema概要
const rentalSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    require: true
  },
  electricity: Number,
  water: Number,
  electricityPrice: Number,
  waterPrice: Number,
  electricityCost: Number,
  waterCost: Number,
  environmentCost: Number,
  updateTime: Date,
  rentalVersion: String,
  isPay: Boolean,
  actualRental: Number,
  computedRental: Number,
  remark: String
})

// 创建model模型
const rentalModel = mongoose.model("rental", rentalSchema)

module.exports = rentalModel
