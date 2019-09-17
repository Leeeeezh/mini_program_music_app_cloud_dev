// pages/mymusiclist/mymusiclist.js
const player = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    playingId: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const myPlayList = wx.getStorageSync('personalData').myPlayList
    this.setData({
      musiclist: myPlayList
    })
  },
  play(event) {
    this._setMusicList()
    //  当前点击的歌曲的id
    const currentId = event.currentTarget.dataset.id
    console.log('currentId', currentId)
    const index = event.currentTarget.dataset.index
    const playingId = wx.getStorageSync('playingId')
    if (playingId != currentId) {
      player.stop()
    }
    this.setData({
      playingId: currentId
    })
    wx.navigateTo({
      url: `../../pages/player/player?index=${index}&id=${currentId}`,
    })
  },
  _setMusicList() {
    wx.setStorageSync('musiclist', this.data.musiclist)
  },
  onShow() {
    //  页面显示时更新正在播放歌曲的高亮样式
    this.setData({
      playingId: wx.getStorageSync('playingId')
    })
  },
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      playingId: wx.getStorageSync('playingId')
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