<template>
    <dl class="ys-result-right-item">
        <a :href="base64Url(item.url)" target="_blank">
            <dt class="ys-result-right-img" :style="'backgroundImage: url(' + buildImgUrl(item) + ')'">
                <img @error="errorHandler" :src="buildImgUrl(item)">
            </dt>
        </a>
        <dd class="ys-result-right-desc">
            <a class="line-clamp-2" v-clamp :href="base64Url(item.url)" :title="item.name" v-html="item.name" target="_blank"></a>
        </dd>
    </dl>
</template>

<script>
    import Base64 from '../assets/javascripts/Base64'
    import clamp from '../assets/javascripts/clamp'
    import config from '../../config/config'
    
    export default {
        name: 'recommend',
        props: ['item', 'total', 'index'],
        methods: {
            base64Url(str) {
                return config.url.redirect + encodeURIComponent(new Base64().encode(new Base64().encode(str) + '&total=' + this.total + '&keyword=' + this.$route.query.ys_k + '&offset=' + this.index));
            },
            errorHandler() {
                this.$el.querySelector('.ys-result-right-img').style.backgroundImage = 'url(/static/images/default.jpg)';
            },
            buildImgUrl(item) {
                return item.imgurl.indexOf('.') !== -1 ? 'https://www.yunsom.com/ys_img/' + item.imgurl : config.url.pic + item.imgurl;
            }
        },
        directives: {
            clamp: {
                inserted(el) {
                    clamp(el, {
                        clamp: 2
                    })
                },
                update(el) {
                    clamp(el, {
                        clamp: 2
                    })
                }
            }
        }
    }
</script>

<style>
    .ys-result-right-item {
        float: left;
        margin-left: 20px;
        width: 100px;
        min-height: 136px;
        margin-top: 20px;
    }
    
    .ys-result-right-desc a {
        display: block;
        color: #333;
        font-size: 12px;
        line-height: 150%;
        word-break: break-all;
        cursor: pointer;
    }
    
    .ys-result-right-desc a:hover {
        color: #0000cc;
        text-decoration: underline;
    }
    
    .ys-result-right-img {
        width: 100px;
        height: 100px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }
    
    .ys-result-right-img>img {
        display: none;
    }
</style>