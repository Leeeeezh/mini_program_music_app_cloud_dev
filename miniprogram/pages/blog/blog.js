// pages/blog/blog.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isModelShow: false,
    loadMoreLock: false,
    blogs: [],
    isSearchShow: true,
    isToTopButtonShow: false,
    hasMoreData: true,
    scrollTop: 0
  },
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  onGetUserInfo(event) {
    const userInfo = event.detail.userInfo
    if (userInfo) {
      console.log('已授权')
      this.setData({
        isModelShow: false
      })
      wx.cloud.callFunction({
        name: 'createUser',
        data: {
          userInfo
        }
      })
      wx.navigateTo({
        url: '../blog-edit/blog-edit',
      })
    } else {
      wx.showToast({
        title: '登录后才能发表内容哦😶',
        icon: 'none',
        duration: 2000
      })
      console.log('auth denied')
    }
  },
  onPublish() {
    wx.showLoading({
      title: '加载中🤣'
    })
    // 查询用户是否授权,否则弹出对话框
    wx.getSetting({
      success: res => {
        console.log('setting===>', res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              console.log('user info===>', res)
            }
          })
          wx.hideLoading()
          wx.navigateTo({
            url: '../blog-edit/blog-edit',
          })
        } else {
          wx.showToast({
            title: '登录后才能发表内容哦😶',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            isModelShow: true
          })
        }
      }
    })
  },
  navToBlogDetail(event) {
    wx.setStorageSync('blogdetail', event.detail)
    wx.navigateTo({
      url: '../blog-detail/blog-detail',
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
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              console.log('user info===>', res)
            }
          })
        } else {
          console.log('No Auth')
        }
      }
    })
    wx.hideLoading()
    this._getMoreBlog()
  },
  _getMoreBlog() {
    if (!this.data.hasMoreData) {
      this.noMoreDataToast()
    }
    if (this.data.loadMoreLock) {
      return
    }
    this.setData({
      loadMoreLock: true
    })
    this.showLoading()
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        start: this.data.blogs.length,
        length: 5,
        $url: 'blog'
      }
    }).then(res => {
      if (res.result.data.length === 0) {
        this.noMoreDataToast()
        this.setData({
          hasMoreData: false
        })
        return
      }
      wx.hideLoading()
      this.setData({
        loadMoreLock: false,
        blogs: this.data.blogs.concat(res.result.data),
      })
      console.log(res)
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      this.errorToast()
    })
  },
  noMoreDataToast() {
    wx.showToast({
      title: '没有更多了哦😩',
      icon: 'none',
      duration: 2000
    })
  },
  errorToast() {
    wx.showToast({
      title: 'Sorry,出错了😭',
      icon: 'none',
      duration: 2000
    })
  },
  showLoading() {
    wx.showLoading({
      title: '拼命加载😣',
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
  // onShow: function() {
  //   wx.showLoading({
  //     title: '加载中😜',
  //   })
  //   this.setData({
  //     blogs: []
  //   })
  //   this._getMoreBlog()
  // },

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

    this.showLoading()
    this.setData({
      loadMoreLock: false,
      hasMoreData: true,
      blogs: []
    })
    this._getMoreBlog()
  },
  onReachBottom: function() {
    this._getMoreBlog()
  },

  /**
   * 页面上拉触底事件的处理函数
   */

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onPageScroll: function(event) {
    if (event.scrollTop < 400) {
      this.setData({
        isToTopBtnShow: true
      })
      return
    }
    let scrollTop = event.scrollTop
    // console.log(scrollTop)
    if (scrollTop > 600) {
      this.setData({
        isToTopBtnShow: true
      })
    } else {
      this.setData({
        isToTopBtnShow: false
      })
    }

    if (event.scrollTop > this.data.scrollTop) {
      this.data.scrollTop = event.scrollTop
      // console.log("下")
      this.setData({
        isSearchShow: false
      })
    }
    if (event.scrollTop < this.data.scrollTop) {
      this.data.scrollTop = event.scrollTop
      // console.log("上")
      this.setData({
        isSearchShow: true
      })
    }
  },
})