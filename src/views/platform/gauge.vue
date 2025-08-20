<template>
    <div>
        <div class="searchView">
            <el-form label-width="60px" :inline="true">
                <el-form-item label="名称">
                    <el-input v-model="searchForm.name" clearable placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table">
            <!--列表-->
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="180"></el-table-column>
                <el-table-column prop="updateTime" label="修改时间" align="center" width="180"></el-table-column>
                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" size="small" @click="designSubmit(scope.row)">设计</el-button>
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
        <el-dialog title="新增" width="500px" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="60px" :rules="formRules" ref="addForm">
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
            <el-form :model="editForm" label-width="60px" :rules="formRules" ref="editForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
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
            searchForm: {
                name: ''
            },
            addFormVisible: false,
            addForm: {
                name: ''
            },
            editFormVisible: false,
            editForm: {
                id: '',
                name: ''
            },
            formRules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
            }
        }
    },
    created() {
        this.queryByPage()
    },
    methods: {
        queryByPage() {
            let that = this
            const params = {
                pageNo: this.pageNo,
                name: this.searchForm.name
            }
            that.$axios.get('gauge/queryByPage', { params }).then(res => {
                if (res.data.code == 200) {
                    that.tableData = res.data.data.list
                    that.total = res.data.data.total
                }
            })
        },
        handleSearch() {
            this.pageNo = 1
            this.queryByPage()
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
            let that = this
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    that.$axios.post('gauge/insert', that.addForm).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('新增成功')
                            that.addFormVisible = false
                            that.queryByPage()
                        } else {
                            that.$message.error(res.data.message)
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
            let that = this
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    that.$axios.post('gauge/update', that.editForm).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('修改成功')
                            that.editFormVisible = false
                            that.queryByPage()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        designSubmit(row) {
            this.$router.push({
                path: '/gaugeSetting',
                query: {
                    id: row.id,
                    title: row.name
                }
            })
        },
        deleteSubmit(row) {
            let that = this
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                that.$axios.post('gauge/delete/' + row.id, {}).then(res => {
                    if (res.data.code == 200) {
                        that.$message.success('删除成功')
                        that.pageNo = 1
                        that.queryByPage()
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            })
        }
    }
}
</script>
