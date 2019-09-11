// pages/player/player.js

const player = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: -1,
    musicInfo: {},
    isPlaying: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      index: options.index
    })
    this._getMusicInfoFromCache()
    wx.setNavigationBarTitle({
      title: this.data.musicInfo.name,
    })

    wx.cloud.callFunction({
      name:"music",
      data:{
        musicId: this.data.musicInfo.id,
        $url: 'musicUrl'
      }
    }).then(res=>{
      console.log(res)
      let musicUrl = JSON.parse(res.result).data[0].url
      player.src = musicUrl
      player.title = this.data.musicInfo.name
      player.coverImgUrl = this.data.musicInfo.al.picUrl
      player.singer = this.data.musicInfo.ar[0].name
      player.epname = this.data.musicInfo.al.name
    })
  },

  _getMusicInfoFromCache() {
    const musicInfo = wx.getStorageSync('musiclist')[this.data.index]
    // console.log(musicInfo)
    this.setData({
      musicInfo: musicInfo
    })
  },

  togglePlay() {
    this.setData({
      isPlaying: !this.data.isPlaying
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