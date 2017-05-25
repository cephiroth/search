<template>
    <section class="ys-search has-bg">
        <header class="ys-main-header">
            <div class="ys-header-content">
                <img src="../assets/images/logo-main.png">
                <a href="javascript:;" class="ys-feedback" @click="open = true"><i class="icon-feedback"></i>意见反馈</a>
            </div>
        </header>
        <div class="ys-main-wrap">
            <p class="ys-title">工业搜索平台</p>
            <p class="ys-slogan">聚焦工业领域，精准定位信息，高效连接企业</p>
            <searchBar @search="searchResult"></searchBar>
            <div class="ys-hishory flex-box" v-if="historys.length > 0">
                <div><i class="icon-history"></i>最近搜过：</div>
                <div class="flex">
                    <span v-for="(history, index) in historys" @mouseover="hishoryIndex = index" @mouseout="hishoryIndex = -1">
                        <a class="single-line search-word" :title="history" :href="'/search?ys_k='+history+'&ys_r='+makeRandomStr()+'&ys_t=0'">{{history}}
                        </a><i class="icon-delete" @click="deleteHistory(index)" v-show="hishoryIndex === index"></i>
                    </span>
                </div>
            </div>
            <div class="ys-popular flex-box" v-if="hots.length > 0">
                <div><i class="icon-hot"></i>热门搜索：</div>
                <div class="flex"><a class="single-line search-word" :title="hot" :href="'/search?ys_k='+hot+'&ys_r='+makeRandomStr()+'&ys_t=0'" v-for="hot in hots">{{hot}}</a></p></div>
            </div>
        </div>
        <modal :open="open" @close="closeModal" @loading="loadingStatus"></modal>
        <bottom :fixed="true"></bottom>
        <loading v-if="status"></loading>
    </section>
</template>

<script>
    import Base64 from '../assets/javascripts/Base64'
    import config from '../../config/config'
    import searchBar from '../components/Search-Bar'
    import modal from '../components/Modal'
    import loading from '../components/Loading'
    import bottom from '../layouts/Bottom'
    
    const data = {
        historys: [], //历史搜索
        hots: [], //热门搜索
        open: false, //反馈窗口显示状态（true：开启，false：关闭）
        status: false, //loading显示状态（true：开启，false：关闭）
        hishoryIndex: -1 //最近搜索索引
    }
    export default {
        name: 'main',
        components: {
            searchBar,
            modal,
            loading,
            bottom
        },
        methods: {
            searchResult(obj) {
                let self = this;
                self.$router.push({
                    path: 'search',
                    query: {
                        ys_k: obj.keyword,
                        ys_r: self.makeRandomStr(obj.offset, obj.offset.toString().length),
                        ys_t: 0
                    }
                });
            },
            getHot() {
                let self = this;
                self.$http({
                    url: config.url.api + '/es/search/rsHot',
                    method: 'POST',
                    body: {
                        type: 1
                    }
                }).then(res => {
                    if (res.body.code === 0) {
                        self.$set(data, 'hots', res.body.data);
                    } else {
                        console.log('returnErr: %o', res.body);
                    }
                }, res => {
                    console.log('requestErr: %o', res);
                }).catch(error => {
                    console.log('systemErr: %s', error);
                });
            },
            getHistory() {
                let self = this;
                let historysArr = [];
                if (self.$cookie.get('ys_uid')) {
                    //如果获取到了cookie
                    if (self.$cookie.get('history_0')) {
                        for (let i = 0; i < 10; i++) {
                            if (self.$cookie.get('history_' + i)) {
                                historysArr.push(self.$cookie.get('history_' + i));
                            } else {
                                break;
                            }
                        }
                        self.$set(data, 'historys', historysArr);
                    }
                } else {
                    self.$http({
                        url: config.url.api + '/es/search/getUid',
                        method: 'POST',
                        body: {}
                    }).then(res => {
                        if (res.body.code === 0) {
                            self.$cookie.set('ys_uid', res.body.data, {
                                expires: '10Y'
                            });
                        } else {
                            console.log('returnErr: %o', res.body);
                        }
                    }, res => {
                        console.log('requestErr: %o', res);
                    }).catch(error => {
                        console.log('systemErr: %s', error);
                    });
                }
            },
            deleteHistory(index) {
                let self = this;
                for (let i = 0; i < 10; i++) {
                    if (self.$cookie.get('history_' + i)) {
                        self.$cookie.delete('history_' + i);
                    } else {
                        break;
                    }
                }
                self.historys.splice(index, 1);
                for (let i = 0; i < self.historys.length; i++) {
                    self.$cookie.set('history_' + i, self.historys[i], {
                        expires: '10Y'
                    });
                }
            },
            closeModal(flag) {
                this.$set(data, 'open', flag);
            },
            loadingStatus(flag) {
                this.$set(data, 'status', flag);
            },
            makeRandomStr(page = 1, len = 1) {
                return new Base64().encode(page + new Date().getTime().toString() + len);
            },
            goToMobile() {
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    location.href = config.url.mobile;
                    return;
                }
            }
        },
        created() {
            this.goToMobile();
            this.getHistory();
            this.getHot();
        },
        data() {
            return data
        }
    }
