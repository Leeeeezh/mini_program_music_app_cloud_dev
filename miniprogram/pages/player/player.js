// pages/player/player.js

const player = wx.getBackgroundAudioManager()
Page({
  data: {
    index: 0,
    musicInfo: {},
    isPlaying: true,
    listLength: 0,
    prevFlag: false,
    nextFlag: false
  },
  onLoad: function(options) {
    this.setData({
      listLength: wx.getStorageSync('musiclist').length
    })
    this._init(options.index)
  },

  nextMusic() {
    player.stop()
    this._initAnimation('next')

    if (this.data.index === this.data.listLength - 1) {
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
    this._initAnimation('prev')
    if (parseInt(this.data.index) === 0) {
      wx.showToast({
        title: '跳到最后一首啦',
        icon: 'none',
        duration: 1500
      })
      this._init(this.data.listLength - 1)
    } else {
      this._init(parseInt(this.data.index) - 1)
    }
  },
  _initAnimation(direction) {
    //  触发歌曲切换动画
    this.setData({
      prevFlag: false,
      nextFlag: false
    })
    if (direction === 'prev') {
      this.setData({
        prevFlag: true
      })
    } else {
      this.setData({
        nextFlag: true
      })
    }
  },

  _init(index) {
    this.setData({
      index: index
    })
    this._getMusicInfoFromCache(index)
    console.log(this.data)
    wx.setNavigationBarTitle({
      title: this.data.musicInfo.name,
    })
    getApp().globalData.playingId = this.data.musicInfo.id

    //  得到歌曲资源URL后请求数据
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
    // 从缓存中加载当前歌曲数据并挂载到data
    const musicList = wx.getStorageSync('musiclist')
    const musicInfo = musicList[index]
    this.setData({
      musicInfo: musicInfo,
      listLength: musicList.length
    })
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
  }
})