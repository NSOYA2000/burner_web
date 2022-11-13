<template>
  <div id="app">
    <!--{{ content }}-->
    <!--    <el-input v-model="content" type="textarea" />-->
    <!--        <div v-html="content" />-->
    <vue-tinymce v-model="content" :setting="setting" />
  </div>
</template>

<script>
import { fileCtrlUpload } from '@/api/notification'
import { Message } from 'element-ui'

export default {
  name: 'Tinymce',
  props: {
    value: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fullscreenLoading: false,
      content: '',
      maxImageSize: 2 * 1024 * 1024,
      allowImageTypeList: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'tif'],
      maxAudioSize: 10 * 1024 * 1024,
      allowRadioTypeList: ['mp3', 'wav', 'wma', 'amr', 'flac'],
      maxVideoSize: 1000 * 1024 * 1024,
      allowVideoTypeList: [
        'mp4',
        'm2v',
        'mkv',
        'rmvb',
        'wmv',
        'avi',
        'flv',
        'mov',
        'm4v'
      ],
      setting: {
        readonly: this.readonly,
        menubar: false,
        toolbar:
          'undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold link italic underline strikethrough | indent outdent | superscript subscript | removeformat |',
        toolbar_drawer: 'sliding',
        quickbars_selection_toolbar:
          'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
        plugins: 'image media table lists fullscreen link',
        // 汉化
        language: 'zh_CN',
        height: 350,
        // images_upload_handler: this.imagesUploadHandler,
        // images_upload_url: 'https://la-service-q.siemens.com.cn/lapoc/sca/fileCtrl/upload', // 图片上传地址（绝对地址）
        // images_upload_base_path: 'https://la-service-q.siemens.com.cn/lapoc/sca/fileCtrl/upload', // 图片上传地址（相对地址）
        file_picker_types: 'file image media',
        file_picker_callback: this.filePickerCallback,
        media_poster: false,
        media_alt_source: true,
        audio_template_callback: function(data) {
          console.log('audio_template_callback', data)
          return `
            <audio controls src="${data.source}" >
                Your browser does not support audio elements.
            </audio>
          `
        },
        video_template_callback: function(data) {
          console.log('video_template_callback', data)
          data.width = '100%'
          data.height = 'auto'
          return `
            <div>
              <video controls src="${data.source}" width="${data.width}" height="${data.height}">
                Your browser does not support video elements.
              </video>
            </div>
          `
        }
        // media_url_resolver: function(data, resolve) {
        //   console.log('media_url_resolver', data, resolve)
        //   try {
        //     const videoUri = encodeURI(data.url)
        //     const embedHtml = `<p>
        //           <span
        //             class="mce-object mce-object-video"
        //             data-mce-selected="1"
        //             data-mce-object="video"
        //             data-mce-p-width="100%"
        //             data-mce-p-height="auto"
        //             data-mce-p-controls="controls"
        //             data-mce-p-controlslist="nodownload"
        //             data-mce-p-allowfullscreen="true"
        //             data-mce-p-src=${videoUri} >
        //             <video src=${data.url} width="100%" height="auto" controls="controls" controlslist="nodownload">
        //             </video>
        //           </span>
        //         </p>
        //         <p style="text-align: left;"></p>`
        //     resolve({ html: embedHtml })
        //   } catch (e) {
        //     resolve({ html: '' })
        //   }
        // }
      }
    }
  },
  watch: {
    content: {
      handler(newVal, oldVal) {
        this.$emit('input', this.content)
      },
      deep: true
    }
  },
  mounted() {
    this.content = this.value
  },
  methods: {
    // 图片上传（暂时交给附件上传实现）
    imagesUploadHandler(blobInfo, succFun, failFun) {
      const file = blobInfo.blob() // 转化为易于理解的file对象
      const formData = new FormData()
      formData.append('file', file, file.name) // 此处与源文档不一样
      fileCtrlUpload(formData)
        .then(res => {
          succFun(res.data)
        })
        .catch(err => {
          failFun('HTTP Error: ' + err)
        })
    },
    // 附件上传
    filePickerCallback(callback, value, meta) {
      const _this = this
      // 文件分类
      let filetype =
        '.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4'
      switch (meta.filetype) {
        case 'image':
          filetype = this.allowImageTypeList
            .map(item => {
              return '.' + item + ','
            })
            .join(' ')
          break
        case 'media':
          filetype = [...this.allowRadioTypeList, ...this.allowVideoTypeList]
            .map(item => {
              return '.' + item + ','
            })
            .join(' ')
          break
        case 'file':
        default:
      }
      var input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', filetype)
      input.click()
      input.onchange = function() {
        const file = this.files[0]
        const formData = new FormData()
        formData.append('file', file, file.name)
        const valid = _this.validateFile(meta.filetype, file)
        if (!valid) {
          return
        }
        _this.showFullScreenLoading()
        fileCtrlUpload(formData)
          .then(res => {
            callback(res.data)
            _this.closeFullScreenLoading()
          })
          .catch(err => {
            console.log('附件上传失败', err)
          })
      }
    },
    // 验证附件是否可以上传
    validateFile(selectedFileType, file) {
      let flag = true
      let message = ''
      const actualFileType = this.getFileType(file.name)
      const actualFileSize = file.size
      if (selectedFileType === 'image') {
        if (actualFileType === 'image') {
          if (actualFileSize > this.maxImageSize) {
            message = 'The Picture Should Not Exceed 2m at Most'
            // message = '图片大小不能超过2M'
            flag = false
          } else {
            flag = true
          }
        } else {
          message = 'Please Upload ' + this.allowImageTypeList + ' File Type'
          flag = false
        }
      } else if (selectedFileType === 'media') {
        if (actualFileType === 'video') {
          if (actualFileSize > this.maxVideoSize) {
            message = 'The Video Should Not Exceed 1000m at Most'
            // message = '视频大小不能超过30M'
            flag = false
          } else {
            flag = true
          }
        } else if (actualFileType === 'radio') {
          if (actualFileSize > this.maxAudioSize) {
            message = 'The Radio Should Not Exceed 10m at Most'
            // message = '音频文件不能超过5M'
            flag = false
          } else {
            flag = true
          }
        } else {
          message =
            'Please Upload ' +
            this.allowVideoTypeList +
            ',' +
            this.allowRadioTypeList +
            ' File Type'
          flag = false
        }
      }
      if (message) {
        Message({
          message: message,
          type: 'warning',
          duration: 5 * 1000
        })
      }
      return flag
    },
    // 获取附件类型
    getFileType(fileName) {
      // 后缀获取
      let suffix = ''
      // 获取类型结果
      let result = ''
      try {
        const flieArr = fileName.split('.')
        suffix = flieArr[flieArr.length - 1]
      } catch (err) {
        suffix = ''
      }
      // fileName无后缀返回 false
      if (!suffix) {
        return false
      }
      suffix = suffix.toLocaleLowerCase()
      // 图片格式
      const imglist = this.allowImageTypeList
      // 进行图片匹配
      result = imglist.find(item => item === suffix)
      if (result) {
        return 'image'
      }
      // 匹配txt
      const txtlist = ['txt']
      result = txtlist.find(item => item === suffix)
      if (result) {
        return 'txt'
      }
      // 匹配 excel
      const excelist = ['xls', 'xlsx']
      result = excelist.find(item => item === suffix)
      if (result) {
        return 'excel'
      }
      // 匹配 word
      const wordlist = ['doc', 'docx']
      result = wordlist.find(item => item === suffix)
      if (result) {
        return 'word'
      }
      // 匹配 pdf
      const pdflist = ['pdf']
      result = pdflist.find(item => item === suffix)
      if (result) {
        return 'pdf'
      }
      // 匹配 ppt
      const pptlist = ['ppt', 'pptx']
      result = pptlist.find(item => item === suffix)
      if (result) {
        return 'ppt'
      }
      // 匹配 视频
      const videolist = this.allowVideoTypeList
      result = videolist.find(item => item === suffix)
      if (result) {
        return 'video'
      }
      // 匹配 音频
      const radiolist = this.allowRadioTypeList
      result = radiolist.find(item => item === suffix)
      if (result) {
        return 'radio'
      }
      // 其他 文件类型
      return 'other'
    },
    // showFullScreenLoading
    showFullScreenLoading() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.fullscreenLoading = loading
      setTimeout(() => {
        loading.close()
      }, 50000)
    },
    // closeFullScreenLoading
    closeFullScreenLoading() {
      this.fullscreenLoading.close()
    }
  }
}
</script>
