const express = require("express")
const router = express.Router()
const RentalModel = require("../../models/RentalModel")
const RoomModel = require("../../models/RoomModel")

// 联合查询rental\room
router.post("/getRentalRoom", async function (req, res) {
  const rentalVersion = req.body.rentalVersion
  try {
    // 房租表数据
    let rentalData = await RentalModel.find({
      rentalVersion: rentalVersion
    }).exec()
    // 租客表数据
    const roomData = await RoomModel.find({ isRenting: true }).exec()

    rentalData = rentalData.map((item) => {
      const result = JSON.parse(JSON.stringify(item))
      const findData = roomData.find(
        (room) => room.roomNumber === item.roomNumber
      )
      if (findData) {
        result.rentCost = findData.rentCost
      }
      return result
    })
    res.status(200).json({
      code: 200,
      msg: "success",
      data: rentalData
    })
  } catch (err) {
    res.status(500).json({
      code: 500,
      msg: "error",
      data: err
    })
  }
})

// 查询房租表rental
router.post("/getRental", function (req, res) {
  const rentalVersion = req.body.rentalVersion
  RentalModel.find({ rentalVersion: rentalVersion }).exec((err, data) => {
    if (err) {
      return res.status(500).json({
        code: 500,
        msg: "error",
        data: err
      })
    }
    if (data.length === 0) {
      let paramData = []
      const moduleData = {
        electricityPrice: 1, // 电费
        waterPrice: 5, // 水费
        rentalVersion: rentalVersion,
        isPay: false
      }
      for (let i = 101; i <= 601; i += 100) {
        paramData.push({ roomNumber: i, ...moduleData })
        paramData.push({ roomNumber: i + 1, ...moduleData })
      }
      // 如果查询2024-1没数据,就造数据
      //   样例:[ { "roomNumber": 101, "electricityPrice": 1, "waterPrice": 5 }... ]
      RentalModel.create(paramData, (err, savedData) => {
        if (err) {
          return res.status(500).json({
            code: 500,
            msg: "error",
            data: err
          })
        }
        res.status(200).json({
          code: 200,
          msg: "success",
          data: savedData
        })
      })
    } else {
      res.status(200).json({
        code: 200,
        msg: "success",
        data: data
      })
    }
  })
})

// 编辑room
router.patch("/:id", function (req, res) {
  const id = req.params.id
  RentalModel.updateOne({ _id: id }, req.body, (err, data) => {
    if (err) {
      return res.status(500).json({
        code: 500,
        msg: "Internal Server Error",
        data: err
      })
    }
    res.json({
      code: "200",
      msg: "success",
      data: data
    })
  })
})

// 导出路由
module.exports = router
