const express = require("express")
const router = express.Router()
const RentalModel = require("../../models/RentalModel")
const RoomModel = require("../../models/RoomModel")
const shortid = require("shortid")

// 删除rental表中的所有数据
router.delete("/all", async (req, res) => {
  try {
    await RentalModel.deleteMany({})
    res.status(200).json({
      code: 200,
      msg: "All rental data deleted successfully"
    })
  } catch (err) {
    res.status(500).json({
      code: 500,
      msg: "Internal Server Error",
      data: err
    })
  }
})

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
    console.log("rentalData.length", rentalData.length)
    // 如果对应年月没有房租数据（之前没查询过）就造数据
    if (rentalData.length === 0) {
      const moduleData = {
        electricityPrice: 1, // 电费
        waterPrice: 6, // 水费
        rentalVersion: rentalVersion, // 年月
        isPay: false // 是否交租
      }
      for (let i = 101; i <= 601; i += 100) {
        rentalData.push({
          id: shortid.generate(), // id
          roomNumber: i, // 房号
          ...moduleData
        })
        rentalData.push({
          id: shortid.generate(), // id
          roomNumber: i + 1, // 房号
          ...moduleData
        })
      }
      RentalModel.create(rentalData, (err, savedData) => {
        if (err) {
          return res.status(500).json({
            code: 500,
            msg: "error",
            data: err
          })
        }
      })
    }
    rentalData = rentalData.map((item) => {
      const result = JSON.parse(JSON.stringify(item))
      // 遍历租客表，插入对应的房租rentCost到房租表
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
// router.post("/getRental", function (req, res) {
//   const rentalVersion = req.body.rentalVersion
//   RentalModel.find({ rentalVersion: rentalVersion }).exec((err, data) => {
//     if (err) {
//       return res.status(500).json({
//         code: 500,
//         msg: "error",
//         data: err
//       })
//     }
//     if (data.length === 0) {
//       let paramData = []
//       const moduleData = {
//         electricityPrice: 1, // 电费
//         waterPrice: 6, // 水费
//         rentalVersion: rentalVersion,
//         isPay: false
//       }
//       for (let i = 101; i <= 601; i += 100) {
//         paramData.push({ roomNumber: i, ...moduleData })
//         paramData.push({ roomNumber: i + 1, ...moduleData })
//       }
//       // 如果查询2024-1没数据,就造数据
//       //   样例:[ { "roomNumber": 101, "electricityPrice": 1, "waterPrice": 5 }... ]
//       RentalModel.create(paramData, (err, savedData) => {
//         if (err) {
//           return res.status(500).json({
//             code: 500,
//             msg: "error",
//             data: err
//           })
//         }
//         res.status(200).json({
//           code: 200,
//           msg: "success",
//           data: savedData
//         })
//       })
//     } else {
//       res.status(200).json({
//         code: 200,
//         msg: "success",
//         data: data
//       })
//     }
//   })
// })

// 编辑room
router.patch("/:id", function (req, res) {
  const id = req.params.id
  RentalModel.updateOne({ id: id }, req.body, (err, data) => {
    if (err) {
      return res.status(500).json({
        code: 500,
        msg: "Internal Server Error",
        data: err
      })
    }
    res.json({
      code: 200,
      msg: "success",
      data: data
    })
  })
})

// 更新所有记录的 waterPrice，根据传入的值 x
router.post("/updateWaterPrice", async function (req, res) {
  const waterPrice = Number(req.body.waterPrice)
  if (isNaN(waterPrice)) {
    return res.status(500).json({
      code: 500,
      msg: "Invalid input: waterPrice must be a valid number",
      data: null
    })
  }

  try {
    const updateResult = await RentalModel.updateMany(
      {}, // 空的过滤条件，匹配所有文档
      { $set: { waterPrice: waterPrice } }
    )

    res.status(200).json({
      code: 200,
      msg: `All water prices updated to ${waterPrice}`,
      data: updateResult
    })
  } catch (err) {
    res.status(500).json({
      code: 500,
      msg: "Internal Server Error",
      data: err
    })
  }
})

// 导出路由
module.exports = router
