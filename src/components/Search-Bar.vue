<template>
    <div class="ys-search-bar flex-box">
        <input class="ys-input" name="search" type="text" placeholder="请输入工业领域关键词" v-model.trim="mes" @input="lazyQuery" @click="clickInput" @keyup.enter.prevent="clickSearch" @keyup.up.prevent="onkeyup" @keyup.down.prevent="onkeydown" autocomplete="off" maxlength="50">
        <div class="ys-association" v-if="isAssociation">
            <ul>
                <li class="ys-keywords single-line" :class="hover(index)" v-for="(item, index) in keywords" @click="choose(index)" v-html="item"></li>
            </ul>
        </div>
        <a class="ys-submit" href="javascript:;" @click="clickSearch"></a>
    </div>
</template>

<script>
    import config from '../../config/config'
    import _ from 'lodash'
    
    const data = {
        isAssociation: false, //联想框显示状态（true：显示，false：关闭）
        mes: '', //输入搜索关键词
        keywords: [], //联想词
        index: -1, //联想词索引
        lastWord: null, //记录上一次输入的关键词
        lazyQuery: null //输入联想防抖动
    }
    export default {
        name: 'searchBar',
        methods: {
            fetchKeyword() {
                let self = this;
                if (!self.mes) {
                    self.isAssociation = false;
                    return;
                }
                self.$http({
                    url: config.url.api + '/es/search/suggestProduct',
                    method: 'POST',
                    body: {
                        keyword: self.mes
                    },
                    before: () => {
                        self.$set(data, 'keywords', []);
                        self.$set(data, 'index', -1);
                    }
                }).then(res => {
                    if (res.body.code === 0) {
                        if (self.$el.querySelector('.ys-input') === document.activeElement) {
                            self.isAssociation = true;
                            self.$set(data, 'keywords', res.body.data);
                        }
                    } else {
                        self.$set(data, 'keywords', []);
                        console.log('returnErr: %o', res.body);
                    }
                }, res => {
                    console.log('requestErr: %o', res);
                }).catch(error => {
                    console.log('systemErr: %s', error);
                });
            },
            clickInput() {
                let self = this;
                if (self.mes) {
                    if (self.lastWord) {
                        if (self.mes !== self.lastWord) {
                            self.fetchKeyword();
                            self.lastWord = self.mes;
                        } else {
                            self.isAssociation = true;
                        }
                    } else {
                        self.fetchKeyword();
                        self.lastWord = self.mes;
                    }
                }
            },
            clickSearch() {
                let self = this;
                self.mes = self.mes;
                if (self.mes) {
                    self.$emit('search', {
                        searchType: self.$route.query.ys_t || 0,
                        keyword: self.mes,
                        offset: 1
                    });
                    self.$el.querySelector('.ys-input').blur();
                    self.isAssociation = false;
                } else {
                    self.$router.push('/');
                }
            },
            choose(index) {
                let self = this;
                self.mes = self.$el.querySelectorAll('.ys-keywords')[index].textContent;
                self.$emit('search', {
                    searchType: self.$route.query.ys_t || 0,
                    keyword: self.mes,
                    offset: 1
                });
                self.isAssociation = false;
            },
            onkeyup() {
                let self = this;
                if (self.index > 0) {
                    self.index--;
                    self.mes = self.$el.querySelectorAll('.ys-keywords')[self.index].textContent;
                }
            },
            onkeydown() {
                let self = this;
                if (self.index < self.keywords.length - 1) {
                    self.index++;
                    self.mes = self.$el.querySelectorAll('.ys-keywords')[self.index].textContent;
                }
            },
            hover(index) {
                return index === this.index ? 'hover' : '';
            }
        },
        watch: {
            '$route' (to, from) {
                let self = this;
                self.mes = to.query.ys_k;
                self.isAssociation = false;
            }
        },
        created() {
            let self = this;
            self.mes = self.$route.query.ys_k ? self.$route.query.ys_k : self.mes;
            window.addEventListener('click', function(e) {
                if (e.target.className !== 'ys-input') {
                    self.isAssociation = false;
                }
            });
            self.lazyQuery = _.debounce(self.fetchKeyword, 500);
        },
        data() {
            return data
        }
    }
</script>

<style>
    .ys-search-bar {
        position: relative;
        margin: 0 auto;
    }
    
    .ys-search-bar .ys-input {
        box-sizing: border-box;
        width: 602px;
        height: 45px;
        padding: 0 10px;
        border: 1px solid #ccc;
    }
    
    .ys-search-bar .ys-association {
        position: absolute;
        left: 0;
        top: 45px;
        box-sizing: border-box;
        width: 600px;
        border: 1px solid #bbb;
        box-shadow: 1px 1px 1px 0 #bbb;
        background: #fff;
        z-index: 10;
    }
    
    .ys-association ul li {
        height: 25px;
        padding-left: 10px;
        line-height: 25px;
        font-size: 14px;
        text-align: left;
        color: #000;
        cursor: pointer;
    }
    
    .ys-association ul li:hover,
    .ys-association ul li.hover {
        background: #f0f0f0;
    }
    
    .ys-search-bar .ys-submit {
        display: block;
        width: 80px;
        height: 45px;
        text-decoration: none;
        background: url('../assets/images/search.png') no-repeat center center #0075e8;
        background-size: 24px 24px;
    }
    
    .ys-search-bar .ys-submit:hover {
        background-color: #007ffc;
    }
</style>
