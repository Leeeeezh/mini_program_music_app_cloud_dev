// pages/blog-edit/blog-edit.js
const db = wx.cloud.database()
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    wordsNum: 0,
    footerBottom: 0,
    imgList: [],
    isAddable: true
  },
  preview(event) {
    wx.previewImage({
      current: event.currentTarget.dataset.src,
      urls: this.data.imgList,
    })
  },
  onPublish() {
    if (this.data.wordsNum > 140) {
      this._toast('最多只能上传140字🤣')
      return
    }
    if (this.data.wordsNum === 0 || this.data.content.trim().length === 0) {
      this._toast('一个字也没有耶😛')
      return
    }
    wx.showLoading({
      title: '发布中😁',
    })

    let tasks = []
    for (let item of this.data.imgList) {
      let suffix = /\.\w+$/.exec(item)[0]

      let task = wx.cloud.uploadFile({
        cloudPath: `blog/${Date.now()}-${Math.random().toString().substr(2)}${suffix}`,
        filePath: item
      })
      tasks.push(task)
    }

    Promise.all(tasks).then(res => {
      let fileIds = []
      for (let r of res) {
        fileIds.push(r.fileID)
      }
      console.log(fileIds)
      db.collection('blog').add({
        data: {
          ...userInfo,
          content: this.data.content,
          img: fileIds,
          createdTime: db.serverDate()
        }
      }).then(res => {
        wx.hideLoading()
        this._toast('发布成功😍')
        let pages = getCurrentPages()
        pages[0].onPullDownRefresh()
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }).catch(err => {
        wx.hideLoading()
        this._toast('发布失败😭')
      })
    })
  },
  onDel(event) {
    this.data.imgList.splice(event.currentTarget.dataset.index, 1)
    this.setData({
      imgList: this.data.imgList
    })
    if (this.data.imgList.length === 8) {
      this.setData({
        isAddable: true
      })
    }

  },
  onChooseImg() {
    wx.chooseImage({
      count: 9 - this.data.imgList.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          imgList: this.data.imgList.concat(res.tempFilePaths)
        })
        if (this.data.imgList.length === 9) {
          this.setData({
            isAddable: false
          })
        }
      },
    })
  },
  onInput(event) {
    let content = event.detail.value
    let wordsNum = content.length
    this.setData({
      content,
      wordsNum
    })
    if (wordsNum > 140) {
      this._toast('字数太多啦😥')
    }
  },
  onFocus(event) {
    this.setData({
      footerBottom: event.detail.height
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getUserInfo({
      success: res => {
        userInfo = res.userInfo
      }
    })
  },

  _toast(text){
    wx.showToast({
      title: text,
    })
  }
})