// components/bottommodel/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isModelShow: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  options: {
    multipleSlots: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      this.triggerEvent('close')
    }
  }
})