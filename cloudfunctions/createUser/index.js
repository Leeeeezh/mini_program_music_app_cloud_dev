// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const userCollection = db.collection('user')
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  console.log(openId)
  let res = await userCollection.where({
    openId: openId
  }).get()
  console.log(res)
  if (res.data.length === 0) {
    await userCollection.add({
      data: {
        openId: openId,
        ...event.userInfo,
        myPlayList: [{
          "name": "一场游戏一场梦",
          "id": 158924,
          "pst": 0,
          "t": 0,
          "ar": [{
            "id": 5358,
            "name": "王杰",
            "tns": [],
            "alias": []
          }],
          "alia": ["电影《黄色故事》插曲"],
          "pop": 100,
          "st": 0,
          "rt": "600902000005313003",
          "fee": 8,
          "v": 35,
          "crbt": "39b0d0b85393f16c0fae99f91e6974d8",
          "cf": "",
          "al": {
            "id": 15964,
            "name": "一场游戏一场梦",
            "picUrl": "http://p2.music.126.net/rE9zmPhDR8Kxk_eJMexVug==/18690598162553431.jpg",
            "tns": [],
            "pic_str": "18690598162553431",
            "pic": 18690598162553430
          },
          "dt": 258168,
          "h": {
            "br": 320000,
            "fid": 0,
            "size": 10335459,
            "vd": -0.000265076
          },
          "m": {
            "br": 160000,
            "fid": 0,
            "size": 5176799,
            "vd": 0.252001
          },
          "l": {
            "br": 96000,
            "fid": 0,
            "size": 3112916,
            "vd": 0.20492
          },
          "a": null,
          "cd": "1",
          "no": 1,
          "rtUrl": null,
          "ftype": 0,
          "rtUrls": [],
          "djId": 0,
          "copyright": 1,
          "s_id": 0,
          "mark": 0,
          "mv": 0,
          "rtype": 0,
          "rurl": null,
          "mst": 9,
          "cp": 7002,
          "publishTime": 566841600000
        }],
        likedPlayList: [],
        comment: []
      }
    })
  }

  return true

}