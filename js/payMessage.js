var paramsData = null
$(function() {
  // 获取路径传过来的参数
  // paramsData = JSON.parse(window.location.search.slice(1).replace(/%22/g, '"'))
  paramsData = JSON.parse(localStorage.getItem('aupay'))
  if (paramsData.type === 'exchange') $('#exchange_qr').hide()
  $('#chainTxt').html(paramsData.chainTxt)
  $('#coinTxt').html(paramsData.coinTxt)
  $('#numTxt').html(paramsData.num)
})
// 离开页面提示
window.onbeforeunload = function(e){
　　var e = window.event || e
  e.returnValue = ('如果您正在进行充值，为了您的资产安全，请勿离开此页面')
}
// 返回上一页按钮
$('#back').click(function() {
  $('#popupDialog').popup('open')
})
// 确认离开的按钮
$('#leave').click(function() {
  document.location = 'index.html'
})

 // 支付完成按钮
 $('#pay_complete').click(function() {
  var walletVal = $('#wallet_address').val() // 钱包地址框
  var transactionVal = $('#transaction_id').val() // 交易id框
  if (!walletVal && paramsData.type !== 'exchange') return alert('请填写支付钱包地址')
  if (!transactionVal) return alert('请填写区块链交易ID')
  // 此处可以提交数据了 然后在跳转页面
  window.onbeforeunload = null
  window.location.href = './paySuccess.html'
})