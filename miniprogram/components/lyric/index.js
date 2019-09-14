// components/lyric/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: Boolean,
    lyric: String,
    second: Number
  },

  observers: {
    lyric(lrc) {
      this.setData({
        activedIndex: -1,
        scrollTop: 0
      })
      this._parseLyric(lrc)
    },

    //  实时更新高亮歌词,second:歌曲已播放秒数
    second(second) {
      let lrcList = this.data.lrcList
      if (lrcList.length === 0) {
        return
      }
      for (let i = 0; i < lrcList.length; i++) {
        if (lrcList[i].seconds < second && second < lrcList[i + 1].seconds) {
          if (this.data.activedIndex === i) {
            return
          }
          this.setData({
            activedIndex: i,
            scrollTop: 35 * i
          })
          break
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    activedIndex: -1,
    scrollTop: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _parseLyric(lrc) {
      let lrcList = []
      lrc.split('\n').forEach(item => {
        let time = item.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?\]/)
        // console.log(time)
        if (!!time) {
          // console.log(time)
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          let seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          let lrc = item.split(time[0])[1]

          lrcList.push({
            seconds,
            lrc
          })
          // console.log(seconds, '====', lrc)
        }
      })

      this.setData({
        lrcList
      })
      console.log(this.data.lrcList)
    }
  }
})