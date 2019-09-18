// pages/blog/blog.js
const db = wx.cloud.database()
let loadMoreLock = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isModelShow: false,
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
      this._toast('登录后才能发表内容哦😶')
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
          this._toast('登录后才能发表内容哦😶')
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
  _getMoreBlog(keyword='') {
    if (!this.data.hasMoreData) {
      this._toast('没有更多了哦😩')
    }
    if (loadMoreLock) {
      return
    }
    loadMoreLock = true
    this.showLoading()
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        keyword,
        start: this.data.blogs.length,
        length: 5,
        $url: 'blog'
      }
    }).then(res => {
      if (res.result.data.length === 0) {
        this._toast('没有更多了哦😩')
        this.setData({
          hasMoreData: false
        })
        return
      }
      wx.hideLoading()
      loadMoreLock = false
      this.setData({
        blogs: this.data.blogs.concat(res.result.data),
      })
      console.log('blogs=====>',res)
      console.log(res)
      wx.hideLoading()
    }).catch(err => {
      console.log('err=====>',err)
      wx.hideLoading()
      this._toast('Sorry,出错了😭')
    })
  },
  onSearch(event) {
    console.log(event.detail.keyword)
    this.setData({
      blogs: [],
      hasMoreData: true,
      loadMoreLock: false
    })
    this._getMoreBlog(event.detail.keyword)
  },
  showLoading() {
    wx.showLoading({
      title: '拼命加载😣',
    })
  },

  onPullDownRefresh: function() {

    this.showLoading()
    loadMoreLock = false
    this.setData({
      hasMoreData: true,
      blogs: []
    })
    this._getMoreBlog()
  },

  onReachBottom: function() {
    this._getMoreBlog()
  },
  onPageScroll: function(event) {
    let scrollTop = event.scrollTop
    // console.log(scrollTop)
    if (scrollTop > 600) {
      if (!this.data.isToTopBtnShow) {
        this.setData({
          isToTopBtnShow: true
        })
      }

    } else {
      if (this.data.isToTopBtnShow) {
        this.setData({
          isToTopBtnShow: false
        })
      }
    }

    if (event.scrollTop > this.data.scrollTop) {
      this.data.scrollTop = event.scrollTop
      // console.log("下")
      if (this.data.isSearchShow) {
        this.setData({
          isSearchShow: false
        })
      }
    }
    if (event.scrollTop < this.data.scrollTop) {
      this.data.scrollTop = event.scrollTop
      // console.log("上")
      if (!this.data.isSearchShow) {
        this.setData({
          isSearchShow: true
        })
      }
    }
  },
  _toast(text) {
    wx.showToast({
      title: text,
      duration: 2000,
      icon: 'none'
    })
  }
})