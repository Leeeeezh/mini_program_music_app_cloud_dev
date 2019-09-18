// components/blogsearch/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    keyword: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSearch() {
      this.triggerEvent('search',{keyword: this.data.keyword})
    },
    onInput(event) {
      this.setData({
        keyword: event.detail.value
      })
    },
    onPublish() {
      this.triggerEvent('publish')
    }
  }
})