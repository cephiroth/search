<template>
    <section class="ys-select-area">
        <a class="ys-location" :title="selectLocation" :class="visible ? 'open' : 'close'" href="javascript:;" @click="expand">
            <span class="single-line">{{selectLocation}}</span><i class="icon-triangle"></i>
        </a>
        <div class="ys-sections" v-if="visible">
            <div class="ys-section b-b-dotted">
                <ul>
                    <li><a href="javascript:;" @click="chooseArea"><b>所有区域</b></a></li>
                    <li>同城：<a href="javascript:;" @click="chooseArea(location)"><b>{{location}}</b></a></li>
                </ul>
                <ul style="margin-top: 5px;">
                    <li v-for="area in sections.areas"><a href="javascript:;" @click="chooseArea(area)">{{area.name}}</a></li>
                </ul>
                <ul>
                    <li v-for="city in sections.citys" style="width: 42px;" @click="chooseArea(city)"><a href="javascript:;">{{city}}</a></li>
                </ul>
            </div>
            <div class="ys-section">
                <ul>
                    <li v-for="province in sections.provinces"><a href="javascript:;" @click="chooseArea(province)">{{province}}</a></li>
                </ul>
            </div>
            <div class="ys-section-search">
                <input type="text" placeholder="输入省份或城市，多个地区用逗号分隔" v-model.trim="inputArea" maxlength="40">
                <a href="javascript:;" @click="searchArea">确定</a>
            </div>
        </div>
    </section>
</template>

<script>
    import config from '../../config/config'
    
    const data = {
        sections: {
            areas: [{
                name: '东北区',
                include: '黑龙江,吉林,辽宁'
            }, {
                name: '华北区',
                include: '北京,河北,内蒙古,山西,天津'
            }, {
                name: '华东区',
                include: '安徽,福建,江苏,山东,上海,浙江'
            }, {
                name: '华南区',
                include: '广东,广西,海南'
            }, {
                name: '华中区',
                include: '河南,湖北,湖南,江西'
            }],
            citys: ['北京', '上海', '天津', '重庆', '广州'],
            provinces: ['安徽', '福建', '甘肃', '广东', '广西', '贵州', '海南', '河北',
                '河南', '青海', '浙江', '湖北', '湖南', '江苏', '江西', '吉林',
                '辽宁', '宁夏', '山东', '山西', '陕西', '云南', '四川', '西藏',
                '新疆', '澳门', '香港', '台湾', '内蒙古', '黑龙江'
            ]
        },
        location: '', //ip定位到的城市
        selectLocation: '所属地区', //选择地区后的显示文字
        inputArea: '', //搜索地区的输入
        visible: false //搜索地区可见状态（true：显示，false：关闭）
    }
    export default {
        name: 'areaFilter',
        methods: {
            searchArea() {
                let self = this;
                if (self.inputArea !== '') {
                    self.visible = false;
                    self.$emit('selectArea', {
                        area: self.inputArea
                    });
                }
            },
            chooseArea(area) {
                let self = this;
                self.visible = false;
                self.$emit('selectArea', {
                    area: typeof area === 'object' ? area.name : area
                });
            },
            expand() {
                let self = this;
                self.visible = !self.visible;
                self.inputArea = '';
                if (!self.visible || self.location !== '') return;
                self.$http({
                    url: config.url.api + '/es/search/getCity',
                    method: 'POST',
                    body: {}
                }).then(res => {
                    if (res.body.code === 0) {
                        self.$set(data, 'location', res.body.data);
                    } else {
                        console.log('returnErr: %o', res.body);
                    }
                }, res => {
                    console.log('requestErr: %o', res);
                }).catch(error => {
                    console.log('systemErr: %s', error);
                });
            },
            init() {
                let self = this;
                if (self.$route.query.ys_l) {
                    if (self.$route.query.ys_l.indexOf('区') > -1) {
                        self.sections.areas.forEach(area => {
                            if (area.name === self.$route.query.ys_l) {
                                self.selectLocation = area.include;
                            }
                        })
                    } else {
                        self.selectLocation = self.$route.query.ys_l
                    }
                } else {
                    self.selectLocation = '所属地区';
                }
            }
        },
        beforeUpdate() {
            this.init();
        },
        created() {
            let self = this;
            self.init();
            window.addEventListener('click', function(e) {
                if (!jQuery(e.target).parents().hasClass('ys-select-area')) {
                    self.visible = false;
                }
            })
        },
        watch: {
            '$route' () {
                let self = this;
                self.visible = false;
                self.init();
            }
        },
        data() {
            return data
        }
    }
