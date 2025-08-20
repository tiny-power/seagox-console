<template>
    <el-drawer title="配置" size="666px" :visible.sync="drawerVisible">
        <div class="drawer__content">
            <el-form :model="nodeItem" label-width="0px">
                <el-form-item>
                    <el-input
                        v-model="nodeItem.label"
                        placeholder="请输入标题"
                        maxlength="14"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <codemirrorGroovy
                    id="codemirror"
                    ref="codemirror"
                    v-model="nodeItem.value"
                    placeholder="请输入脚本"
                    :style="{ width: '100%', height: '500px' }"
                />
            </el-form>
            <div class="drawer__footer">
                <el-button @click="drawerVisible = false" round>取 消</el-button>
                <el-button type="primary" @click="handleSubmit" round>确 定</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import codemirrorGroovy from '@/views/components/codemirror/groovy'
export default {
    components: {
        codemirrorGroovy
    },
    props: ['nodeInfo'],
    data() {
        return {
            drawerVisible: false,
            nodeItem: {
                value: ''
            }
        }
    },
    beforeMount() {
        this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
    },
    methods: {
        showDialog() {
            this.drawerVisible = true
            this.$nextTick().then(() => {
                this.nodeItem = JSON.parse(JSON.stringify(this.nodeInfo))
                this.$refs.codemirror.editor.setValue(this.nodeInfo.value || '')
            })
        },
        handleSubmit() {
            if (!this.nodeItem.label) {
                this.$message.error('请输入标题')
                return
            }
            this.$emit('updateNodeInfo', this.nodeItem)
            this.drawerVisible = false
        }
    }
}
</script>
<style scoped>
.drawer__content {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.drawer__content form {
    flex: 1;
}
.drawer__footer {
    text-align: right;
}
.drawer__footer button {
    flex: 1;
}
::v-deep .el-drawer__body {
    padding: 0px 20px 20px 20px;
}
</style>
