<template>
    <div>
        <div class="toolView">
            <el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
        </div>
        <div style="padding: 0px 15px">
            <!--列表-->
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showAuthorizationDialog(scope.row)">授权</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" size="small" @click="designSubmit(scope.row)">设计</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--新增界面-->
        <el-dialog title="新增" width="500px" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="60px" :rules="rules" ref="addForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="addForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="500px" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="60px" :rules="rules" ref="editForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editSubmit">提交</el-button>
            </div>
        </el-dialog>
        <common ref="common" @confirm="memberConfirm" />
    </div>
</template>

<script>
import common from '@/views/components/form/common'
export default {
    components: {
        common
    },
    data() {
        return {
            tableData: [],
            addFormVisible: false,
            addForm: {
                name: '',
                empower: []
            },
            editFormVisible: false,
            editForm: {
                id: '',
                name: '',
                empower: []
            },
            rules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
            },
            resources: {
                nodes: [
                    {
                        id: 'start',
                        type: 'start',
                        label: '开始',
                        x: 100,
                        y: 140
                    },
                    {
                        id: 'end',
                        type: 'end',
                        label: '结束',
                        x: 280,
                        y: 140
                    }
                ],
                edges: [
                    {
                        source: 'start',
                        target: 'end',
                        label: null
                    }
                ]
            }
        }
    },
    created() {
        this.queryByFormId()
    },
    methods: {
        async queryByFormId() {
            let res = await this.$axios.get('seaDefinition/queryByFormId/' + this.$route.query.id)
            if (res.data.code == 200) {
                this.tableData = res.data.data
            }
        },
        showAddDialog() {
            this.addFormVisible = true
            if (this.$refs.addForm) {
                this.$refs.addForm.resetFields()
            }
        },
        addSubmit() {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    var params = {
                        formId: this.$route.query.id,
                        name: this.addForm.name,
                        resources: JSON.stringify(this.resources),
                        empower: JSON.stringify(this.addForm.empower)
                    }
                    this.$axios.post('seaDefinition/insert', params).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('新增成功')
                            this.addFormVisible = false
                            this.queryByFormId()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        showEditDialog(row) {
            this.editForm = Object.assign({}, row)
            this.editFormVisible = true
            if (this.$refs.editForm) {
                this.$refs.editForm.resetFields()
            }
        },
        editSubmit() {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    var params = {
                        id: this.editForm.id,
                        name: this.editForm.name,
                        empower: this.editForm.empower
                    }
                    this.$axios.post('seaDefinition/update', params).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('修改成功')
                            this.editFormVisible = false
                            this.queryByFormId()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        designSubmit(row) {
            let routeData = this.$router.resolve({
                path: '/flowDesigner',
                query: { id: row.id, title: row.name, dataSource: this.$route.query.dataSource }
            })
            window.open(routeData.href, '_blank')
        },
        deleteSubmit(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('seaDefinition/delete/' + row.id, {}).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.queryByFormId()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        },
        showAuthorizationDialog(row) {
            this.editForm = Object.assign({}, row)
            let empower = JSON.parse(row.empower)
            this.$refs.common.showDialog(empower)
        },
        memberConfirm(value) {
            var params = {
                id: this.editForm.id,
                empower: JSON.stringify(value)
            }
            this.$axios.post('seaDefinition/update', params).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('修改成功')
                    this.editFormVisible = false
                    this.queryByFormId()
                } else {
                    this.$message.error(res.data.message)
                }
            })
        }
    }
}
</script>
<style scoped></style>
