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
  play(event) {
    const currentId = event.currentTarget.dataset.id
    const index = event.currentTarget.dataset.index
    this.setData({
      playingId: currentId
    })
    getApp().globalData.playingId = currentId
    wx.navigateTo({
      url: `../../pages/player/player?index=${index}`,
    })
  },
  navToJumbo() {
    //  导航到歌单描述完全展示页面
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
    // console.log(getApp().globalData.playingId)
    this.setData({
      playlistId: options.playlistId,
      playingId: getApp().globalData.playingId
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
      this._setMusicList()
      // console.log(playlist.tracks)
    })
  },
  onShow() {
    // console.log('onShow')
    //  页面显示时更新正在播放歌曲的高亮样式
    this.setData({
      playingId: getApp().globalData.playingId
    })
  },
  _setMusicList() {
    wx.setStorageSync('musiclist', this.data.musiclist)
  }
})