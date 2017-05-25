<template>
    <section class="ys-pagination">
        <button class="ys-prev" v-if="!getFirst" @click="clickPrev">上一页</button>
        <ul v-if="getTotal > 10">
            <li v-for="i in 10" class="page" @click="clickPage(showPage(i))" :class="isActive(i)">
                {{showPage(i)}}
            </li>
        </ul>
        <ul v-if="getTotal <= 10">
            <li v-for="i in getTotal" @click="clickPage(i)" class="page" :class="i===getCurrent?'active':''">{{i}}</li>
        </ul>
        <button class="ys-next" v-if="!getLast" @click="clickNext">下一页</button>
        <input type="hidden" :value="Math.ceil(getTotal/20)">
    </section>
</template>
<script>
    import { mapGetters } from 'vuex'
    import { mapActions } from 'vuex'

    export default {
        name: 'paginationvuex',
        props: ['total', 'current'],
        computed: {
            ...mapGetters([
                'getCurrent',
                'getTotal',
                'getFirst',
                'getLast'
            ])
        },
        methods: {
            ...mapActions([
                'clickNext',
                'clickPrev',
                'clickPage'
            ]),
            isActive (i) {
                let self = this;
                let style = '';
                if (self.getCurrent<7 && i===self.getCurrent) {
                    style = 'active';
                }
                if (self.getCurrent<=self.getTotal-4 && self.getCurrent>=7 && i===6) {
                    style = 'active';
                }
                if (self.getCurrent>self.getTotal-4 && i===10-self.getTotal+self.getCurrent) {
                    style = 'active';
                }
                return style;
            },
            showPage (i) {
                let self = this;
                let page, copyPage;
                if (self.getCurrent < 7) {
                    page = i;
                } else if (self.getCurrent > self.getTotal - 4) {
                    page = self.getTotal - 10 + i;
                } else {
                    page = self.getCurrent < 7 ? i+1 : self.getCurrent-6+i;
                }
                return page;
            }
        },
        // created () {
        //     let self = this;
        //     self.$set(data, 'totalPage', Math.ceil(self.total/20));
        //     self.$set(data, 'currentPage', self.current);
        //     self.isFirst = self.currentPage === 1 ? true : false;
        //     self.isLast = self.currentPage === self.totalPage ? true : false;
        // },
        // beforeUpdate () {
        //     let self = this;
        //     self.$set(data, 'totalPage', Math.ceil(self.total/20));
        //     self.$set(data, 'currentPage', self.current);
        //     self.isFirst = self.currentPage === 1 ? true : false;
        //     self.isLast = self.currentPage === self.totalPage ? true : false;
        // }
    }
</script>
<style>
    .ys-pagination {
        margin: 40px 0 40px 143px;
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
    .ys-pagination ul li:hover {
        background: #f8f8f8;
    }
    .ys-pagination ul li.page {
        border: 1px solid #ddd;
    }
    .ys-pagination ul li.active {
        border: 1px solid #dd2727;
        background: #dd2727;
        color: #fff;
    }
</style>