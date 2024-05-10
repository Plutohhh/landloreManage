const express = require("express")
const router = express.Router()
const RoomModel = require("../../models/RoomModel")

// 增加room
router.post("/addRoom", function (req, res) {
  // 接收请求参数,使用模型插入数据库,最后返回json结果
  RoomModel.create({ ...req.body }, (err, data) => {
    if (err) {
      if (err.name === "ValidationError") {
        return res.status(400).json({
          code: "400",
          msg: err._message
        })
      } else {
        return res.status(500).json({
          code: "500",
          msg: err.message
        })
      }
    }
    res.status(200).json({
      code: "200",
      msg: "success",
      data
    })
  })
})

// 删除room
router.delete("/:roomNumber", function (req, res) {
  const roomNumber = req.params.roomNumber
  // 更新数据库中匹配的房间记录
  RoomModel.findOneAndUpdate(
    // 查询条件：房间号匹配且 isRenting 为 true
    { roomNumber: roomNumber, isRenting: true },
    // 更新字段：将 isRenting 修改为 false
    { $set: { isRenting: false } },
    // 设置选项：返回更新后的记录，并且设置 new 为 true
    { new: true },
    // 回调函数处理更新结果
    (err, updatedRoom) => {
      if (err) {
        return res.status(500).json({
          code: 500,
          msg: "Internal Server Error",
          data: err
        })
      }
      if (!updatedRoom) {
        return res.status(404).json({
          code: 404,
          msg: "Room not found or already not renting",
          data: null
        })
      }
      res.status(200).json({
        code: 200,
        msg: "Room deleted successfully",
        data: updatedRoom
      })
    }
  )
})

// 查询room列表
router.get("/getlist", function (req, res) {
  console.log("请求了getlist")
  RoomModel.find({ isRenting: true }).exec((err, data) => {
    console.log("查询了数据库")
    if (err) {
      return res.json({
        code: "500",
        msg: "fail",
        data
      })
    }
    res.json({
      code: "200",
      msg: "success",
      data: data
    })
  })
})

// 按id查询单个room
router.get("/:id", function (req, res) {
  const id = req.params.id
  RoomModel.find({ _id: id }).exec((err, data) => {
    if (err) {
      return res.json({
        code: "500",
        msg: "fail",
        data
      })
    }
    res.json({
      code: "200",
      msg: "success",
      data: data
    })
  })
})

// 编辑room
router.patch("/:id", function (req, res) {
  const id = req.params.id
  RoomModel.updateOne({ _id: id }, req.body, (err, data) => {
    if (err) {
      return res.json({
        code: "500",
        msg: "fail",
        data
      })
    }
    res.json({
      code: "200",
      msg: "success",
      data: data
    })
  })
})

// 编辑room
router.put("/:roomNumber", function (req, res) {
  const roomNumber = req.params.roomNumber
  const { renterName, phone, deposit, isRenting, rentCost } = req.body

  // 构造更新字段对象
  const updateFields = {}
  if (renterName) updateFields.renterName = renterName
  if (phone) updateFields.phone = phone
  if (deposit) updateFields.deposit = deposit
  if (deposit) updateFields.rentCost = rentCost

  // 更新数据库中匹配的房间记录
  RoomModel.findOneAndUpdate(
    // 查询条件：房间号匹配且 isRenting 为 true
    { roomNumber: roomNumber, isRenting: true },
    // 更新字段
    { $set: updateFields },
    // 设置选项：返回更新后的记录，并且设置 new 为 true
    { new: true },
    // 回调函数处理更新结果
    (err, updatedRoom) => {
      if (err) {
        return res.status(500).json({
          code: 500,
          msg: "Internal Server Error",
          data: err
        })
      }
      if (!updatedRoom) {
        return res.status(404).json({
          code: 404,
          msg: "Room not found or already not renting",
          data: null
        })
      }
      res.status(200).json({
        code: 200,
        msg: "Room updated successfully",
        data: updatedRoom
      })
    }
  )
})

// 导出路由
module.exports = router
