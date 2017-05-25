<template>
    <section class="ys-search">
        <div class="ys-result-wrap">
            <header class="ys-result-header">
                <div class="flex-box">
                    <a href="/"><img src="../assets/images/logo-result.png"></a>
                    <searchBar @search="searchResult"></searchBar>
                </div>
            </header>
            <section class="ys-content">
                <div class="ys-tab">
                    <ul>
                        <li :class="searchType === 0 ? 'active' : ''"><a href="javascript:;" @click="switchType(0)">全部</a></li>
                        <li :class="searchType === 1 ? 'active' : ''"><a href="javascript:;" @click="switchType(1)">产品</a></li>
                        <li :class="searchType === 2 ? 'active' : ''"><a href="javascript:;" @click="switchType(2)">企业</a></li>
                    </ul>
                    <a href="javascript:;" class="ys-feedback" v-if="total > 0" @click="open = true"><i class="icon-feedback"></i>意见反馈</a>
                </div>
                <areaFilter @selectArea="areaResult"></areaFilter>
                <result :total="total" :resultData="resultData" :recommendData="recommendData" v-if="total > 0 && !error"></result>
                <div class="ys-no-result" v-if="total === 0 && !error">
                    <p class="flex-box">
                        <img src="../assets/images/warning.png">
                        <span class="no-result-text flex">很抱歉，没有找到与“<b>{{keyword}}</b>”相关的<span v-if="searchType === 1">产品</span><span v-if="searchType === 2">企业</span>信息，您可以：</span>
                    </p>
                    <ul>
                        <li v-if="searchType > 0"><i></i><a :href="'/search?ys_k='+keyword+'&ys_r='+makeRandomStr()+'&ys_t=0'">去全部搜索：<b>{{keyword}}</b></a></li>
                        <li><i></i><a href="javascript:;" @click="open = true">点击这里</a>进行反馈</li>
                        <li class="flex-box" v-if="searchType !== 2">
                            <div><i></i>去搜索：</div>
                            <div class="flex"><a class="single-line search-word" :title="hot" :href="'/search?ys_k='+hot+'&ys_r='+makeRandomStr()+'&ys_t=' + searchType" v-for="hot in hots">{{hot}}</a></div>
                        </li>
                    </ul>
                </div>
                <div class="ys-error" v-if="error">
                    <p class="flex-box">
                        <img src="../assets/images/warning.png">
                        <span class="flex">很抱歉，服务器开小差啦，请稍后再试吧</span>
                    </p>
                    <ul>
                        <li><i></i><a href="/">回到首页</a></li>
                    </ul>
                </div>
                <div class="ys-content-bottom clearfix" v-if="total > 0 && !error" :class="resultData.length > 3 ? '' : 'pb85'">
                    <pagination :total="total" :current="current" @search="searchResult" v-if="total > 20"></pagination>
                    <div class="ys-satisfaction" v-if="satisfyStatus < 0">
                        您对搜索的结果：
                        <a href="javascript:;" @click="submitSatisfy(1)" class="satisfied" :class="satisfyStatus === 1 ? 'voted': ''">
                        </a><a href="javascript:;" @click="submitSatisfy(0)" class="unsatisfied" :class="satisfyStatus === 0 ? 'voted': ''"></a>
                    </div>
                    <div class="ys-satisfaction" v-if="satisfyStatus > -1">
                        您对搜索的结果：
                        <span class="animated satisfied-voted" :class="satisfyStatus === 1 ? 'voted shake': ''">
                        </span><span class="animated unsatisfied-voted" :class="satisfyStatus === 0 ? 'voted shake': ''"></span>
                    </div>
                </div>
            </section>
        </div>
        <modal :open="open" @close="closeModal" @loading="loadingStatus"></modal>
        <bottom :fixed="resultData.length > 3 ? false : true"></bottom>
        <loading v-if="status"></loading>
    </section>
</template>

