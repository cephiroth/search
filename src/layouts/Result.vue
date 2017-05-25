<template>
    <section class="ys-result-list clearfix">
        <div class="ys-result-list-left">
            <resultItem v-for="(item, index) in resultData" :item="item" :total="total" :index="index"></resultItem>
        </div>
        <div class="ys-result-list-right" v-if="recommendData.length > 0">
            <div class="ys-result-title-right">您可能感兴趣</div>
            <recommend v-for="(item, index) in recommendData" :item="item" :total="total" :index="index"></recommend>
        </div>
    </section>
</template>

<script>
    import resultItem from '../components/Result-Item'
    import recommend from '../components/Recommend'
    
    export default {
        name: 'result',
        props: ['resultData', 'recommendData', 'total'],
        components: {
            resultItem,
            recommend
        }
    }
</script>

<style>
    .ys-result-list {
        padding: 0 0 0 143px;
        min-width: 1056px;
    }
    
    .pb85 {
        padding-bottom: 85px;
    }
    
    .ys-result-list-left {
        width: 909px;
        float: left;
        padding-right: 15px;
    }
    
    .ys-result-list-right {
        float: left;
        margin-top: -27px;
        width: 255px;
        border-left: 1px solid #dddddd;
    }
    
    .clearfix:after {
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
    
    .ys-result-list-right dl:nth-child(3n+1) {
        margin-left: 15px;
    }
    
    .ys-result-title-right {
        color: #333;
        font-size: 14px;
        font-weight: bold;
        text-indent: 15px;
    }
</style>