</script>

<style>
    .ys-select-area {
        position: relative;
        margin: 8px 0 8px 143px;
        width: 909px;
    }
    
    .ys-select-area .ys-location {
        position: relative;
        display: inline-block;
        height: 37px;
        line-height: 37px;
        font-size: 14px;
        color: #666;
        box-sizing: border-box;
        overflow: hidden;
        z-index: 1;
    }
    
    .ys-location:hover {
        text-decoration: none;
    }
    
    .ys-location span {
        display: inline-block;
        margin-left: 10px;
        max-width: 70px;
    }
    
    .ys-location .icon-triangle {
        display: inline-block;
        margin-left: 5px;
        margin-right: 10px;
        width: 9px;
        height: 37px;
        background: url('../assets/images/icon-triangle.png') no-repeat center center;
        background-size: 9px 5px;
    }
    
    .ys-location.open .icon-triangle {
        transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        -webkit-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
    }
    
    .ys-location.open {
        line-height: 35px;
        border: 1px solid #ddd;
        border-bottom-color: #fff;
    }
    
    .ys-location.open .icon-triangle {
        height: 35px;
    }
    
    .ys-sections {
        position: absolute;
        left: 0;
        top: 36px;
        padding: 0 10px;
        width: 386px;
        background: #fff;
        border: 1px solid #ddd;
        box-shadow: 1px 1px 3px 0px #ddd;
        box-sizing: border-box;
    }
    
    .ys-section {
        padding: 15px 0 3px;
    }
    
    .ys-section ul {
        overflow: hidden;
    }
    
    .ys-section li {
        float: left;
        margin-right: 20px;
        margin-bottom: 12px;
        font-size: 14px;
        color: #666;
    }
    
    .ys-section li:nth-child(8n) {
        margin-right: 0;
    }
    
    .ys-section li:last-child {
        margin-right: 0;
    }
    
    .ys-section li a {
        display: inline-block;
        color: #333;
    }
    
    .ys-section li a:hover {
        color: #0075e8;
        text-decoration: none;
    }
    
    .ys-section-search {
        margin-top: 5px;
        margin-bottom: 20px;
        font-size: 14px;
        overflow: hidden;
    }
    
    .ys-section-search input {
        float: left;
        padding: 0 5px;
        width: 285px;
        height: 30px;
        border: 1px solid #ddd;
        box-sizing: border-box;
    }
    
    .ys-section-search input::-webkit-input-placeholder {
        font-size: 14px;
    }
    
    .ys-section-search input:-moz-placeholder {
        font-size: 14px;
    }
    
    .ys-section-search input::-moz-placeholder {
        font-size: 14px;
    }
    
    .ys-section-search input:-ms-input-placeholder {
        font-size: 14px;
    }
    
    .ys-section-search a {
        float: left;
        display: inline-block;
        margin-left: 10px;
        width: 60px;
        height: 30px;
        line-height: 30px;
        color: #fff;
        text-align: center;
        background: #0075e8;
    }
    
    .ys-section-search a:hover {
        background: #007ffc;
        text-decoration: none;
    }
    
    .b-b-dotted {
        border-bottom: 1px dotted #ccc;
    }
</style>