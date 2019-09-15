// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isModelShow: false
  },
  onGetUserInfo(event) {
    const userInfo = event.detail.userInfo
    if(userInfo){
      console.log('已授权')
      this.setData({
        isModelShow: false
      })
      wx.navigateTo({
        url: '../blog-edit/blog-edit',
      })
    }else {
      wx.showToast({
        title: '登录后才能发表内容哦😶',
        icon: 'none',
        duration: 2000
      })
      console.log('auth denied')
    }
  },
  onPublish() {
    // 查询用户是否授权,否则弹出对话框
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              console.log(res)
            }
          })
          wx.navigateTo({
            url: '../blog-edit/blog-edit',
          })
        } else {
          this.setData({
            isModelShow: true
          })
        }
      }
    })
  },
  onModelClose() {
    this.setData({
      isModelShow: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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