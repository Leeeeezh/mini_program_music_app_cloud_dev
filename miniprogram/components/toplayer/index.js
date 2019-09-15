// components/toplayer/toplayer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musicTitle: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: parseInt(wx.getStorageSync('playingIndex')) != -1
  },


  /**
   * 组件的方法列表
   */
  methods: {
    navToPlayer() {
      const id = wx.getStorageSync('playingId')
      const index = wx.getStorageSync('playingIndex')
      console.log(index)
      if (index === -1 || index === '') {
        wx.showToast({
          title: '还没有最近播放记录,快去歌单看看吧😋',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      wx.navigateTo({
        url: `../../pages/player/player?index=${index}&id=${id}&forceplay=true`,
      })
    }
  }
})