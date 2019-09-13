// components/lyric/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: Boolean,
    lyric: String
  },

  observers:{
    lyric(lrc){
      this._parseLyric(lrc)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _parseLyric(lrc){

    }
  }
})
