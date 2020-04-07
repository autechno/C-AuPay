$(function() {
  // 获取路径传过来的参数
  var paramsData = JSON.parse(window.location.search.slice(1).replace(/%22/g, '"'))
  $('#chainTxt').html(paramsData.chainTxt)
  $('#coinTxt').html(paramsData.coinTxt)
  $('#numTxt').html(paramsData.num)
})
// 离开页面提示
window.onbeforeunload=function(e){
　　var e = window.event || e
  e.returnValue=('如果您正在进行充值，为了您的资产安全，请勿离开此页面')
}
// 返回上一页按钮
$('#back').click(function() {
  $('#popupDialog').popup('open')
})
// 确认离开的按钮
$('#leave').click(function() {
  document.location = 'index.html'
})