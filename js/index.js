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
var currencyList =  [
  { label: 'BTC', value: 1, chain: [{ label: 'ERC20', value: 2 }, { label: 'ERC201', value: 1 }]},
  { label: 'ETH', value: 2, chain: [{ label: 'ERC20', value: 1 }] },
  { label: 'USDT', value: 3, chain: [{ label: 'ERC201', value: 1 }] },
  { label: 'LTC', value: 5, chain: [{ label: 'ERC20', value: 1 }] },
  { label: 'EOS', value: 7, chain: [{ label: 'ERC20', value: 1 }] },
  { label: 'BCH', value: 8, chain: [{ label: 'ERC20', value: 1 }] }
]
var coinCur = null, // 当前选中 币种
    chainCur = null, // 当前选中 公链 
    coinTxt = null, // 当前选中 币种文字
    chainTxt = null // 当前选中 公链文字
// 默认转币方式
$('input:radio').eq(0).attr('checked', 'true')
// 点击 选择币种 弹出弹窗
$('#coinList').click(function() {
  $("#transitionExample").popup("open")
  if (!currencyList || !currencyList.length) return
  templateEngine(currencyList, '#popCoinList', 'coin_i', 'data-coin', chainOperCur)
})
$('#payType').click(function() {
  $('#coinList').click()
})
// 币种列表赋值以及给予选中状态
function chainOperCur(id) {
  $('.coin_i').each(function(v, i) {
    if ($(this).attr('data-coin') === id) {
      $(this).addClass('cur').siblings().removeClass('cur')
    }
  })
}

// 点击某一个币种
$(document).on('click', '.coin_i', function() {
  $('.coin_i').off("click")
  $(this).addClass('cur').siblings().removeClass('cur')
  const id = $(this).attr('data-coin')
  coinCur = id
  if (!id) return false
  chainUpdataCoin(id)
  return false
})
// 点击币种后 公链要随之变化
function chainUpdataCoin(id) {
  $.each(currencyList, function(i, v){
    if(String(v.value) === id) {
      templateEngine(v.chain, '#popChainList', 'chain_i', 'data-chain')
    }
  })
}
// 根据数据 循环到页面上（模板引擎） arr循环的数组，id父级的id，labelClass 循环标签的class，labelAttr循环标签的字定义属性
function templateEngine (arr, id, labelClass, labelAttr, cb) {
  let tempHtml = '' // 公链的列表
  for(let i = 0, leng = arr.length; i < leng; i ++) {
    let item = arr[i]
    tempHtml += `<li class="${labelClass}" ${labelAttr}="${item.value}">${item.label}<li/>`
  }
  $(id).html(tempHtml)
  if (cb && coinCur) cb(coinCur)
}

// 选择好了公链（关闭弹窗等操作）
$(document).on('click', '.chain_i', function() {
  $(this).addClass('cur').siblings().removeClass('cur')
  chainCur = $(this).attr('data-chain')
  if (!$('.coin_i.cur').html()) return alert('请选择币种')
  if (!$('.chain_i.cur').html()) return alert('请选择公链')
  chainTxt = $('.chain_i.cur').html()
  coinTxt = $('.coin_i.cur').html()
  $('#payType').val(coinTxt + '/' + chainTxt)
  $("#transitionExample").popup("close")
  $('.error_prompt').hide()
})

// 下一步
$('.nextStep').click(function() {
  console.log(chainCur, coinCur)
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
