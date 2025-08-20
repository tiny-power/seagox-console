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
                <el-table-column prop="cron" label="cron" align="center"></el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    align="center"
                    :formatter="statusFormatter"
                ></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            size="small"
                            @click="startTaskHandle(scope.row)"
                            v-if="scope.row.status != 1"
                            >启动</el-button
                        >
                        <el-divider direction="vertical" v-if="scope.row.status != 1"></el-divider>
                        <el-button
                            type="text"
                            size="small"
                            @click="stopTaskHandle(scope.row)"
                            v-if="scope.row.status == 1"
                            >暂停</el-button
                        >
                        <el-divider direction="vertical" v-if="scope.row.status == 1"></el-divider>
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
        <el-dialog title="新增" width="700px" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="cron" prop="cron">
                    <el-input v-model="addForm.cron" placeholder="请输入cron"></el-input>
                </el-form-item>
                <el-form-item label="标识" prop="mark">
                    <el-input v-model="addForm.mark" placeholder="请输入标识"></el-input>
                </el-form-item>
                <el-form-item label="最近5次">
                    <el-input
                        v-model="addForm.remark"
                        type="textarea"
                        :autosize="{ minRows: 5, maxRows: 5 }"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="valid('add')">运行</el-button>
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="700px" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="cron" prop="cron">
                    <el-input v-model="editForm.cron" placeholder="请输入cron"></el-input>
                </el-form-item>
                <el-form-item label="标识" prop="mark">
                    <el-input v-model="editForm.mark" placeholder="请输入标识"></el-input>
                </el-form-item>
                <el-form-item label="最近5次">
                    <el-input
                        v-model="editForm.remark"
                        type="textarea"
                        :autosize="{ minRows: 5, maxRows: 5 }"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="valid('add')">运行</el-button>
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
                name: '',
                cron: '',
                mark: '',
                remark: ''
            },
            editFormVisible: false,
            editForm: {
                id: '',
                name: '',
                cron: '',
                mark: '',
                remark: ''
            },
            formRules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                cron: [{ required: true, message: '请输入cron', trigger: 'blur' }],
                mark: [{ required: true, message: '请输入标识', trigger: 'blur' }]
            }
        }
    },
    created() {
        this.queryByPage()
    },
    methods: {
        statusFormatter(row) {
            if (row.status === 0) {
                return '未启动'
            } else if (row.status === 1) {
                return '已启动'
            } else {
                return row.status
            }
        },
        handleCurrentChange() {
            this.queryByPage()
        },
        queryByPage() {
            const params = {
                pageNo: this.pageNo,
                name: this.searchForm.name
            }
            this.$axios.get('job/queryByPage', { params }).then(res => {
                if (res.data.code == 200) {
                    this.tableData = res.data.data.list
                    this.total = res.data.data.total
                }
            })
        },
        handleSearch() {
            this.pageNo = 1
            this.queryByPage()
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
                    this.$axios.post('job/insert', this.addForm).then(res => {
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
        },
        editSubmit() {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    this.$axios.post('job/update', this.editForm).then(res => {
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
                this.$axios.post('job/delete/' + row.id, {}).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.pageNo = 1
                        this.queryByPage()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        },
        startTaskHandle(row) {
            this.$axios.post('job/startJob/' + row.id, {}).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('启动成功')
                    this.pageNo = 1
                    this.queryByPage()
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        stopTaskHandle(row) {
            this.$axios.post('job/stopJob/' + row.id, {}).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('暂停成功')
                    this.pageNo = 1
                    this.queryByPage()
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        valid(type) {
            if (type === 'add') {
                if (this.addForm.cron) {
                    let params = {
                        cron: this.addForm.cron
                    }
                    this.$axios.post('job/valid', params).then(res => {
                        if (res.data.code == 200) {
                            let result = ''
                            for (let i = 0; i < res.data.data.length; i++) {
                                if (i === res.data.data.length - 1) {
                                    result = result + res.data.data[i]
                                } else {
                                    result = result + res.data.data[i] + '\n'
                                }
                            }
                            this.addForm.remark = result
                        } else {
                            this.$message.error(res.data.message)
                            this.addForm.remark = ''
                        }
                    })
                } else {
                    this.addForm.remark = ''
                }
            } else {
                if (this.editForm.cron) {
                    let params = {
                        cron: this.editForm.cron
                    }
                    this.$axios.post('job/valid', params).then(res => {
                        if (res.data.code == 200) {
                            let result = ''
                            for (let i = 0; i < res.data.data.length; i++) {
                                if (i === res.data.data.length - 1) {
                                    result = result + res.data.data[i]
                                } else {
                                    result = result + res.data.data[i] + '\n'
                                }
                            }
                            this.editForm.remark = result
                        } else {
                            this.$message.error(res.data.message)
                            this.editForm.remark = ''
                        }
                    })
                } else {
                    this.editForm.remark = ''
                }
            }
        }
    }
}
</script>
