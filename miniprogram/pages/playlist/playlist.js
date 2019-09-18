// pages/playlist/playlist.js
const player = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuth: true,
    myPlayList: [],
    playlists: [],
    loadMoreLock: false,
    isToTopBtnShow: false,
    musicTitle: '',
    myPlayListCover: '',
    likedPlayList: []
  },
  onGetUserInfo(event) {
    const userInfo = event.detail.userInfo
    if (userInfo) {
      console.log('已授权')
      this.setData({
        isAuth: true
      })
      wx.cloud.callFunction({
        name: 'createUser',
        data: {
          userInfo
        }
      }).then(res => {
        this._getPersonalData()
      })
    } else {
      console.log('auth denied')
    }
  },
  _getPersonalData() {
    console.log('getPersonalData')
    let personalData = wx.getStorageSync('personalData')
    if (personalData) {
      console.log('从缓存中读取personalData')
      this.setData({
        myPlayList: personalData.myPlayList,
        myPlayListCover: personalData.myPlayList[0].al.picUrl,
        likedPlayList: personalData.likedPlayList
      })
    }
    this._loading()
    console.log('请求用户数据')
    wx.cloud.callFunction({
      name: 'getPersonalData'
    }).then(res => {
      console.log(res.result)
      if (res.result.myPlayList.length != 0) {
        this.setData({
          myPlayList: res.result.myPlayList,
          myPlayListCover: res.result.myPlayList[0].al.picUrl,
          likedPlayList: res.result.likedPlayList
        })
      }
      wx.hideLoading()
      wx.setStorageSync('personalData', res.result)
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
              wx.cloud.callFunction({
                name: 'createUser',
                data: {
                  userInfo: res.userInfo
                }
              }).then(res => {
                this._getPersonalData()
              })
            }
          })
        } else {
          console.log('No Auth')
          this.setData({
            isAuth: false
          })
        }
      }
    })
    this._getPlayList()
  },

  navToSearch() {
    wx.navigateTo({
      url: '../../pages/search/search',
    })
  },
  navToPlayer() {
    const id = wx.getStorageSync('playingId')
    const index = wx.getStorageSync('playingIndex')
    wx.navigateTo({
      url: `../../pages/player/player?index=${index}&id=${id}`,
    })
  },
  onPageScroll: function(event) {
    //  监听滚动事件,滚动到一定距离后显示返回顶部按钮
    let scrollTop = event.scrollTop
    // console.log(scrollTop)
    if (scrollTop > 600) {
      if (this.data.isToTopBtnShow) {
        return
      }
      this.setData({
        isToTopBtnShow: true
      })
    } else {
      if (!this.data.isToTopBtnShow) {
        return
      }
      this.setData({
        isToTopBtnShow: false
      })
    }
  },
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0
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
    this.setData({
      musicTitle: wx.getStorageSync('musicTitle')
    })
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
    this.setData({
      loadMoreLock: false
    })
    this.setData({
      playlists: []
    })
    this._getPlayList()
    this._getPersonalData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('reach bottom')
    this._getPlayList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    wx.showToast({
      title: '没有更多了哦(￣_￣|||)',
      icon: 'none',
      duration: 2000
    })
  },
  _loading() {
    wx.showLoading({
      title: '加载中🤣',
    })
  },
  //获取更多歌单
  _getPlayList() {
    if (this.data.loadMoreLock) {
      wx.showToast({
        title: '没有更多了哦(￣_￣|||)',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '加载中>_<',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playlists.length,
        length: 10,
        $url: 'playlist'
      }
    }).then(res => {
      if (res.result.data.length === 0) {
        wx.hideLoading()
        wx.showToast({
          title: '没有更多了哦(￣_￣|||)',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          loadMoreLock: true
        })
        return
      }
      console.log(res.result.data)
      this.setData({
        playlists: this.data.playlists.concat(res.result.data)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
})