$(document).ready(function(){
  // 提示有表单未完成等一系列
　if (localStorage.getItem('aupay')) {
    $('#popupContinuePop').popup('open')
  }
  $('#continueBtn').click(function() {
    window.location.href = './payMessage.html'
  })
})

// 公链和币种数据
var chainList = [
  {
    name: 'TRC20',
    id: 1,
    coinList: [
      { name: 'BTC', id: '1.1' },
      { name: 'BTC1', id: '1.2' },
      { name: 'BTC2', id: '1.3' }
    ]
  },
  {
    name: 'OMNI',
    id: 2,
    coinList: [
      { name: 'ETH', id: '2.1', min: 10, max: 500 },
      { name: 'ETH1', id: '2.2', min: 18, max: 510 },
      { name: 'ETH2', id: '2.3', min: 109, max: 509 }
    ]
  }
]
var chainCur = null, // 当前选中 公链 
    coinCur = null, // 当前选中 币种
    chainTxt = null, // 当前选中 公链文字
    coinTxt = null // 当前选中 币种文字
// 默认转币方式
$('input:radio').eq(0).attr('checked', 'true')
// 点击 选择币种 弹出弹窗
$('#coinList').click(function() {
  $("#transitionExample").popup("open")
  if (!chainList || !chainList.length) return
  templateEngine(chainList, '#popChainList', 'chain_i', 'data-chain', chainOperCur)
})
$('#payType').click(function() {
  $('#coinList').click()
})
// 公链列表赋值以及给予选中状态
function chainOperCur(id) {
  $('.chain_i').each(function(v, i) {
    if ($(this).attr('data-chain') === id) {
      $(this).addClass('cur').siblings().removeClass('cur')
    }
  })
}

// 点击某一个公链
$(document).on('click', '.chain_i', function() {
  $('.chain_i').off("click")
  $(this).addClass('cur').siblings().removeClass('cur')
  const chainId = $(this).attr('data-chain')
  chainCur = chainId
  if (!chainId) return false
  chainUpdataCoin(chainId)
  return false
})
// 点击公链后 币种要随之变化
function chainUpdataCoin(chainId) {
  $.each(chainList, function(i, v){
    if(String(v.id) === chainId) {
      templateEngine(v.coinList, '#popCoinList', 'coin_i', 'data-coin')
    }
  })
}
// 根据数据 循环到页面上（模板引擎） arr循环的数组，id父级的id，labelClass 循环标签的class，labelAttr循环标签的字定义属性
function templateEngine (arr, id, labelClass, labelAttr, cb) {
  let tempHtml = '' // 公链的列表
  for(let i = 0, leng = arr.length; i < leng; i ++) {
    let item = arr[i]
    tempHtml += `<li class="${labelClass}" ${labelAttr}="${item.id}">${item.name}<li/>`
  }
  $(id).html(tempHtml)
  if (cb && chainCur) cb(chainCur)
}

// 选择好了币（关闭弹窗等操作）
$(document).on('click', '.coin_i', function() {
  $(this).addClass('cur').siblings().removeClass('cur')
  coinCur = $(this).attr('data-coin')
  if (!$('.chain_i.cur').html()) return alert('请选择公链')
  if (!$('.coin_i.cur').html()) return alert('请选择币种')
  chainTxt = $('.chain_i.cur').html()
  coinTxt = $('.coin_i.cur').html()
  $('#payType').val(chainTxt + '/' + coinTxt)
  $("#transitionExample").popup("close")
  $('.error_prompt').hide()
})

// 下一步
$('.nextStep').click(function() {
  if (!$('#depositMoney').val()) return $('.form_i .error_prompt').eq(0).css('display', 'block')
  if (!chainCur || !coinCur) return $('.form_i .error_prompt').eq(1).css('display', 'block')
  if (!$('#payNum').val()) return $('.form_i .error_prompt').eq(2).css('display', 'block')
  if (!$('input[name="type_radio"]:checked').val()) return $('.form_i .error_prompt').eq(3).css('display', 'block')
  const sendData = {
    money: $('#depositMoney').val(),
    num: $('#payNum').val(),
    chainCur: chainCur,
    coinCur: chainCur,
    chainTxt: chainTxt,
    coinTxt: coinTxt,
    type: $('input[name="type_radio"]:checked').val() // 钱包 转币还是交易所住转币
  }
  // 下一步的同时把数据存储到缓存中
  localStorage.removeItem('aupay')
  localStorage.setItem('aupay', JSON.stringify(sendData))
  window.location.href = './payMessage.html'
})

$('.form_i input').bind('input propertychange', function(e) {
  var that = $(this)
  // 输入框有值得话去掉错误提示
  if (that.val()) that.parent().parent().find('.error_prompt').css('display', 'none')
  var attrId = that.attr('id')
  // 限制输入框输入的内容
  if (attrId === 'depositMoney' || attrId === 'payNum') {
    if (!Number(that.val())) return that.val('')
    if (Number(that.val()) <= 0) return that.val('')
  }
})
