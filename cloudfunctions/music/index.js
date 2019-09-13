const cloud = require('wx-server-sdk')
cloud.init()
const TcbRouter = require('tcb-router')
const requestPromise = require('request-promise')
const BASE_URL = 'http://musicapi.xiecheng.live'
const playlist = cloud.database().collection('playlist')
// 云函数入口函数
exports.main = async(event, context) => {
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

  return app.serve()
}