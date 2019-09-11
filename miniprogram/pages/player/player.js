// pages/player/player.js

const player = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    musicInfo: {},
    isPlaying: true,
    listLength: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      listLength: wx.getStorageSync('musiclist').length
    })
    this._init(options.index)
  },

  nextMusic() {
    // console.log('next')
    player.stop()
    if (this.data.index === this.data.listLength - 1) {
      // console.log('to end')
      wx.showToast({
        title: '回到第一首啦',
        icon: 'none',
        duration: 1500
      })
      this._init(0)
    } else {
      this._init(parseInt(this.data.index) + 1)
    }
  },
  prevMusic() {
    player.stop()
    // console.log('prev')
    if (this.data.index === 0) {
      wx.showToast({
        title: '跳到最后一首啦',
        icon: 'none',
        duration: 1500
      })
      console.log('to head')
      this._init(this.data.listLength - 1)
    } else {
      this._init(parseInt(this.data.index) - 1)
    }
  },

  _init(index) {
    this.setData({
      index: index
    })
    this._getMusicInfoFromCache(index)
    // console.log(this.data)
    wx.setNavigationBarTitle({
      title: this.data.musicInfo.name,
    })

    wx.cloud.callFunction({
      name: "music",
      data: {
        musicId: this.data.musicInfo.id,
        $url: 'musicUrl'
      }
    }).then(res => {
      // console.log(res)
      let musicUrl = JSON.parse(res.result).data[0].url
      player.src = musicUrl
      player.title = this.data.musicInfo.name
      player.coverImgUrl = this.data.musicInfo.al.picUrl
      player.singer = this.data.musicInfo.ar[0].name
      player.epname = this.data.musicInfo.al.name
    })
  },

  _getMusicInfoFromCache(index) {
    const musicList = wx.getStorageSync('musiclist')
    const musicInfo = musicList[index]
    console.log('index===>', index)
    // console.log(musicInfo)
    this.setData({
      musicInfo: musicInfo,
      listLength: musicList.length
    })
    console.log('===>', musicInfo)
  },

  togglePlay() {
    this.setData({
      isPlaying: !this.data.isPlaying
    })

    const isPlaying = this.data.isPlaying
    if (isPlaying) {
      player.play()
    } else {
      player.pause()
    }
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