// 云函数入口文件
const TcbRouter = require('tcb-router')
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const blogs = cloud.database().collection('blog')

//  云函数
//  入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('blog', async(ctx, next) => {
    const keyword = event.keyword
    let w ={}
    if (keyword.trim() != '') {
       w = {
          content: db.RegExp({
            regexp: keyword,
            options: 'i'
          })
      }
    }
    ctx.body = await blogs
      .where(w)
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