  const deawingsMoney = 500 // 提款金额
  const deawingsCurrencyNum = 30 // 提币数量
  const drawOrderId = null
  const drawingsToken = null


  $('#draw_money').val(deawingsMoney)
  $('#draw_num').val(deawingsCurrencyNum)
  // 下一步
  $('.nextStep').click(function() {
    if (!$('#draw_address').val()) return $('.form_i .error_prompt').eq(2).css('display', 'block')
    const sendData = {
      drawOrderId: drawOrderId,
      drawChannelId: 1,
      address: $('#draw_address').val()
    }
    $.ajax({
      type: 'GET',
      url: 'http://aupay.one/api/payment/submitDraw',
      headers:{'Content-Type': 'application/json;charset=utf8','token': drawingsToken},
      success: function(res) {
        console.log(res, '下一步返回')
      },
      error: function(e){
        console.log(e, 'oneerr')
      }
    })
    console.log(sendData)
    // window.location.href=`./drawingsSuccess.html`
  })

  $('.form_i input').bind('input propertychange', function(e) {
    var that = $(this)
    // 输入框有值得话去掉错误提示
    if (that.val()) that.parent().parent().find('.error_prompt').css('display', 'none')
    var attrId = that.attr('id')
    // 限制输入框输入的内容
    if (attrId === 'draw_money' || attrId === 'draw_num') {
      if (!Number(that.val())) return that.val('')
      if (Number(that.val()) <= 0) return that.val('')
    }
  })
