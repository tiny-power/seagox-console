<template>
    <div>
        <div class="toolView">
            <el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
        </div>
        <div class="table">
            <!--列表-->
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="180"></el-table-column>
                <el-table-column prop="updateTime" label="修改时间" align="center" width="180"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination">
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :current-page.sync="pageNo"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
        <!--新增界面-->
        <el-dialog title="新增" width="550px" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="60px" :rules="formRules" ref="addForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="addForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="authority">
                    <el-cascader
                        v-model="addForm.authority"
                        placeholder="请选择角色"
                        clearable
                        :options="roleOptions"
                        :props="{ multiple: true, emitPath: false }"
                        filterable
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="页面" prop="path">
                    <el-select v-model="addForm.path" placeholder="请选择页面" clearable filterable>
                        <el-option v-for="item in gaugeOptions" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="550px" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="60px" :rules="formRules" ref="editForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="authority">
                    <el-cascader
                        v-model="editForm.authority"
                        placeholder="请选择角色"
                        clearable
                        :options="roleOptions"
                        :props="{ multiple: true, emitPath: false }"
                        filterable
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="页面" prop="path">
                    <el-select v-model="editForm.path" placeholder="请选择页面" clearable filterable>
                        <el-option v-for="item in gaugeOptions" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            pageNo: 1,
            total: 0,
            addFormVisible: false,
            addForm: {
                name: '',
                authority: [],
                path: ''
            },
            editFormVisible: false,
            editForm: {
                id: '',
                name: '',
                authority: [],
                path: ''
            },
            formRules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                authority: [{ required: true, message: '请选择角色', trigger: 'change' }],
                path: [{ required: true, message: '请选择页面', trigger: 'change' }]
            },
            gaugeOptions: [],
            roleOptions: []
        }
    },
    created() {
        this.queryRoleByCompanyId()
        this.queryByPage()
        this.queryGaugeByCompanyId()
    },
    methods: {
        async queryGaugeByCompanyId() {
            let res = await this.$axios.get('gauge/queryAll')
            if (res.data.code == 200) {
                this.gaugeOptions = res.data.data
            }
        },
        async queryRoleByCompanyId() {
            let res = await this.$axios.get('company/queryAllAndRole')
            if (res.data.code == 200) {
                this.roleOptions = res.data.data
            }
        },
        async queryByPage() {
            const params = {
                pageNo: this.pageNo
            }
            let res = await this.$axios.get('door/queryByPage', { params })
            if (res.data.code == 200) {
                this.tableData = res.data.data.list
                this.total = res.data.data.total
            }
        },
        handleCurrentChange(val) {
            this.queryByPage()
        },
        showAddDialog() {
            this.addFormVisible = true
            if (this.$refs.addForm) {
                this.$refs.addForm.resetFields()
            }
        },
        addSubmit() {
            var params = {
                name: this.addForm.name,
                path: this.addForm.path,
                authority: this.addForm.authority.toString()
            }
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    this.$axios.post('door/insert', params).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('新增成功')
                            this.addFormVisible = false
                            this.queryByPage()
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
            if (this.editForm.authority) {
                this.$set(this.editForm, 'authority', this.editForm.authority.split(','))
            } else {
                this.$set(this.editForm, 'authority', [])
            }
        },
        editSubmit() {
            var params = {
                id: this.editForm.id,
                name: this.editForm.name,
                path: this.editForm.path,
                authority: this.editForm.authority.toString()
            }
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    this.$axios.post('door/update', params).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('修改成功')
                            this.editFormVisible = false
                            this.queryByPage()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        deleteSubmit(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('door/delete/' + row.id, {}).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.pageNo = 1
                        this.queryByPage()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        }
    }
}
</script>
