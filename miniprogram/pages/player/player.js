// pages/player/player.js
const player = wx.getBackgroundAudioManager()
Page({
  data: {
    index: 0, //  当前歌曲在歌单中的索引
    musicInfo: {}, //  歌曲信息
    isPlaying: true, //  是否处于播放状态
    listLength: 0, //  歌单中的歌曲数量
    prevFlag: false, //  动画触发变量,由false转为true时触发动画
    nextFlag: false, //  动画触发变量,由false转为true时触发动画
    progressValue: 0, //进度0~100
    duration: '??:??', //歌曲时长 单位秒
    currentTime: 0, //单位秒
    progressBarRefreshFlag: true,

    secondWatcher: true
  },
  onLoad: function(options) {
    this._bindPlayerEvent()
    this.setData({
      listLength: wx.getStorageSync('musiclist').length
    })
    this._init(options.index)
  },
  onChange(event) {
    player.seek(~~(event.detail / 100 * this.data.duration))
    this.data.progressBarRefreshFlag = true
  },
  onDrag(event) {
    this.data.progressBarRefreshFlag = false
    this.setData({
      currentTime: (event.detail.value * this.data.duration) / 100
    })
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
      index: index,
      duration: '??:??',
      currentTime: 0,
      progressValue: 0
    })
    this._getMusicInfoFromCache(index)
    wx.setNavigationBarTitle({
      title: `${this.data.musicInfo.name}`,
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
  _bindPlayerEvent() {
    player.onPause(() => {
        this.setData({
          isPlaying: false
        })
      }),
      player.onPlay(() => {
        this.setData({
          isPlaying: true
        })
      })

    player.onEnded(() => {
      this.nextMusic()
    })

    player.onTimeUpdate(() => {
      if (this.data.progressBarRefreshFlag && this.data.secondWatcher) {
        this.setData({
          currentTime: player.currentTime,
          progressValue: ~~(player.currentTime * 100 / player.duration)
        })
        this.data.secondWatcher = false
        setTimeout(()=>{
          this.data.secondWatcher = true
        },400)
        console.log(player.currentTime)
      }
    })

    player.onWaiting(() => {
      wx.showLoading({
        title: '拼命加载中>_< ',
      })
    })

    player.onCanplay(() => {
      wx.hideLoading()
      if (typeof player.duration != 'undefined') {
        // console.log(player.duration)
        this.setData({
          duration: player.duration
        })
      } else {
        setTimeout(() => {
          // console.log(player.duration)
          this.setData({
            duration: player.duration
          })
        }, 1000)
      }
    })

    player.onNext(()=>{
      this.nextMusic()
    })
    player.onNext(()=>{
      this.prevMusic()
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