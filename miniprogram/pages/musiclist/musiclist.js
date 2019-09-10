// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playlistId: 0,
    musiclist: [],
    listInfo: {
      coverImgUrl:'',
      tags: ['加载中...'],
      description: '加载中...',
      name: '加载中...'
    },
    isJumboShow: false
  },

  toggleJumbo(){
    this.setData({
      isJumboShow: !this.data.isJumboShow
    })
  },
  onLoad: function (options) {
    this.setData({
      playlistId: options.playlistId
    })
    wx.cloud.callFunction({
      name:'music',
      data: {
        playlistId: options.playlistId,
        $url: 'musiclist'
      }
    }).then(res=>{
      console.log(res)
      const playlist = res.result.playlist
      this.setData({
        musiclist: playlist.tracks,
        listInfo: {
          coverImgUrl: playlist.coverImgUrl,
          tags: playlist.tags,
          description: playlist.description,
          name: playlist.name
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})