<template>
    <section class="ys-pagination">
        <button class="ys-prev" v-if="!isFirst" @click="prev">上一页</button>
        <ul v-if="totalPage > 10">
            <li v-for="i in 10" class="page" @click="choosePage(showPage(i))" :class="isActive(i)">
                {{showPage(i)}}
            </li>
        </ul>
        <ul v-if="totalPage <= 10">
            <li v-for="i in totalPage" @click="choosePage(i)" class="page" :class="i === currentPage ? 'active' : ''">{{i}}</li>
        </ul>
        <button class="ys-next" v-if="!isLast" @click="next">下一页</button>
        <input type="hidden" :value="totalPage">
    </section>
</template>

<script>
    const data = {
        currentPage: 1, //当前页数
        totalPage: 0, //总页数
        isFirst: true, //当前页数是否为首页
        isLast: false //当前页数是否为最后一页
    }
    export default {
        name: 'pagination',
        props: ['total', 'current'],
        methods: {
            isActive(i) {
                let self = this,
                    style = '';
                if (self.currentPage < 7 && i === self.currentPage) {
                    style = 'active';
                }
                if (self.currentPage <= self.totalPage - 4 && self.currentPage >= 7 && i === 6) {
                    style = 'active';
                }
                if (self.currentPage > self.totalPage - 4 && i === 10 - self.totalPage + self.currentPage) {
                    style = 'active';
                }
                return style;
            },
            showPage(i) {
                let self = this,
                    page;
                if (self.currentPage < 7) {
                    page = i;
                } else if (self.currentPage > self.totalPage - 4) {
                    page = self.totalPage - 10 + i;
                } else {
                    page = self.currentPage - 6 + i;
                }
                return page;
            },
            prev() {
                let self = this;
                self.isFirst = self.currentPage === 1 ? true : false;
                self.isLast = self.currentPage === self.totalPage ? true : false;
                !self.isFirst && self.currentPage--;
                self.$emit('search', {
                    searchType: self.$route.query.ys_t,
                    keyword: self.$route.query.ys_k,
                    offset: self.currentPage,
                    location: self.$route.query.ys_l
                });
            },
            next() {
                let self = this;
                self.isFirst = self.currentPage === 1 ? true : false;
                self.isLast = self.currentPage === self.totalPage ? true : false;
                !self.isLast && self.currentPage++;
                self.$emit('search', {
                    searchType: self.$route.query.ys_t,
                    keyword: self.$route.query.ys_k,
                    offset: self.currentPage,
                    location: self.$route.query.ys_l
                });
            },
            choosePage(page) {
                let self = this;
                if (self.currentPage !== page) {
                    self.currentPage = page;
                    self.isFirst = self.currentPage === 1 ? true : false;
                    self.isLast = self.currentPage === self.totalPage ? true : false;
                    self.$emit('search', {
                        searchType: self.$route.query.ys_t,
                        keyword: self.$route.query.ys_k,
                        offset: self.currentPage,
                        location: self.$route.query.ys_l
                    });
                }
            },
            init() {
                let self = this;
                self.$set(data, 'totalPage', Math.ceil(self.total / 20));
                self.$set(data, 'currentPage', self.current);
                self.isFirst = self.currentPage === 1 ? true : false;
                self.isLast = self.currentPage === self.totalPage ? true : false;
            }
        },
        created() {
            this.init();
        },
        beforeUpdate() {
            this.init();
        },
        data() {
            return data
        }
    }
</script>

<style>
    .ys-pagination {
        float: left;
        display: inline-block;
        margin: 40px 0 40px;
        clear: both;
        overflow: hidden;
    }
    
    .ys-pagination button {
        float: left;
        box-sizing: border-box;
        width: 80px;
        height: 35px;
        border: 1px solid #ddd;
        font-size: 14px;
        color: #333;
        background: #fff;
        cursor: pointer;
    }
    
    .ys-pagination .ys-next {
        margin-left: 10px;
    }
    
    .ys-pagination button.disabled {
        color: #999;
        background: #f8f8f8;
        cursor: not-allowed;
    }
    
    .ys-pagination ul {
        float: left;
        overflow: hidden;
    }
    
    .ys-pagination ul li {
        float: left;
        box-sizing: border-box;
        margin-left: 10px;
        padding: 0 10px;
        min-width: 35px;
        height: 35px;
        font-size: 16px;
        text-align: center;
        line-height: 33px;
        cursor: pointer;
    }
    
    .ys-pagination ul li:hover,
    .ys-pagination button:hover {
        background: #f8f8f8;
    }
    
    .ys-pagination ul li.page {
        border: 1px solid #ddd;
    }
    
    .ys-pagination ul li.active {
        border: 1px solid #0075e8;
        background: #0075e8;
        color: #fff;
    }
</style>