</script>

<style>
    .ys-search {
        position: relative;
        width: 100%;
        height: 100%;
    }
    
    .has-bg {
        background: url('../assets/images/bg.jpg') no-repeat top center;
        background-size: 847px 391px;
    }
    
    .ys-main-header {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #ddd;
        box-sizing: border-box;
    }
    
    .ys-main-header .ys-header-content {
        width: 1200px;
        margin: 0 auto;
        overflow: hidden;
    }
    
    .ys-header-content img {
        float: left;
        margin-top: 10px;
    }
    
    .ys-header-content .ys-feedback {
        float: right;
        font-size: 14px;
        color: #999;
    }
    
    .ys-feedback .icon-feedback {
        display: inline-block;
        margin-top: -5px;
        margin-right: 6px;
        width: 19px;
        height: 20px;
        background: url('../assets/images/edit.png') no-repeat center center;
        background-size: contain;
        vertical-align: middle;
    }
    
    .ys-feedback:hover {
        color: #0075e8 !important;
        text-decoration: none !important;
    }
    
    .ys-feedback:hover .icon-feedback {
        background-image: url('../assets/images/edit_blue.png');
    }
    
    .ys-submit {
        float: left;
    }
    
    .ys-main-wrap {
        position: absolute;
        padding-top: 165px;
        left: 50%;
        -moz-transform: translate(-50%, 0);
        -webkit-transform: translate(-50%, 0);
        -o-transform: translate(-50%, 0);
        -ms-transform: translate(-50%, 0);
        transform: translate(-50%, 0);
    }
    
    .ys-main-wrap .ys-title {
        font-size: 36px;
        font-weight: bold;
        text-align: center;
        color: #333;
    }
    
    .ys-main-wrap .ys-slogan {
        margin-top: 15px;
        margin-bottom: 45px;
        font-size: 18px;
        font-style: italic;
        text-align: center;
        color: #666;
    }
    
    .ys-hishory,
    .ys-popular {
        width: 682px;
        margin-top: 12px;
        line-height: 20px;
        font-size: 14px;
        color: #999;
    }
    
    .ys-hishory a,
    .ys-popular a {
        display: inline-block;
        color: #0075e8;
    }
    
    .ys-popular a {
        margin-right: 15px;
    }
    
    .ys-hishory a:hover,
    .ys-popular a:hover {
        text-decoration: underline;
    }
    
    .ys-hishory span {
        position: relative;
        display: inline-block;
        margin-right: 20px;
    }
    
    .ys-hishory .icon-history {
        display: inline-block;
        margin-top: -5px;
        margin-right: 5px;
        width: 17px;
        height: 17px;
        background: url('../assets/images/clock.png') no-repeat center center;
        background-size: contain;
        vertical-align: middle;
    }
    
    .ys-hishory .icon-delete {
        position: absolute;
        right: -20px;
        bottom: 5px;
        width: 20px;
        height: 20px;
        background: url('../assets/images/icon-delete.png') no-repeat 3px center;
        background-size: 9px 9px;
        cursor: pointer;
    }
    
    .ys-hishory .icon-delete:hover {
        background: url('../assets/images/icon-delete-red.png') no-repeat 3px center;
        background-size: 9px 9px;
    }
    
    .ys-popular .icon-hot {
        display: inline-block;
        margin-top: -5px;
        margin-left: -3px;
        margin-right: 5px;
        width: 20px;
        height: 20px;
        background: url('../assets/images/tag.png') no-repeat center center;
        background-size: contain;
        vertical-align: middle;
    }
    
    .search-word {
        max-width: 140px;
        height: 20px;
        word-break: break-all;
    }
</style>
