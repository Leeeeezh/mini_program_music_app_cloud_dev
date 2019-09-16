var dateFormater = function(str) {
  const date = new Date(str)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  hour = hour < 10 ? '0' + hour : hour
  minute = minute < 10 ? '0' + minute : minute
  return `${year}年${month}月${day}日 - ${hour}:${minute}`
}
module.exports = {
  dateFormater
}