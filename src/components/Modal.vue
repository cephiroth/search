<template>
    <section v-if="open">
        <div class="ys-modal" v-if="!submitStatus">
            <div class="modal-header">意见反馈<i class="icon-close" @click="close"></i></div>
            <div class="upload-error" v-if="errorMsg !== ''"><i></i><span>{{errorMsg}}</span></div>
            <form id="feedback" name="feedback">
                <div class="modal-content">
                    <div class="modal-input flex-box">
                        <span class="title"><b>*</b>反馈内容</span>
                        <textarea class="flex" name="context" maxlength="240" v-model.trim="context"></textarea>
                    </div>
                    <div class="modal-input flex-box" v-if="!testIE()">
                        <span class="upload-btn"><i></i>添加图片<input type="file" name="files" class="upload" multiple @change="upload"></span>
                        <span class="upload-tip" v-if="count > 0">已上传<b>{{count}}</b>张图片</span>
                    </div>
                    <div class="modal-input flex-box">
                        <span class="title lh-40">手机号</span>
                        <input class="flex" type="text" name="phone" maxlength="11" v-model.trim="phone" @keyup="phone=phone.replace(/[^0-9]/g,'')">
                    </div>
                    <div class="modal-input flex-box">
                        <span class="title lh-40">常用邮箱</span>
                        <input class="flex" type="text" name="email" v-model.trim="email" maxlength="40">
                    </div>
                </div>
                <div class="modal-footer"><a href="javascript:;" @click="submit">提交</a></div>
            </form>
        </div>
        <div class="ys-modal-mask"></div>
        <div class="ys-submit-modal" v-if="submitStatus">
            <div class="modal-header"><i class="icon-success"></i>提交成功</div>
            <div class="modal-content">感谢您的支持，我们将尽快处理您的问题，谢谢！</div>
            <div class="modal-footer"><a href="javascript:;" @click="close">确定</a></div>
        </div>
    </section>
</template>

