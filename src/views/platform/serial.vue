<template>
    <div>
        <div class="toolView">
            <el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
        </div>
        <div class="table">
            <!--列表-->
            <el-table :data="tableData" border :max-height="clientHeight - 225">
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
        <el-dialog title="新增" width="750px" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="60px" :rules="formRules" ref="addForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="addForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <div class="toolView">
                    <el-button type="text" icon="el-icon-plus" @click="showAddFactorDialog" size="small"
                        >新增</el-button
                    >
                </div>
                <div class="table">
                    <el-table :data="factorData" border>
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column
                            prop="type"
                            label="类型"
                            align="center"
                            :formatter="typeFormatter"
                        ></el-table-column>
                        <el-table-column
                            prop="value"
                            label="值"
                            align="center"
                            :formatter="valueFormatter"
                        ></el-table-column>
                        <el-table-column label="操作" align="center" width="150">
                            <template slot-scope="scope">
                                <el-button
                                    type="text"
                                    size="small"
                                    @click="showEditFactorDialog(scope.row, scope.$index)"
                                    >编辑</el-button
                                >
                                <el-divider direction="vertical" v-if="scope.row.type != 3"></el-divider>
                                <el-button
                                    type="text"
                                    size="small"
                                    @click="deleteFactorSubmit(scope.$index)"
                                    v-if="scope.row.type != 3"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="750px" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="60px" :rules="formRules" ref="editForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
            </el-form>
            <div class="toolView">
                <el-button type="text" icon="el-icon-plus" @click="showAddFactorDialog" size="small">新增</el-button>
            </div>
            <div class="table">
                <el-table :data="factorData" border>
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column
                        prop="type"
                        label="类型"
                        align="center"
                        :formatter="typeFormatter"
                    ></el-table-column>
                    <el-table-column
                        prop="value"
                        label="值"
                        align="center"
                        :formatter="valueFormatter"
                    ></el-table-column>
                    <el-table-column label="操作" align="center" width="150">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="showEditFactorDialog(scope.row, scope.$index)"
                                >编辑</el-button
                            >
                            <el-divider direction="vertical" v-if="scope.row.type != 3"></el-divider>
                            <el-button
                                type="text"
                                size="small"
                                @click="deleteFactorSubmit(scope.$index)"
                                v-if="scope.row.type != 3"
                                >删除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--新增要素配置-->
        <el-dialog title="新增" width="550px" :visible.sync="addFactorVisible" :close-on-click-modal="false">
            <el-form :model="addFactorForm" label-width="70px" :rules="factorRules" ref="addFactorForm">
                <el-form-item label="类型" prop="type">
                    <el-select v-model="addFactorForm.type" placeholder="请选择类型" clearable>
                        <el-option label="固定码" :value="1"> </el-option>
                        <el-option label="年月日" :value="2"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="值" prop="value" v-if="addFactorForm.type == 1">
                    <el-input v-model.trim="addFactorForm.value" placeholder="请输入值"></el-input>
                </el-form-item>
                <el-form-item label="格式化" prop="format" v-if="addFactorForm.type == 2">
                    <el-select v-model="addFactorForm.format" placeholder="请选择格式化" clearable>
                        <el-option label="yyyyMMdd" value="yyyyMMdd"> </el-option>
                        <el-option label="yyyyMM" value="yyyyMM"> </el-option>
                        <el-option label="yyyy" value="yyyy"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="长度" prop="length" v-if="addFactorForm.type == 3">
                    <el-input v-model.trim="addFactorForm.length" placeholder="请输入长度"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFactorVisible = false">取消</el-button>
                <el-button type="primary" @click="addFactorSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑要素配置--->
        <el-dialog title="编辑" width="550px" :visible.sync="editFactorVisible" :close-on-click-modal="false">
            <el-form :model="editFactorForm" label-width="70px" :rules="factorRules" ref="editFactorForm">
                <el-form-item label="类型" prop="type">
                    <el-select v-model="editFactorForm.type" placeholder="请选择类型" disabled>
                        <el-option label="固定码" :value="1"> </el-option>
                        <el-option label="年月日" :value="2"> </el-option>
                        <el-option label="顺序码" :value="3"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="格式化" prop="format" v-if="editFactorForm.type == 2">
                    <el-select v-model="editFactorForm.format" placeholder="请选择格式化" clearable>
                        <el-option label="yyyyMMdd" value="yyyyMMdd"> </el-option>
                        <el-option label="yyyyMM" value="yyyyMM"> </el-option>
                        <el-option label="yyyy" value="yyyy"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="长度" prop="length" v-if="editFactorForm.type == 3">
                    <el-input v-model.trim="editFactorForm.length" placeholder="请输入长度"></el-input>
                </el-form-item>
                <el-form-item label="值" prop="value" v-if="editFactorForm.type == 1">
                    <el-input v-model.trim="editFactorForm.value" placeholder="请输入值"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFactorVisible = false">取消</el-button>
                <el-button type="primary" @click="editFactorSubmit">提交</el-button>
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
            total: 0,
            addFormVisible: false,
            addForm: {
                name: '',
                options: []
            },
            editFormVisible: false,
            editForm: {
                id: '',
                name: '',
                options: []
            },
            formRules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                options: [{ required: true, message: '请添加要素', trigger: 'blur' }]
            },
            addFactorVisible: false,
            addFactorForm: {
                name: '',
                options: []
            },
            editFactorVisible: false,
            editFactorForm: {
                id: '',
                name: '',
                options: []
            },
            factorRules: {
                type: [{ required: true, message: '请选择类型', trigger: 'change' }],
                value: [{ required: true, message: '请输入值', trigger: 'blur' }],
                format: [{ required: true, message: '请选择格式化', trigger: 'change' }],
                length: [{ required: true, message: '请输入长度', trigger: 'blur' }]
            },
            factorData: [
                {
                    type: 3,
                    length: 4
                }
            ],
            currentFactorIndex: -1
        }
    },
    created() {
        this.queryByPage()
    },
    methods: {
        async queryByPage() {
            const params = {
                pageNo: this.pageNo
            }
            let res = await this.$axios.get('serial/queryByPage', { params })
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
            this.factorData = [
                {
                    type: 3,
                    length: 4
                }
            ]
        },
        addSubmit() {
            var params = {
                name: this.addForm.name,
                options: JSON.stringify(this.factorData)
            }
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    this.$axios.post('serial/insert', params).then(res => {
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
            if (this.editForm.options) {
                this.$set(this.editForm, 'options', JSON.parse(this.editForm.options))
                this.factorData = this.editForm.options
            }
        },
        editSubmit() {
            var params = {
                id: this.editForm.id,
                name: this.editForm.name,
                options: JSON.stringify(this.factorData)
            }
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    this.$axios.post('serial/update', params).then(res => {
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
                this.$axios.post('serial/delete/' + row.id, {}).then(res => {
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
        showAddFactorDialog() {
            this.addFactorVisible = true
            if (this.$refs.addFactorForm) {
                this.$refs.addFactorForm.resetFields()
            }
        },
        addFactorSubmit() {
            this.$refs.addFactorForm.validate(valid => {
                if (valid) {
                    this.addFactorVisible = false
                    this.factorData.splice(
                        this.factorData.length - 1,
                        0,
                        JSON.parse(JSON.stringify(this.addFactorForm))
                    )
                }
            })
        },
        showEditFactorDialog(row, index) {
            this.editFactorForm = Object.assign({}, row)
            this.editFactorVisible = true
            if (this.$refs.editFactorForm) {
                this.$refs.editFactorForm.resetFields()
            }
            this.currentFactorIndex = index
        },
        editFactorSubmit() {
            this.$refs.editFactorForm.validate(valid => {
                if (valid) {
                    this.editFactorVisible = false
                    this.factorData.splice(this.currentFactorIndex, 1, JSON.parse(JSON.stringify(this.editFactorForm)))
                }
            })
        },
        deleteFactorSubmit(index) {
            this.factorData.splice(index, 1)
        },
        typeFormatter(row) {
            if (row.type == 1) {
                return '固定码'
            } else if (row.type == 2) {
                return '年月日'
            } else if (row.type == 3) {
                return '顺序码'
            }
        },
        valueFormatter(row) {
            if (row.type == 1) {
                return row.value
            } else if (row.type == 2) {
                return '格式化:' + row.format
            } else if (row.type == 3) {
                return '长度:' + row.length
            }
        }
    }
}
</script>
