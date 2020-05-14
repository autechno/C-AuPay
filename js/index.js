const mainApi = 'http://192.168.50.162:8086/api/payment/'
const getPaymentChannel = mainApi + 'getPaymentChannel' // 获取充值币种接口
const getPaymentCoin = mainApi + 'getPaymentCoin' // 根据金额获取需要数币数量
const choosePaymentChannelApi = mainApi + 'choosePaymentChannel' // 获取第二个页面
const merchantId = 'auPay4' // 登录人信息
const depositMoney = 500 // 充值金额
const token = 'fb002c6f2282444f98901bf3a77b1615'
const paymentOrderId = 'payment20200513154700001'

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
var currencyList =  []
// 当前选中 币种      // 当前选中 币种文字
var coinCur = null, coinTxt = null, coinId = null, currencyChain = null
$('#depositMoney').val(depositMoney)
// 获取充值渠道
$.ajax({
  type: 'GET',
  url: getPaymentChannel + '?merchantId=' + merchantId,
  success: function(res) {
    console.log(res, '充值渠道')
    if (res.code === 200) {
      currencyList = res.data
      let tempHtml = ''
      for(let i = 0, leng = currencyList.length; i < leng; i ++) {
        let item = currencyList[i]
        const tempName = channerlIdGetName(item.paymentChannelId)
        tempHtml += `<li class="coin_i" data-coin="${item.paymentChannelId}" data-id="${item.currencyId}" data-chain="${item.currencyChain}">${tempName}<li/>`
      }
      $('#popCoinList').html(tempHtml)
    } else { currencyList = [] }
  }
})
// 通过币种id获取到币种的name
function channerlIdGetName(id) {
  const currencyNameList = [
    { label: 'BTC', value: 1, name: '比特币' },
    { label: 'ETH', value: 2, name: '以太币' },
    { label: 'USDT-OMNI', value: 31, name: '泰达币' },
    { label: 'USDT-ERC20', value: 32, name: '泰达币' },
    { label: 'USDT-TEC20', value: 33, name: '泰达币' },
    { label: 'LTC', value: 5, name: '莱特币' },
    { label: 'EOS', value: 7, name: '柚子币' },
    { label: 'BCH', value: 8, name: '比特币现金' }
  ]
  for(let i = 0, leng = currencyNameList.length; i < leng; i ++) {
    let item = currencyNameList[i]
    if (String(item.value) === id)
    return item.label
  }
}
// 默认转币方式
$('input:radio').eq(0).attr('checked', 'true')
// 点击 选择币种 弹出弹窗
$('#coinList').click(function() {
  $("#transitionExample").popup("open")
})
$('#payType').click(function() {
  $("#transitionExample").popup("open")
})

// 再次打开币种列表选中状态
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
  coinCur = $(this).attr('data-coin')
  coinId = $(this).attr('data-id')
  currencyChain = $(this).attr('data-chain')
  coinTxt = $('.coin_i.cur').html()
  $('#payType').val(coinTxt)
  $('#seleCoinTxt').html(coinTxt)
  $("#transitionExample").popup("close")
  $('.error_prompt').hide()
  // 开始根据充值金额获取支付数量
  $('#payNum').val('')
  depositMoneyGetPayNum()
})
function depositMoneyGetPayNum() {
  $.ajax({
    type: 'GET',
    url: getPaymentCoin,
    data: {
      currency: coinId,
      amount: depositMoney,
      currencyChain
    },
    success: function(res) {
      if (res.code === 200) {
        $('#payNum').val(res.data)
      }
      console.log(res, '获取支付数量')
    }
  })
}
// 下一步
$('.nextStep').click(function() {
  console.log(coinCur)
  if (!$('#depositMoney').val()) return $('.form_i .error_prompt').eq(0).css('display', 'block')
  if (!coinCur) return $('.form_i .error_prompt').eq(1).css('display', 'block')
  if (!$('#payNum').val()) return $('.form_i .error_prompt').eq(3).css('display', 'block')
  if (!$('input[name="type_radio"]:checked').val()) return $('.form_i .error_prompt').eq(3).css('display', 'block')
  const sendData = {
    money: $('#depositMoney').val(),
    num: $('#payNum').val(),
    coinCur: coinCur,
    coinTxt: coinTxt,
    type: $('input[name="type_radio"]:checked').val() // 钱包 转币还是交易所住转币
  }
  // 下一步的同时把数据存储到缓存中
  localStorage.removeItem('aupay')
  localStorage.setItem('aupay', JSON.stringify(sendData))
  // window.location.href = './payMessage.html'
  choosePaymentChannel()
})

// 获取支付二维码等信息
function choosePaymentChannel() {
  $.ajax({
    type: 'GET',
    url: choosePaymentChannelApi,
    headers:{'Content-Type':'application/json;charset=utf8','token':token},
    'dataType' :'html', 
    data: {
      paymentOrderId,
      paymentChannelId: coinCur
    },
    success: function(res) {
      document.write(res)
      document.close()
      // document.close()
      // document.write('')
      // document.body.innerHTML = res
      // $(document.body).html(res);
    }
  })
}

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
