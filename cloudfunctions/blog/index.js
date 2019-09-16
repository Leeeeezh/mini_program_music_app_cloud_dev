// 云函数入口文件
const TcbRouter = require('tcb-router')
const cloud = require('wx-server-sdk')
cloud.init()
const blogs = cloud.database().collection('blog')

//  云函数
//  入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('blog', async(ctx, next) => {
    ctx.body = await blogs
      .skip(event.start)
      .limit(event.length)
      .orderBy('createdTime', 'desc')
      .get()
      .then(res => {
        return res
      })
  })

  return app.serve()
}