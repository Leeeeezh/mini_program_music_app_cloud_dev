// pages/blog-edit/blog-edit.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
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
      wx.showToast({
        title: '最多只能上传140字🤣',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.wordsNum === 0 || this.data.content.trim().length === 0) {
      wx.showToast({
        title: '一个字也没有耶😛',
        icon: 'none',
        duration: 2000
      })
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
      console.log(res)
      let fileIds = []
      for (let r of res) {
        fileIds.push(r.fileID)
      }
      console.log(fileIds)
      db.collection('blog').add({
        data: {
          ...this.data.userInfo,
          content: this.data.content,
          img: fileIds,
          createdTime: db.serverDate()
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功😍',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }).catch(err => {
        wx.hideLoading()
        wx.showToast({
          title: '发布失败😭',
          icon: 'none',
          duration: 2000
        })
      })
    })
  },
  onDel(event) {
    console.log(event)
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
      wx.showToast({
        title: '字数太多啦😥',
        icon: 'none',
        duration: 2000
      })
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
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})