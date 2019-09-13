// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const requsetPromise = require('request-promise')
const url = 'http://musicapi.xiecheng.live/personalized'
const db = cloud.database()
const playListCollection = db.collection('playlist')
const MAX_LIMIT = 100 //  每次最多只能读取100条数据
// 云函数入口函数
exports.main = async(event, context) => {
  const playListNew = await requsetPromise(url).then(res => {
    return JSON.parse(res).result
  })
  // console.log("pl===>plNew",playListNew)

  //  分批读取数据库中的歌单数据
  const dataCount = (await playListCollection.count()).total
  const batchTimes = Math.ceil(dataCount / MAX_LIMIT)
  let tasks = []
  let playListDB = []

  for (let i = 0; i < batchTimes; i++) {
    let promise = playListCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  if (tasks.length > 0) {
    playListDB = (await Promise.all(tasks)).reduce((acc, cur) => {
      return acc.data.concat(cur.data)
    }).data
    // console.log("plDB====>",playListDB)
  }

  // 检查重复数据
  const filtedData = []
  for (let i of playListNew) {
    let duplicated = false
    for (let j of playListDB) {
      if (j.id === i.id) {
        console.log(j.id, '<===重复===>', i.id)
        duplicated = true
        break
      }
    }
    if (!duplicated) {
      filtedData.push(i)
    }
  }
  console.log(`新增${filtedData.length}条数据`)

  //插入数据库
  for (let item of filtedData) {
    await playListCollection.add({
      data: {
        ...item,
        createdTime: db.serverDate()
      }
    }).then(res => {
    }).catch(err => {
      console.log(err)
    })
  }

  return filtedData.length
}