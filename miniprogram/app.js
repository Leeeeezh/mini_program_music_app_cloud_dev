//app.js
App({
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'test-k9glh',
        traceUser: true,
      })
    }

    this.globalData = {}
  },
  globalData: {
    jumboData: {
      img: '',
      name: '',
      desc: ''
    },
    lyric: '加载中',
    playingId: -1,
    playingIndex: -1,
  },
})