<script>
    import Base64 from '../assets/javascripts/Base64'
    import config from '../../config/config'
    import searchBar from '../components/Search-Bar'
    import pagination from '../components/Pagination'
    import loading from '../components/Loading'
    import modal from '../components/Modal'
    import areaFilter from '../components/Area-Filter'
    import bottom from '../layouts/Bottom'
    import result from '../layouts/Result'
    
    const data = {
        resultData: [], //结果数据
        recommendData: [], //推荐数据
        hots: [], //热门搜索
        total: -1, //结果数据总条数（分页需要）
        current: 1, //当前页数（分页需要）
        keyword: '', //搜索关键词
        searchType: -1, //搜索类型（0：全部，1：产品，2：企业）
        open: false, //反馈窗口显示状态（true：开启，false：关闭）
        status: false, //loading显示状态（true：开启，false：关闭）
        error: false, //请求状态（true：错误，false：成功）
        satisfyStatus: -1, //提交满意度状态（1：满意，0：不满意）
        Base64: new Base64() //缓存base64对象，用于base64加密和解密
    };
    export default {
        name: 'main',
        components: {
            searchBar,
            pagination,
            modal,
            areaFilter,
            bottom,
            result,
            loading
        },
        methods: {
            submitSatisfy(status) {
                let self = this;
                if (self.satisfyStatus === -1) {
                    let url = config.url.satisfy + 'page=' + self.current + '&satisfied=' + status + '&keyword=' + self.$route.query.ys_k + '&searchType=' + self.$route.query.ys_t;
                    let img = new Image();
                    img.src = url;
                    self.satisfyStatus = status;
                }
            },
            areaResult(obj) {
                let self = this;
                self.$router.push({
                    query: {
                        ys_k: self.$route.query.ys_k,
                        ys_r: self.makeRandomStr(),
                        ys_t: self.$route.query.ys_t,
                        ys_l: obj && obj.area
                    }
                });
            },
            searchResult(obj) {
                let self = this;
                self.$router.push({
                    query: {
                        ys_k: obj.keyword,
                        ys_r: self.makeRandomStr(obj.offset, obj.offset.toString().length),
                        ys_t: obj.searchType,
                        ys_l: obj.location
                    }
                });
            },
            switchType(type) {
                let self = this;
                self.$router.push({
                    query: {
                        ys_k: self.$route.query.ys_k,
                        ys_r: self.makeRandomStr(),
                        ys_t: type
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
            fetchData(to) {
                let self = this;
                let params = {
                    keyword: to.query.ys_k
                }
                let pageLen = self.Base64.decode(to.query.ys_r).substr(-1, 1);
                params.offset = self.Base64.decode(to.query.ys_r).substr(0, pageLen);
                params.size = 20;
                params.searchType = to.query.ys_t;
                if (to.query.ys_l) {
                    params.area = to.query.ys_l;
                }
                self.storeHistory(params.keyword);
                self.$http({
                    url: config.url.api + '/es/search/product',
                    method: 'POST',
                    body: params,
                    before: () => {
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                        self.$set(data, 'status', true);
                        self.$set(data, 'error', false);
                        self.$set(data, 'resultData', []);
                        self.$set(data, 'total', -1);
                    }
                }).then(res => {
                    self.$set(data, 'status', false);
                    if (res.body.code === 0) {
                        self.$set(data, 'resultData', res.body.data);
                        self.$set(data, 'recommendData', res.body.rsdata);
                        self.$set(data, 'total', res.body.total);
                        self.$set(data, 'current', Number(params.offset));
                        self.$set(data, 'keyword', params.keyword);
                        self.$set(data, 'searchType', Number(params.searchType));
                        res.body.total === 0 && self.getHot();
                    } else {
                        self.$set(data, 'error', true);
                        console.log('returnErr: %o', res.body);
                    }
                }, res => {
                    self.$set(data, 'status', false);
                    self.$set(data, 'error', true);
                    console.log('requestErr: %o', res);
                }).catch(error => {
                    self.$set(data, 'status', false);
                    self.$set(data, 'error', true);
                    console.log('systemErr: %s', error);
                });
            },
            storeHistory(keyword) {
                let self = this;
                let historysArr = [];
                if (self.$cookie.get('ys_uid')) {
                    for (let i = 0; i < 10; i++) {
                        if (self.$cookie.get('history_' + i)) {
                            historysArr.push(self.$cookie.get('history_' + i));
                        } else {
                            break;
                        }
                    }
                    if (historysArr.join(',').indexOf(keyword) > -1) return;
                    historysArr.length > 9 && historysArr.shift();
                    historysArr.push(keyword);
                    for (let i = 0; i < historysArr.length; i++) {
                        self.$cookie.delete('history_' + i);
                        self.$cookie.set('history_' + i, historysArr[i], {
                            expires: '10Y'
                        });
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
            closeModal(flag) {
                this.$set(data, 'open', flag);
            },
            loadingStatus(flag) {
                this.$set(data, 'status', flag);
            },
            makeRandomStr(page = 1, len = 1) {
                return this.Base64.encode(page + new Date().getTime().toString() + len);
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                if (to.fullPath === '/search') {
                    vm.$router.replace('/');
                } else {
                    vm.fetchData(to);
                }
            })
        },
        watch: {
            '$route' (to, from) {
                this.satisfyStatus = -1;
                this.fetchData(to);
            }
        },
        data() {
            return data
        }
    }
</script>

<style>
    .ys-result-wrap .ys-result-header {
        position: fixed;
        left: 0;
        top: 0;
        box-sizing: border-box;
        width: 100%;
        height: 85px;
        background: #fff;
        border-bottom: 1px solid #ebebeb;
        z-index: 10;
    }
    
    .ys-result-header a {
        display: block;
        float: left;
    }
    
    .ys-result-wrap .ys-result-header img {
        margin: 15px 10px 0 20px;
    }
    
    .ys-result-wrap .ys-search-bar {
        float: left;
        margin: 25px 0 0;
    }
    
    .ys-tab {
        position: relative;
        width: 100%;
        height: 40px;
        background: #f8f8f8;
        overflow: hidden;
    }
    
    .ys-tab li {
        float: left;
        margin-right: 20px;
        width: 50px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        box-sizing: border-box;
    }
    
    .ys-tab li.active {
        border-bottom: 2px solid #0075e8;
    }
    
    .ys-tab li.active a {
        color: #0075e8;
    }
    
    .ys-tab ul {
        margin-left: 143px;
        overflow: hidden;
    }
    
    .ys-tab li a {
        display: block;
        width: 50px;
        font-size: 16px;
        color: #333;
    }
    
    .ys-tab li a:hover {
        color: #0075e8;
        text-decoration: none !important;
    }
    
    .ys-tab .ys-feedback {
        position: absolute;
        top: 12px;
        left: 1219px;
        font-size: 14px;
        color: #999;
    }
    
    .ys-content {
        position: relative;
        padding-top: 85px;
        min-height: 500px;
        overflow: hidden;
    }
    
    .ys-content .ys-no-result,
    .ys-content .ys-error {
        margin-left: 143px;
        margin-top: 75px;
        width: 680px;
        font-size: 16px;
        line-height: 26px;
        color: #333;
    }
    
    .ys-content .ys-no-result p {
        margin: 0;
    }
    
    .ys-content .ys-no-result b {
        font-weight: normal;
        color: #dd2727;
    }
    
    .ys-no-result img,
    .ys-error img {
        display: inline-block;
        margin-right: 24px;
        width: 33px;
        height: 29px;
    }
    
    .no-result-text {
        word-break: break-all;
    }
    
    .ys-no-result ul,
    .ys-error ul {
        margin-left: 60px;
        margin-top: 30px;
        font-size: 14px;
    }
    
    .ys-no-result li {
        margin-bottom: 10px;
    }
    
    .ys-no-result li i {
        display: inline-block;
        margin-top: -2px;
        margin-right: 10px;
        width: 7px;
        height: 10px;
        background: url('../assets/images/san.png') no-repeat center center;
        background-size: contain;
        vertical-align: middle;
    }
    
    .ys-error li i {
        display: inline-block;
        margin-top: -2px;
        margin-right: 10px;
        width: 20px;
        height: 15px;
        background: url('../assets/images/icon-back.png') no-repeat center center;
        background-size: contain;
        vertical-align: middle;
    }
    
    .ys-no-result li a,
    .ys-error li a {
        color: #0075e8;
    }
    
    .ys-no-result li .search-word {
        display: inline-block;
        margin-right: 15px;
    }
    
    .ys-no-result li .item {
        margin-right: 15px;
    }
    
    .ys-content-bottom {
        margin-left: 143px;
        width: 909px;
    }
    
    .ys-satisfaction {
        float: right;
        margin-top: 25px;
        margin-bottom: 30px;
        font-size: 14px;
        color: #666;
    }
    
    .ys-satisfaction .satisfied,
    .ys-satisfaction .satisfied-voted {
        display: inline-block;
        width: 44px;
        height: 59px;
        background: url('../assets/images/icon-satisfied.png') no-repeat center center;
        background-size: contain;
        vertical-align: middle;
    }
    
    .ys-satisfaction .satisfied.voted,
    .ys-satisfaction .satisfied-voted.voted {
        background: url('../assets/images/icon-satisfied-red.png') no-repeat center center;
        background-size: contain;
    }
    
    .ys-satisfaction .satisfied:hover {
        background: url('../assets/images/icon-satisfied-red.png') no-repeat center center;
        background-size: contain;
    }
    
    .ys-satisfaction .unsatisfied,
    .ys-satisfaction .unsatisfied-voted {
        display: inline-block;
        margin-left: 15px;
        width: 57px;
        height: 59px;
        background: url('../assets/images/icon-unsatisfied.png') no-repeat center center;
        background-size: contain;
        vertical-align: middle;
    }
    
    .ys-satisfaction .unsatisfied.voted,
    .ys-satisfaction .unsatisfied-voted.voted {
        background: url('../assets/images/icon-unsatisfied-red.png') no-repeat center center;
        background-size: contain;
    }
    
    .ys-satisfaction .unsatisfied:hover {
        background: url('../assets/images/icon-unsatisfied-red.png') no-repeat center center;
        background-size: contain;
    }
</style>
