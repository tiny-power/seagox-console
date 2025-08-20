<template>
    <div>
        <top />
        <div class="content">
            <worktab />
            <div style="height: calc(100% - 49px); overflow: auto">
                <keep-alive>
                    <router-view :ref="key" :key="key" v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive"></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import top from '@/views/layout/top'
import worktab from '@/views/layout/worktab'
export default {
    components: {
        top,
        worktab
    },
    computed: {
        key() {
            return this.$route.fullPath
        }
    }
}
</script>
<style scoped>
.content {
    position: absolute;
    top: 60px;
    width: 100%;
    height: calc(100% - 60px);
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
