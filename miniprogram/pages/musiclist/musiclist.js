// pages/musiclist/musiclist.js
const player = wx.getBackgroundAudioManager()
let playlist = {}
Page({
  data: {
    isLiked: false,
    playlistId: 0,
    musiclist: [],
    listInfo: {
      coverImgUrl: '',
      tags: ['加载中...'],
      description: '加载中...',
      name: '加载中...',
      id: 0
    },
    playingId: -1
  },
  onLike() {
    this.setData({
      isLiked: !this.data.isLiked
    })
    if (this.data.isLiked) {
      wx.cloud.callFunction({
        name: 'music',
        data: {
          playlist,
          $url: 'likeList'
        }
      }).then(res => {
        console.log(res.result)
        if (res.result.msg == "success") {
          this._toast('收藏成功🎁')
        } else {
          this._toast('取消收藏💥')
        }
      })
    } else {
      wx.cloud.callFunction({
        name: 'music',
        data: {
          $url: 'dislikeList',
          id: playlist.id
        }
      }).then(res=>{
        console.log(res)
      })
    }

  },
  playThisList() {
    // wx.setStorageSync('musiclsit', this,data,musiclist)
    if (this.data.listInfo.id == wx.getStorageSync('playingListId') && player.src && !player.paused) {
      this._toast('当前歌单正在播放😋')
      return
    }
    this._setMusicList()
    const currentId = this.data.musiclist[0].id
    const index = 0
    const playingId = wx.getStorageSync('playingId')
    this.setData({
      playingId: currentId
    })
    wx.navigateTo({
      url: `../../pages/player/player?index=${index}&id=${currentId}`,
    })
  },
  play(event) {
    this._setMusicList()
    //  当前点击的歌曲的id
    const currentId = event.currentTarget.dataset.id
    console.log('currentId', currentId)
    const index = event.currentTarget.dataset.index
    // wx.setStorageSync('playingId',currentId)
    // wx.setStorageSync('playingIndex', index)
    //  正在播放的歌曲的id
    const playingId = wx.getStorageSync('playingId')
    if (playingId != currentId) {
      player.stop()
    }
    this.setData({
      playingId: currentId,
    })
    wx.setStorageSync('playingListId', this.data.listInfo.id)
    // getApp().globalData.playingId = currentId
    wx.navigateTo({
      url: `../../pages/player/player?index=${index}&id=${currentId}`,
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
  },
  onLoad: function(options) {
    this.setData({
      playlistId: options.playlistId,
      playingId: wx.getStorageSync('playingId')
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
      playlist = res.result.playlist
      this.setData({
        musiclist: playlist.tracks,
        listInfo: {
          coverImgUrl: playlist.coverImgUrl,
          tags: playlist.tags,
          description: playlist.description,
          name: playlist.name,
          id: playlist.id
        }
      })
      wx.hideLoading()
      return wx.cloud.callFunction({
        name: 'music',
        data: {
          $url: 'checkListStatus',
          id: playlist.id
        }
      })
    }).then(res => {
      console.log(res.result)
      this.setData({
        isLiked: res.result.msg == 'liked' ? true : false
      })
    })

  },
  onShow() {
    //  页面显示时更新正在播放歌曲的高亮样式
    this.setData({
      playingId: wx.getStorageSync('playingId')
    })
  },
  _setMusicList() {
    wx.setStorageSync('musiclist', this.data.musiclist)
  },
  _toast(text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  }
})