<template>
    <!-- 快捷入口 -->
    <div style="height: 100%; box-sizing: border-box">
        <el-card style="height: 100%">
            <div slot="header">
                <span>常用功能</span>
            </div>
            <div :style="{ height: height - 67.5 + 'px' }"></div>
        </el-card>
    </div>
</template>
<script>
export default {
    props: ['height'],
    data() {
        return {}
    },
    mounted() {},
    methods: {}
}
</script>
<style scoped></style>
