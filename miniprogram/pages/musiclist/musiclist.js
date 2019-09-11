// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playlistId: 0,
    musiclist: [],
    listInfo: {
      coverImgUrl: '',
      tags: ['加载中...'],
      description: '加载中...',
      name: '加载中...'
    },
    playingId: -1
  },
  play(event){
    // console.log(event.currentTarget.dataset.id)
    this.setData({
      playingId: event.currentTarget.dataset.id
    })
  },
  navToJumbo() {
    let img = this.data.listInfo.coverImgUrl
    let name = this.data.listInfo.name
    let desc = this.data.listInfo.description
    getApp().globalData.jumboData = {
      img,
      name,
      desc
    }
    wx.navigateTo({
      url: '../../pages/jumbo/jumbo',
    })

    // console.log(img)
    // wx.navigateTo({
    //   url: `../../pages/jumbo/jumbo?img=${img}&name=${name}&desc=${desc}`,
    // })
  },
  onLoad: function(options) {
    this.setData({
      playlistId: options.playlistId
    })
    wx.showLoading({
      title: '加载中>_<',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        playlistId: options.playlistId,
        $url: 'musiclist'
      }
    }).then(res => {
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
      wx.hideLoading()
      console.log(playlist.tracks)
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