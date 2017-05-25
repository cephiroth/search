<template>
    <footer :class="fixed ? 'footer-fixed' : ''">
        <p class="ys-links-list">
            <span v-for="(link, index) in links"><em v-if="index > 0">|</em><a :href="link.url" target="_blank">{{link.name}}</a></span>
        </p>
        <p class="ys-copyright"><span>{{copyright}}</span><span>{{company}}</span><span>版权所有&nbsp;备案号：<a :href="record.url" target="_blank">{{record.number}}<img src="../assets/images/icon-record.png"></a></span></p>
    </footer>
</template>

<script>
    const data = {
        links: [{
                url: 'http://yunsomgroup.com/',
                name: '允升官网'
            },
            {
                url: 'http://yunsomgroup.com/solution-search',
                name: '工业搜索'
            },
            {
                url: 'http://yunsomgroup.com/solution-yunsom',
                name: '云供应链'
            },
            {
                url: 'http://yunsomgroup.com/solution-cloud',
                name: '云库房'
            },
            {
                url: 'http://yunsomgroup.com/solution-finace',
                name: '金融平台'
            },
            {
                url: 'http://yunsomgroup.com/about',
                name: '关于允升'
            },
            {
                url: 'https://www.yunsom.com/contact',
                name: '联系我们'
            }
        ],
        copyright: 'Copyright © 2011-2017',
        company: '重庆允升科技有限公司',
        record: {
            url: 'http://www.miitbeian.gov.cn/',
            number: '渝ICP备17000001号-7'
        }
    }
    export default {
        name: 'bottom',
        props: ['fixed'],
        data() {
            return data
        }
    }
</script>

<style>
    footer {
        height: 85px;
        font-size: 14px;
        text-align: center;
        background: #f8f8f8;
        color: #999;
    }
    
    .footer-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
    }
    
    .ys-links-list {
        margin: 0 0 10px;
        padding-top: 20px;
        overflow: hidden;
    }
    
    .ys-links-list span {
        display: inline-block;
    }
    
    footer em {
        font-style: normal;
    }
    
    .ys-links-list span a {
        display: inline-block;
        margin: 0 14px;
        text-decoration: none;
        color: #999;
    }
    
    .ys-copyright {
        margin: 0;
    }
    
    .ys-copyright span {
        display: inline-block;
        margin-right: 20px;
    }
    
    .ys-copyright span a {
        text-decoration: none;
        color: #999;
    }
    
    .ys-copyright span a img {
        margin-left: 4px;
        vertical-align: text-bottom;
    }
    
    footer a:hover {
        color: #333;
    }
</style>
