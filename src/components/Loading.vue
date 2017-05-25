<template>
    <section>
        <div class="ys-loading"></div>
        <div class="ys-mask"></div>
    </section>
</template>

<script>
    export default {
        name: 'loading'
    }
</script>

<style>
    .ys-loading {
        width: 30px;
        height: 30px;
        position: fixed;
        left: 50%;
        top: 50%;
        margin-top: -15px;
        margin-left: -15px;
        background: url(../assets/images/loading.gif);
        background-size: 100% 100%;
        z-index: 99;
    }
    
    .ys-mask {
        background-color: rgba(255, 255, 255, 0.4);
        z-index: 98;
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
</style>