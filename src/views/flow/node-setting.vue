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
                <el-tabs v-model="activeName">
                    <el-tab-pane label="设置审批人" name="userTask">
                        <div>
                            <el-button
                                type="primary"
                                size="medium"
                                round
                                icon="el-icon-plus"
                                @click="handleMember"
                                v-if="!nodeItem.value || nodeItem.value.length == 0"
                                >添加成员</el-button
                            >
                            <el-button
                                type="primary"
                                size="medium"
                                round
                                @click="handleMember"
                                v-if="nodeItem.value && nodeItem.value.length != 0"
                                >修改成员</el-button
                            >
                            <div
                                style="max-height:200px; overflow:auto;"
                                v-if="nodeItem.value && nodeItem.value.length != 0"
                            >
                                <el-tag
                                    v-for="(tag, index) in nodeItem.value"
                                    :key="tag.id"
                                    closable
                                    style="margin-top:15px;margin-right:15px"
                                    @close="handleClose(index)"
                                >
                                    {{ tag.name }}
                                </el-tag>
                                <el-button type="text" @click="cleanTags">清空</el-button>
                            </div>
                        </div>
                        <el-divider></el-divider>
                        <div v-if="nodeItem.type == 'userTask'">
                            <p>多人审批时采用的审批方式</p>
                            <el-radio-group v-model="nodeItem.way" style="margin-top:10px">
                                <el-radio :label="1">或签(一名审批人同意或拒绝即可)</el-radio>
                                <br />
                                <el-radio :label="2" style="margin-top:20px">会签(须所有人同意)</el-radio>
                            </el-radio-group>
                            <br /><br />
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="表单操作权限" name="operationAuthority">
                        <span slot="label"
                            >表单操作权限
                            <el-tooltip
                                content="根据需要，设置该审批人对审批单中不同字段拥有不同的权限。"
                                placement="right-start"
                                ><i class="el-icon-warning-outline"></i></el-tooltip
                        ></span>
                        <el-table :data="operationAuthorityArray" max-height="450px">
                            <el-table-column prop="comment" label="表单字段"></el-table-column>
                            <el-table-column prop="behavior" label="可编辑">
                                <template slot-scope="scope">
                                    <el-radio v-model="scope.row.behavior" label="NORMAl">{{ '' }}</el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column prop="behavior" label="只读">
                                <template slot-scope="scope">
                                    <el-radio v-model="scope.row.behavior" label="DISABLED">{{ '' }}</el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column prop="behavior" label="隐藏">
                                <template slot-scope="scope">
                                    <el-radio v-model="scope.row.behavior" label="HIDDEN">{{ '' }}</el-radio>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <div class="drawer__footer">
                <el-button @click="drawerVisible = false" round>取 消</el-button>
                <el-button type="primary" @click="handleSubmit" round>确 定</el-button>
            </div>
        </div>
        <common ref="member" @confirm="confirm"></common>
    </el-drawer>
</template>

<script>
import common from '@/views/components/form/common'
export default {
    components: {
        common
    },
    props: ['nodeInfo', 'operationAuthority'],
    data() {
        return {
            drawerVisible: false,
            activeName: 'userTask',
            operationAuthorityArray: [],
            nodeItem: {
                value: []
            },
            operationAuthorityJson: []
        }
    },
    methods: {
        showDialog() {
            this.drawerVisible = true
            this.$nextTick().then(() => {
                this.nodeItem = JSON.parse(JSON.stringify(this.nodeInfo))
                if (!this.nodeItem.way) {
                    this.$set(this.nodeItem, 'way', 1)
                }
                if (this.nodeItem.authority) {
                    let authorityMap = {}
                    for (let i = 0; i < this.nodeItem.authority.length; i++) {
                        let mark = this.nodeItem.authority[i].tableName
                        if (this.nodeItem.authority[i].field) {
                            mark = mark + '.' + this.nodeItem.authority[i].field
                        }
                        authorityMap[mark] = this.nodeItem.authority[i].behavior
                    }

                    this.operationAuthorityJson = JSON.parse(JSON.stringify(this.operationAuthority))
                    let operationAuthorityArray = []
                    for (let j = 0; j < this.operationAuthorityJson.length; j++) {
                        let mark = this.operationAuthorityJson[j].tableName
                        if (this.operationAuthorityJson[j].field) {
                            mark = mark + '.' + this.operationAuthorityJson[j].field
                        }
                        let item = this.operationAuthorityJson[j]
                        if (authorityMap.hasOwnProperty(mark)) {
                            item.behavior = authorityMap[mark]
                        }
                        operationAuthorityArray.push(item)
                    }
                    this.operationAuthorityArray = operationAuthorityArray
                } else {
                    this.operationAuthorityArray = this.operationAuthority
                }
            })
        },
        handleMember() {
            this.$refs.member.showDialog(this.nodeItem.value || [])
        },
        handleClose(index) {
            this.nodeItem.value.splice(index, 1)
        },
        cleanTags() {
            this.nodeItem.value = []
        },
        confirm(value) {
            this.nodeItem.value = value
        },
        handleSubmit() {
            if (!this.nodeItem.label) {
                this.$message.error('请输入标题')
                return
            }
            this.nodeItem.authority = this.operationAuthorityArray
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

::v-deep .el-tab-pane {
    margin-top: 25px;
}
</style>
