// pages/player/player.js
// const glbData = getApp().globalData
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
    progressBarRefreshFlag: true, //锁进度条更新, 拖动进度条时启用
    secondWatcher: true, //用于限制当前播放时间的刷新频率
    isLyricShow: false,
    lyric: '',
    isLiked: false,
    playMode: 1, // 1顺序;0循环,
    playModeToast: ['单曲循环', '顺序播放']
  },
  onLoad: function(options) {
    this._bindPlayerEvent()
    this.setData({
      listLength: wx.getStorageSync('musiclist').length,
    })
    // console.log(this.data.duration)
    console.log('传入的index和id', parseInt(options.index), parseInt(options.id))
    this._init(parseInt(options.index), parseInt(options.id), options.forceplay)
  },
  // 进度条改变
  onChange(event) {
    this.data.progressBarRefreshFlag = false
    player.seek(~~(event.detail / 100 * this.data.duration))
    setTimeout(() => {
      this.data.progressBarRefreshFlag = true
    }, 500)
  },
  //松开进度条
  onDrag(event) {
    this.data.progressBarRefreshFlag = false
    this.setData({
      currentTime: (event.detail.value * this.data.duration) / 100
    })
    setTimeout(() => {
      this.data.progressBarRefreshFlag = true
    }, 500)
  },
  // 下一曲
  nextMusic(event) {
    player.stop()
    this.setData({
      lyric: ''
    })
    // console.log(this.data.playMode)
    if (this.data.playMode === 0 && !event) {
      this._init(parseInt(this.data.index))
      return
    }
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
  // 上一曲
  prevMusic() {
    player.stop()
    this.setData({
      lyric: ''
    })
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
  // 歌词显示切换
  toggleLyric() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  //切换播放模式:单曲/顺序/随机
  togglePlayMode() {
    let playMode = this.data.playMode
    // console.log('Change Play Mode')
    if (playMode === 1) {
      this.setData({
        playMode: 0
      })
    }

    if (playMode === 0) {
      this.setData({
        playMode: 1
      })
    }
    wx.showToast({
      title: this.data.playModeToast[this.data.playMode],
      icon: 'none',
      duration: 2000
    })
  },

  onLike() {
    this.setData({
      isLiked: !this.data.isLiked
    })

    this.data.isLiked && wx.showToast({
      title: '已收藏',
      duration: 2000,
      icon: 'none'
    })
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

  _init(index, id, forceplay) {
    this.setData({
      index: index,
      duration: player.duration,
      currentTime: 0,
      progressValue: 0,
      // lyric: getApp().globalData.lyric
      lyric: wx.getStorageSync('lyric')
    })
    this._getMusicInfoFromCache(index)
    wx.setNavigationBarTitle({
      title: `${this.data.musicInfo.name}`,
    })
    if (!player.src || id != wx.getStorageSync('playingId')) {
      // console.log('Start Download Resource')
      //  加载歌曲数据
      this._bindPlayerEvent()
      if (forceplay === 'true') {
        player.play()
      }
      wx.cloud.callFunction({
        name: "music",
        data: {
          musicId: this.data.musicInfo.id,
          $url: 'musicUrl'
        }
      }).then(res => {
        let musicUrl = JSON.parse(res.result).data[0].url
        // console.log(musicUrl)
        // 处理musicUrl为null的情况
        if (!musicUrl) {
          wx.showToast({
            title: '此歌曲暂无法播放',
            icon: 'none',
            duration: 1500
          })
          this.setData({
            isPlaying: false
          })
          setTimeout(() => {
            this.nextMusic()
          }, 2000)
          return
        }
        player.src = musicUrl
        player.title = this.data.musicInfo.name
        player.coverImgUrl = this.data.musicInfo.al.picUrl
        player.singer = this.data.musicInfo.ar[0].name
        player.epname = this.data.musicInfo.al.name
        wx.setStorageSync('playingId', this.data.musicInfo.id)
        wx.setStorageSync('playingIndex', index)
        wx.setStorageSync('musicTitle', this.data.musicInfo.name)
      })
      // 加载歌词数据
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId: this.data.musicInfo.id,
          $url: 'lyric'
        }
      }).then(res => {
        let lyric = ''
        let lrc = JSON.parse(res.result).lrc
        if (!lrc) {
          lyric = '暂无歌词'
          // console.log('No Lyric')
        } else {
          lyric = lrc.lyric
          // console.log('Lyric Exists')
        }
        this.setData({
          lyric: lyric
        })
        getApp().globalData.lyric = lyric
        wx.setStorageSync('lyric', lyric)
      })

    } else {
      console.log('The music is being played')
    }
    //  得到歌曲资源URL后请求数据
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
    })

    player.onPlay(() => {
      console.log('播放器 - 开始播放')
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
        setTimeout(() => {
          this.data.secondWatcher = true
        }, 400)
      }
    })

    player.onWaiting(() => {
      wx.showLoading({
        title: '拼命加载中>_< ',
      })
    })

    player.onCanplay(() => {
      wx.hideLoading()
      if (typeof player.tion != 'undefined') {
        this.setData({
          duration: player.duration
        })
      } else {
        setTimeout(() => {
          this.setData({
            duration: player.duration
          })
        }, 1000)
      }
    })

    player.onNext(() => {
      this.nextMusic()
    })
    player.onNext(() => {
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