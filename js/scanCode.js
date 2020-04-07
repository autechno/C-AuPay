const Scan = {
  videoInputDevice: [],
  videoElement: document.getElementById("video"),
  canvasElement: document.getElementById("qr-canvas"),
  videoWrap: document.getElementById("video_bg"),
  decodeTimer: null,
  canvasTimer: null,
  canvasContext: document.getElementById("qr-canvas").getContext("2d"),
  // 获取到的媒体设备
  gotDevices(deviceInfos) {
    let that = this;
    for (let i = 0; i !== deviceInfos.length; ++i) {
      let deviceInfo = deviceInfos[i];
      if (deviceInfo.kind === 'audiooutput' || deviceInfo.kind === 'audioutput') {
        // 音频设备
      } else if (deviceInfo.kind === 'videoinput') {
        // 视频设备
        that.videoInputDevice.push(deviceInfo)
      } else {
        // 其他设备 或者用户没有给授权摄像头
        that.videoWrap.style.display = 'none'
        console.log('不支持此设备: ', deviceInfo)
      }
    }
  },
  getStream() {
    let that = this;
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    let constraints = null
    if (that.isIOS()) {
      constraints = {
        video: {
          facingMode: ('environment')
        }
      };
    } else {
      if (!that.videoInputDevice || !that.videoInputDevice[1] || !that.videoInputDevice[1].deviceId) {
        return console.log('摄像头等id信息不存在')
      }
      constraints = {
        video: {
          deviceId: {
            // [1].deviceId 表示后置摄像头,默认开启的是前置摄像头
            exact: that.videoInputDevice[1].deviceId
          }
        }
      };
    }
    // 视频设备初始化
    navigator.mediaDevices.getUserMedia(constraints).then(that.gotStream.bind(that)).catch(that.handleError.bind(that));
    that.captureToCanvas();
    that.decode();
  },
  // 解码
  decode() {
    let that = this;
    try {
      qrcode.decode();
    } catch (e) {
      // console.log('1:' + e);
    };
    that.decodeTimer = setTimeout(that.decode.bind(that), 100) // 解码频率为100毫秒一次
  },
  //将视频流放到画布
  captureToCanvas() {
    let that = this
    try {
      // 根据视频大小设置canvas大小
      let w = that.videoElement.videoWidth
      let h = that.videoElement.videoHeight
      that.canvasElement.width = w
      that.canvasElement.height = h
      that.canvasContext.drawImage(that.videoElement, 0, 0, w, h)
    } catch (e) {
      console.log(e)
    };
    // 100毫秒绘制一次
    that.canvasTimer = setTimeout(that.captureToCanvas.bind(that), 100)
  },
  handleError(error) {
    console.log('Error: ', error.message)
    alert('当拒绝调用摄像头权限后，如还需扫描，请刷新当前页面')
    document.getElementById('video_bg').style.display = 'none'
  },
  gotStream(stream) {
    let that = this
    window.stream = stream // make stream available to console
    that.videoElement.srcObject = stream
  },
  isIOS() {
    var u = navigator.userAgent
    var IOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
    if (IOS) {
      return true
    } else {
      return false
    }
  },
  init() {
    let that = this
    // API参考
    // https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/enumerateDevices
    // 先获取设备列表，方便调用后置摄像头
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices()) return console.log('该设备不支持，或协议不是https')
    let devices = navigator.mediaDevices.enumerateDevices().then(that.gotDevices.bind(that))
    $('#wallet_qr').addEventListener('click', () => {
      clickInit(that, '#wallet_address')
    })
    $('#trading_qr').addEventListener('click', () => {
      clickInit(that, '#transaction_id')
    })
  }
}
Scan.init()

function clickInit(that, id) {
  $(id).val('')
  that.videoElement.style.display = 'block'
  that.videoWrap.style.display = 'flex'
  // that.canvasElement.style.display = 'block'
  that.videoElement.play()
  devices.then(that.getStream.bind(that)).catch(that.handleError.bind(that))
  that.canvasContext.clearRect(0, 0, 300, 200)
  //结果回调
  qrcode.callback = (e) => {
    // 清除画布，停止摄像头
    clearTimeout(that.decodeTimer)
    clearTimeout(that.canvasTimer)
    that.canvasContext.clearRect(0, 0, 300, 200)
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop()
      })
    }
    that.videoElement.style.display = 'none'
    that.videoWrap.style.display = 'none'
    that.canvasElement.style.display = 'none'
    if (e.indexOf("http") != -1) {
      window.location.href = e + '&token=xxxx'
    } else {
      $(id).val(e)
    }
  }
}