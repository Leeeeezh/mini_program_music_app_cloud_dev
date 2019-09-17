const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const userCollection = db.collection('user')
const TcbRouter = require('tcb-router')
const requestPromise = require('request-promise')
const BASE_URL = 'http://musicapi.xiecheng.live'
const playlist = cloud.database().collection('playlist')
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const app = new TcbRouter({
    event
  })

  app.router('playlist', async(ctx, next) => {
    ctx.body = await playlist
      .skip(event.start)
      .limit(event.length)
      .orderBy('createdTime', 'desc')
      .get()
      .then(res => {
        return res
      })
  })

  app.router('musiclist', async(ctx, next) => {
    ctx.body = await requestPromise(`${BASE_URL}/playlist/detail?id=${event.playlistId}`)
      .then(res => {
        return JSON.parse(res)
      })
  })

  app.router('musicUrl', async(ctx, next) => {
    ctx.body = await requestPromise(BASE_URL + `/song/url?id=${event.musicId}`).then(res => res)
  })

  app.router('lyric', async(ctx, next) => {
    ctx.body = await requestPromise(BASE_URL + `/lyric?id=${event.musicId}`).then(res => res)
  })

  app.router('like', async(ctx, next) => {
    let user = await userCollection.where({
      openId: openId
    }).get()

    let arr = user.data[0].myPlayList.filter(item => item.id === event.musicInfo.id)
    if (arr.length > 0) {
      ctx.body = {
        msg: 'music existed'
      }
    } else {
      await userCollection.where({
        openId: openId
      }).update({
        data: {
          myPlayList: db.command.unshift(event.musicInfo)
        }
      })
      ctx.body = {
        msg: 'success'
      }
    }
  })

  app.router('dislike', async(ctx, next) => {
    let user = await userCollection.where({
      openId: openId
    }).get()

    let myPlayList = user.data[0].myPlayList
    let newPlayList = myPlayList.filter(item => item.id != event.musicId)

    await userCollection.where({
      openId: openId
    }).update({
      data: {
        myPlayList: newPlayList
      }
    })
    ctx.body = {
      msg: 'success'
    }
  })

  app.router('checkLikeStatus', async(ctx, next) => {
    let user = await userCollection.where({
      openId: openId
    }).get()

    let myPlayList = user.data[0].myPlayList
    for (i of myPlayList) {
      if (i.id == event.musicId) {
        ctx.body = {
          msg: 'liked'
        }
        return
      }
    }
    ctx.body = {
      msg: 'unliked'
    }
  })

  app.router('likeList', async(ctx, next) => {
    let user = await userCollection.where({
      openId: openId
    }).get()

    let arr = user.data[0].likedPlayList.filter(item => item.id === event.playlist.id)
    if (arr.length > 0) {
      ctx.body = {
        msg: 'existed'
      }
    } else {
      await userCollection.where({
        openId: openId
      }).update({
        data: {
          likedPlayList: db.command.unshift(event.playlist)
        }
      })
      ctx.body = {
        msg: 'success'
      }
    }
  })

  app.router('checkListStatus', async(ctx, next) => {
    let user = await userCollection.where({
      openId: openId
    }).get()

    let likedPlayList = user.data[0].likedPlayList
    for (i of likedPlayList) {
      if (i.id == event.id) {
        ctx.body = {
          msg: 'liked'
        }
        return
      }
    }
    ctx.body = {
      msg: 'unliked'
    }
  })

  app.router('dislikeList', async(ctx, next) => {
    let user = await userCollection.where({
      openId: openId
    }).get()
    let likedPlayList = user.data[0].likedPlayList
    let newPlayList = likedPlayList.filter(item => item.id != event.id)
    await userCollection.where({
      openId: openId
    }).update({
      data: {
        likedPlayList: newPlayList
      }
    })
    ctx.body = {
      msg: 'success'
    }
  })
  return app.serve()
}