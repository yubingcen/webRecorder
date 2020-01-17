class webRecorder {
  constructor(elements) {
    this.element = elements || 'browser'
    this.options = {
      mimeType: 'video/webm;codecs=vp9'
    }
    this.recorder = null
    this.recordedChunks = null
    this.recording = false
    this.stream = null
  }

  info(message) {
    console.log('%c[webRecorder]%c ' + message, 'font-weight: bold; color: purple;', null)
  }

  warn(message) {
    console.warn('%c[webRecorder]%c ' + message, 'font-weight: bold; color: purple;', null)
  }

  error(message) {
    console.error('%c[webRecorder]%c ' + message, 'font-weight: bold; color: purple;', null)
  }

  async getRecorder() {
    if (this.stream) {
      this.warn('It is recording now!')
      return false
    }
    if (this.element !== 'browser') {
      const videos = this.getElement(this.element)
      if (!videos) {
        this.error('Cannot find any stream canvas.')
        return false
      } else {
        const canvas = videos
        this.stream = canvas.captureStream()
        this.recorder = new MediaRecorder(this.stream, this.options)
        return true
      }
    }
    await navigator.mediaDevices.getDisplayMedia({
      video: true
    }).then(stream => {
      // we have a stream, attach it to a feedback video element
      this.stream = stream
    }, error => {
      console.log('Unable to acquire screen capture', error)
    })
    if (!this.stream) {
      return false
    } else {
      this.recorder = new MediaRecorder(this.stream)
      return true
    }
  }

  handleData(event) {
    if (event.data.size > 0) {
      // MediaRecorder.stop() is non-blocking. Call saveToFile() after actually saving the chunk.
      this.recordedChunks.push(event.data)
      this.info('Data received.')
      this.saveToFile()
    } else {
      this.warn('Received data is empty.')
    }
    // return
  }

  /**
   * 
   * @param {string} element 
   * you can input .xxx, #xxx, video
   */
  getElement (element) {
    let videos = null
    if (element === 'video' || element.startsWith('.')) {
      videos = element === 'video' ? document.getElementsByTagName('video') : document.getElementsByClassName(element.substr(1))
      if (videos[0]) {
        return videos[0]
      } else {
        return false
      }
    }
    if (element.startsWith('#')) {
      videos = document.getElementById(element.substr(1))
      if (videos) {
        return videos
      }
    }
    
    this.error('this web is no video !')
    return false
  }

  async start() {
    if (this.recording) {
      this.warn('Already recording. Use stop() to stop and save.')
      return
    }
    var gets = await this.getRecorder()
    if (!gets) {
      return
    }

    this.recordedChunks = []
    this.recorder.addEventListener('dataavailable', e => this.handleData(e))
    this.recorder.start()
    this.recording = true
    this.info('Recording started.')
  }

  stop() {
    if (!this.recording) {
      this.warn('Already stopped. Use start() to start recording, or saveToFile() to resave.')
      return
    }

    this.recorder.stop()
    this.recording = false
    this.stream = null
    this.info('Recording stopped.')
  }
  saveToFile() {
    const blob = new Blob(this.recordedChunks, {
      type: 'video/webm'
    })
    const url = URL.createObjectURL(blob)
    const dummy = document.createElement('a')
    document.body.appendChild(dummy)
    dummy.style = 'display: none'
    dummy.href = url
    dummy.download = 'myRecord.webm'
    dummy.click()
    window.URL.revokeObjectURL(url)
    dummy.parentElement.removeChild(dummy)
  }
}

export default webRecorder