<script>
    import config from '../../config/config'

    const data = {
        context: '',//反馈内容
        phone: '',//电话
        email: '',//邮箱
        errorMsg: '',//错误提示
        count: 0,//上传图片张数
        submitStatus: false,//提交成功提示框状态（true：显示，false：关闭）
        fd: new FormData()//缓存FormData对象
    }
    export default {
        name: 'modal',
        props: ['open'],
        methods: {
            close() {
                let self = this;
                self.$set(data, 'context', '');
                self.$set(data, 'phone', '');
                self.$set(data, 'email', '');
                self.$set(data, 'errorMsg', '');
                self.$set(data, 'count', 0);
                self.$set(data, 'submitStatus', false);
                self.$set(data, 'fd', new FormData());
                self.$emit('close', false);
            },
            upload(e) {
                let self = this;
                let format = 'jpg,jpeg,png,gif';
                let maxSize = 600 * 1024; //最大600kb
                let flag = true;
                for (let i = 0; i < e.target.files.length; i++) {
                    if (format.indexOf(e.target.files[i].name.split('.').pop().toLowerCase()) < 0 || e.target.files[i].size > maxSize) {
                        flag = false;
                        break;
                    }
                }
                if (!flag || self.count === 3 || e.target.files.length > 3) {
                    self.$set(data, 'errorMsg', '请上传JPG，JPEG，PNG，GIF格式图片，单张不超过600KB，最多3张');
                    return;
                } else {
                    self.$set(data, 'errorMsg', '');
                    [].forEach.call(e.target.files, file => {
                        self.fd.append('files', file);
                    })
                }
                self.$set(data, 'count', self.count + e.target.files.length);
                e.target.value = '';
            },
            validate() {
                let self = this;
                if (self.context === '') {
                    self.$set(data, 'errorMsg', '请填写反馈内容');
                    return false;
                } else {
                    self.$set(data, 'errorMsg', '');
                }
                return true;
            },
            submit() {
                let self = this;
                if (self.validate()) {
                    self.fd.append('context', self.context);
                    self.fd.append('phone', self.phone);
                    self.fd.append('email', self.email);
                    self.$http({
                        url: config.url.api + '/es/search/feedback',
                        method: 'POST',
                        body: self.fd,
                        before: () => {
                            self.$emit('loading', true);
                        }
                    }).then(res => {
                        self.$emit('loading', false);
                        if (res.body.code === 0) {
                            self.$set(data, 'submitStatus', true);
                            self.$set(data, 'fd', new FormData());
                        } else {
                            self.$set(data, 'errorMsg', '提交失败，请稍后再试');
                            console.log('returnErr: %o', res.body);
                        }
                    }, res => {
                        self.$set(data, 'errorMsg', '提交失败，请稍后再试');
                        console.log('requestErr: %o', res.body);
                    }).catch(error => {
                        self.$set(data, 'errorMsg', '提交失败，请稍后再试');
                        console.log('systemErr: %s', error);
                    });
                }
            },
            testIE() {
                let version = navigator.appVersion.split(";");
                if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) {
                    if (version.length > 1) {
                        let trim_Version = parseInt(version[1].replace(/[ ]/g, "").replace(/MSIE/g, ""));
                        if (trim_Version < 10) {
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        data() {
            return data
        }
    }
</script>

<style>
    .ys-modal-mask {
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 90;
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    
    .ys-modal {
        position: fixed;
        left: 50%;
        top: 50%;
        margin-left: -243px;
        width: 487px;
        background: #fff;
        border-radius: 3px;
        -moz-transform: translate(0, -50%);
        -webkit-transform: translate(0, -50%);
        -o-transform: translate(0, -50%);
        -ms-transform: translate(0, -50%);
        transform: translate(0, -50%);
        z-index: 91;
    }

    .ys-submit-modal {
        position: fixed;
        left: 50%;
        top: 50%;
        margin-left: -200px;
        width: 400px;
        background: #fff;
        border-radius: 3px;
        -moz-transform: translate(0, -50%);
        -webkit-transform: translate(0, -50%);
        -o-transform: translate(0, -50%);
        -ms-transform: translate(0, -50%);
        transform: translate(0, -50%);
        z-index: 91;
    }

    .ys-submit-modal .modal-header {
        text-align: center;
    }
    .ys-submit-modal .modal-content {
        padding: 20px;
        font-size: 14px;
        text-align: center;
    }
    .ys-submit-modal .modal-footer a {
        width: 100px;
        height: 30px;
        line-height: 30px;
    }
    
    .modal-header {
        position: relative;
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        background: #0075e8;
        color: #fff;
        border-top-right-radius: 3px;
        border-top-left-radius: 3px;
    }
    .modal-header .icon-success {
        display: inline-block;
        margin-top: -3px;
        margin-right: 5px;
        width: 16px;
        height: 16px;
        background: url('../assets/images/success.png') no-repeat center center;
        background-size: contain;
        vertical-align: middle;
    }
    .modal-header .icon-close {
        position: absolute;
        top: 0;
        right: 0;
        display: inline-block;
        width: 40px;
        height: 40px;
        background: url('../assets/images/close.png') no-repeat center center;
        background-size: 16px 16px;
        vertical-align: middle;
        cursor: pointer;
    }
    
    .modal-content {
        padding: 10px 20px 20px;
    }
    
    .modal-content .modal-input {
        margin-top: 15px;
        font-size: 14px;
        color: #333;
    }
    
    .modal-content .modal-input:first-child {
        margin-top: 0;
    }
    
    .modal-input .title {
        display: inline-block;
        margin-right: 10px;
        width: 66px;
        text-align: right;
    }
    
    .modal-input .title b {
        margin-right: 2px;
        font-weight: normal;
        color: #dd2726;
    }
    
    .modal-input textarea {
        padding: 5px;
        min-width: 365px;
        height: 112px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        resize: none;
    }
    
    .modal-input input[type="text"] {
        padding: 5px;
        min-width: 365px;
        height: 40px;
        border: 1px solid #ccc;
        box-sizing: border-box;
    }
    
    .modal-input .upload-btn {
        position: relative;
        display: inline-block;
        margin-left: 76px;
        width: 100px;
        height: 30px;
        font-size: 14px;
        line-height: 28px;
        color: #666;
        background: #f8f8f8;
        border: 1px solid #ccc;
        border-radius: 3px;
        box-sizing: border-box;
    }
    
    .modal-input .upload-btn i {
        display: inline-block;
        margin-left: 10px;
        margin-top: -2px;
        margin-right: 5px;
        width: 16px;
        height: 16px;
        background: url('../assets/images/add.png') no-repeat center center;
        background-size: contain;
        vertical-align: middle;
    }
    
    .modal-input input[type="file"] {
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 30px;
        opacity: 0;
        filter: alpha(opacity=0);
        cursor: pointer;
    }
    
     ::-ms-browse,
    [type='file'] {
        cursor: pointer;
    }
    
     ::-webkit-file-upload-button {
        cursor: pointer;
    }
    
    .modal-input .upload-tip {
        margin-left: 10px;
        line-height: 30px;
        font-size: 14px;
        color: #333;
    }
    
    .modal-input .upload-tip b {
        margin: 0 5px;
        font-weight: normal;
        color: #dd2726;
    }
    
    .modal-footer {
        padding-bottom: 20px;
        text-align: center;
    }
    
    .modal-footer a {
        display: inline-block;
        width: 120px;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        color: #fff;
        background: #0075e8;
        border-radius: 3px;
    }
    .modal-footer a:hover{
        text-decoration: none !important;
    }
    
    .upload-error {
        margin: 10px 20px 0 96px;
        padding: 0 5px;
        line-height: 24px;
        font-size: 14px;
        color: #dd2726;
        background: #ffebeb;
        border: 1px solid #faccc6;
        box-sizing: border-box;
    }
    
    .upload-error i {
        display: inline-block;
        margin-top: -2px;
        margin-right: 10px;
        width: 16px;
        height: 16px;
        background: url('../assets/images/error.png') no-repeat center center;
        background-size: contain;
        vertical-align: middle;
    }
</style>