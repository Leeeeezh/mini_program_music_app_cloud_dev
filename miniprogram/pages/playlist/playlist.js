// pages/playlist/playlist.js
const player = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [{
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    playlists: [],
    loadMoreLock: false,
    isToTopBtnShow: false,
    musicTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
      this.setData({
        isToTopBtnShow: true
      })
    } else {
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
    console.log('loading')
    this.setData({
      loadMoreLock: false
    })
    this.setData({
      playlists: []
    })
    this._getPlayList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
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
      this.setData({
        playlists: this.data.playlists.concat(res.result.data)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
})