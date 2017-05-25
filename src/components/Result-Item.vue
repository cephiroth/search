<template>
    <dl class="ys-result-item">
        <dt class="ys-result-title single-line">
                <a :href="base64Url(item.url)" target="_blank" v-if="item.type === 1 || item.type === 2" v-html="item.name"></a>
                <a :href="base64Url(item.url)" target="_blank" v-if="item.type === 3 || item.type === 4" v-html="item.enterpriseName"></a>
            </dt>
        <div class="flex-box">
            <dd class="ys-result-img" v-if="item.type === 1 || item.type === 2" :style="'backgroundImage: url(' + buildImgUrl(item) + ')'">
                <a :href="base64Url(item.url)" target="_blank">
                    <img @error="errorHandler" :src="buildImgUrl(item)">
                </a>
            </dd>
            <dd class="ys-result-desc-l enterprise" v-if="item.type === 3 || item.type === 4">
                <p class="single-line">主营产品：<span class="ys-result-mainScope" v-html="item.mainScope || '-'"></span></p>
                <p class="single-line">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：<span class="ys-result-area" v-html="item.area || '-'"></span></p>
                <p class="flex-box">
                    <span class="title">简&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;介：</span>
                    <span class="ys-result-enterpriseDetail line-clamp-3 ys-clamp-3" v-html="item.enterpriseDetail || '-'"></span>
                </p>
            </dd>
            <dd class="ys-result-desc-l product" v-if="item.type === 1 || item.type === 2">
                <p class="single-line">品&nbsp;&nbsp;&nbsp;牌：<span class="ys-result-brandName" v-html="item.brandName || '-'"></span></p>
                <p class="single-line">型&nbsp;&nbsp;&nbsp;号：<span class="ys-result-model" v-html="item.model || '-'"></span></p>
                <p class="single-line">供应商：<span class="ys-result-enterpriseName" v-html="item.enterpriseName || '-'"></span></p>
                <p class="single-line">所在地：<span class="ys-result-area" v-html="item.area || '-'"></span></p>
                <p class="flex-box" v-if="item.detail.length > 0">
                    <span class="title">描&nbsp;&nbsp;&nbsp;述：</span>
                    <span class="ys-result-detail line-clamp-3 ys-clamp-3" v-html="buildData(item.detail)"></span>
                </p>
                <p class="flex-box" v-if="item.detail.length===0 && item.introduce">
                    <span class="title">描&nbsp;&nbsp;&nbsp;述：</span>
                    <span class="ys-result-introduce line-clamp-3 ys-clamp-3" v-html="item.introduce"></span>
                </p>
            </dd>
            <dd class="ys-result-desc-r flex">
                <p class="single-line" v-if="item.type === 1 || item.type === 2">参考价：<span class="ys-result-price" :class="item.price?'':'no-price'" v-html="item.price || '面议'"></span></p>
                <p class="single-line">电&nbsp;&nbsp;&nbsp;话：<span class="ys-result-phone" v-html="item.phone || '-'"></span></p>
                <p class="single-line">来&nbsp;&nbsp;&nbsp;源：<span class="ys-result-from" v-html="item.from || '-'"></span></p>
                <a :href="base64Url(item.url)" target="_blank" class="ys-result-from">查看详情>></a>
            </dd>
        </div>
    </dl>
</template>

<script>
    import Base64 from '../assets/javascripts/Base64'
    import config from '../../config/config'
    
    export default {
        name: 'resultItem',
        props: ['item', 'total', 'index'],
        methods: {
            errorHandler() {
                this.$el.querySelector('.ys-result-img').style.backgroundImage = 'url(/static/images/default.jpg)';
            },
            buildImgUrl(item) {
                if (item.imgurl === '') {
                    return '/static/images/default.jpg';
                } else {
                    return item.imgurl.indexOf('.') !== -1 ? 'https://www.yunsom.com/ys_img/' + item.imgurl : config.url.pic + item.imgurl;
                }
            },
            buildData(details) {
                let detail = '';
                details.forEach((o, i) => {
                    detail += i === details.length - 1 ? o.attrKey.trim() + ':' + o.attrValue.trim() : o.attrKey.trim() + ':' + o.attrValue.trim() + '；';
                })
                return detail;
            },
            base64Url(str) {
                let pageLen = new Base64().decode(this.$route.query.ys_r).substr(-1, 1);
                let page = new Base64().decode(this.$route.query.ys_r).substr(0, pageLen);
                return config.url.redirect + encodeURIComponent(new Base64().encode(new Base64().encode(str) + '&total=' + this.total + '&keyword=' + this.$route.query.ys_k + '&offset=' + this.index + '&page=' + page));
            }
        }
    }
</script>

<style>
    .ys-result-item {
        padding-top: 25px;
        padding-bottom: 20px;
        border-bottom: 1px dotted #ccc;
        overflow: hidden;
    }
    
    .ys-result-item:first-child {
        border-top: 1px dotted #ccc;
    }
    
    .ys-result-item:hover {
        background: #f8f8f8;
    }
    
    .ys-result-title {
        margin-bottom: 15px;
        width: 655px;
        height: 20px;
        line-height: 20px;
    }
    
    .ys-result-title a {
        color: #0000cc;
    }
    
    a:hover {
        text-decoration: underline;
    }
    
    .ys-result-item dd {
        float: left;
    }
    
    .ys-result-item dd em {
        font-style: normal;
    }
    
    .ys-result-img {
        margin-right: 10px;
        width: 150px;
        height: 95px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
    }
    
    .ys-result-img a {
        display: block;
        width: 150px;
        height: 95px;
    }
    
    .ys-result-img img {
        display: none;
        width: 150px;
        height: 95px;
    }
    
    .ys-result-desc-l,
    .ys-result-desc-r {
        margin-top: -5px;
    }
    
    .ys-result-desc-l p {
        font-size: 14px;
        line-height: 24px;
        color: #999;
    }
    
    .ys-result-desc-l p .title {
        color: #999;
    }
    
    .ys-result-desc-l span {
        color: #333;
    }
    
    .enterprise {
        width: 655px !important;
    }
    
    .product {
        width: 490px !important;
    }
    
    .ys-result-desc-r {
        margin-left: 40px;
        width: 214px;
        font-size: 14px;
    }
    
    .ys-result-desc-r p {
        line-height: 24px;
        color: #999;
        word-break: break-all;
    }
    
    .ys-result-desc-r span {
        color: #333;
    }
    
    .ys-result-desc-r .no-price {
        font-size: 16px;
        font-weight: normal;
        color: #dd2727 !important;
    }
    
    .ys-result-desc-r .price {
        margin-right: 5px;
        font-size: 20px;
        font-weight: normal;
        color: #dd2727 !important;
    }
    
    .ys-result-desc-r a {
        display: block;
        line-height: 24px;
        color: #0075e8;
    }
    
    .red {
        font-weight: normal;
        color: #dd2727 !important;
    }
    
    .ys-result-desc-l .ys-clamp-3 {
        max-height: 70px;
        word-break: break-all;
    }
</style>