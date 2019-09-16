// components/blogcard/index.js
import {
  dateFormater
} from '../../scripts/utils.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: Object,
    isLiked: Boolean
  },

  observers: {
    ['content.createdTime'](val) {
      this.setData({
        createdTime: dateFormater(val)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    createdTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    preview(event) {
      wx.previewImage({
        current: event.currentTarget.dataset.src,
        urls: this.data.content.img,
      })
    },
    navToUserDetail(event) {
      console.log('userDetail')
    },

    onContentTap(event) {
      this.triggerEvent('oncontenttap', this.data.content)
    },
    onLike() {
      this.setData({
        isLiked: !this.data.isLiked
      })
      const isLiked = this.data.isLiked
      this.triggerEvent('onlike', {
        isLiked
      })
    },
    onComment() {
      this.triggerEvent('oncomment')
    }
  }
})