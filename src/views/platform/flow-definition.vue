<template>
    <div>
        <div class="searchView">
            <el-form label-width="80px" :inline="true">
                <el-form-item label="业务类型">
                    <el-select
                        v-model="searchForm.businessType"
                        clearable
                        placeholder="请选择业务类型"
                        :disabled="businessTypeLocked"
                    >
                        <el-option
                            v-for="item in businessTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model.trim="searchForm.name" clearable placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table">
            <!--列表-->
            <el-table :data="tableData" border highlight-current-row :max-height="clientHeight - 255">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column
                    prop="businessType"
                    label="业务类型"
                    align="center"
                    :formatter="businessTypeFormatter"
                ></el-table-column>
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="180"></el-table-column>
                <el-table-column prop="updateTime" label="修改时间" align="center" width="180"></el-table-column>
                <el-table-column label="操作" align="center" width="260">
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
                    :page-size.sync="pageSize"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
        <!--新增界面-->
        <el-dialog title="新增" width="500px" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm">
                <el-form-item label="业务类型" prop="businessType">
                    <el-select
                        v-model="addForm.businessType"
                        placeholder="请选择业务类型"
                        :disabled="businessTypeLocked"
                    >
                        <el-option
                            v-for="item in businessTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
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
            <el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
                <el-form-item label="业务类型" prop="businessType">
                    <el-select
                        v-model="editForm.businessType"
                        placeholder="请选择业务类型"
                        :disabled="businessTypeLocked"
                    >
                        <el-option
                            v-for="item in businessTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
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
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            tableData: [],
            pageNo: 1,
            pageSize: 10,
            total: 0,
            businessTypeOptions: [{ value: 'leave_request', label: '请假单' }],
            searchForm: {
                businessType: 'leave_request',
                name: ''
            },
            addFormVisible: false,
            addForm: {
                businessType: '',
                name: ''
            },
            editFormVisible: false,
            editForm: {
                id: '',
                businessType: '',
                name: ''
            },
            rules: {
                businessType: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
            }
        }
    },
    computed: {
        businessTypeLocked() {
            return !!this.$route.query.id
        }
    },
    created() {
        if (this.$route.query.id) {
            this.searchForm.businessType = String(this.$route.query.id)
        }
        if (!this.businessTypeOptions.some(item => item.value === this.searchForm.businessType)) {
            this.searchForm.businessType = 'leave_request'
        }
        this.queryByPage()
    },
    methods: {
        defaultResources() {
            return {
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
        },
        handleSearch() {
            this.pageNo = 1
            this.queryByPage()
        },
        handleCurrentChange() {
            this.queryByPage()
        },
        async queryByPage() {
            let params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                businessType: this.searchForm.businessType,
                name: this.searchForm.name
            }
            let res = await this.$axios.get('flow/queryByPage', { params })
            if (res.data.code == 200) {
                this.tableData = res.data.data.list
                this.total = res.data.data.total
            }
        },
        async showAddDialog() {
            let businessType = this.searchForm.businessType || 'leave_request'
            if (await this.hasBusinessTypeDefinition(businessType)) {
                this.$message.warning('该业务类型已存在流程定义')
                return
            }
            this.addForm = {
                businessType,
                name: ''
            }
            this.addFormVisible = true
            this.$nextTick(() => {
                if (this.$refs.addForm) {
                    this.$refs.addForm.clearValidate()
                }
            })
        },
        async hasBusinessTypeDefinition(businessType) {
            let res = await this.$axios.get('flow/queryByBusinessType/' + encodeURIComponent(businessType))
            return res.data.code == 200 && res.data.data && res.data.data.length > 0
        },
        addSubmit() {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    var params = {
                        businessType: this.addForm.businessType,
                        name: this.addForm.name,
                        resources: JSON.stringify(this.defaultResources())
                    }
                    this.$axios.post('flow/insert', params).then(res => {
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
            this.editForm = {
                id: row.id,
                businessType: row.businessType,
                name: row.name
            }
            this.editFormVisible = true
            this.$nextTick(() => {
                if (this.$refs.editForm) {
                    this.$refs.editForm.clearValidate()
                }
            })
        },
        editSubmit() {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    var params = {
                        id: this.editForm.id,
                        businessType: this.editForm.businessType,
                        name: this.editForm.name
                    }
                    this.$axios.post('flow/update', params).then(res => {
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
        designSubmit(row) {
            let query = { id: row.id, title: row.name }
            if (this.$route.query.dataSource) {
                query.dataSource = this.$route.query.dataSource
            }
            let routeData = this.$router.resolve({
                path: '/flowDesigner',
                query
            })
            window.open(routeData.href, '_blank')
        },
        deleteSubmit(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('flow/delete/' + row.id, {}).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.queryByPage()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        },
        businessTypeFormatter(row) {
            let item = this.businessTypeOptions.find(item => item.value === row.businessType)
            return item ? item.label : row.businessType
        }
    }
}
</script>
<style scoped></style>
