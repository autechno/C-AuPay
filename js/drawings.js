
  // 下一步
  $('.nextStep').click(function() {
    if (!$('#draw_money').val()) return $('.form_i .error_prompt').eq(0).css('display', 'block')
    if (!$('#draw_num').val()) return $('.form_i .error_prompt').eq(1).css('display', 'block')
    if (!$('#draw_address').val()) return $('.form_i .error_prompt').eq(2).css('display', 'block')
    const sendData = {
      money: $('#draw_money').val(),
      num: $('#draw_num').val(),
      address: $('#draw_address').val()
    }
    console.log(sendData)
    window.location.href=`./drawingsSuccess.html`
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
