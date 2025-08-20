<template>
    <div>
        <el-container :style="'height:' + (clientHeight - 110) + 'px'">
            <el-aside width="240px" class="aside" style="padding-left: 15px">
                <div style="display: flex; gap: 10px">
                    <div class="add-classify" @click="showAddClassifyDialog">
                        <i class="el-icon-plus"></i>
                        <span style="margin-left: 10px">添加分类</span>
                    </div>
                    <div class="add-classify">
                        <el-upload
                            style="display: inline; margin-left: 10px; margin-right: 10px"
                            :action="action"
                            :show-file-list="false"
                            accept=".xlsx,.xls"
                            :headers="headers"
                            :before-upload="beforeUpload"
                            :on-success="successHandle"
                        >
                            <i class="el-icon-upload2"></i>
                            <span style="margin-left: 10px">导入</span>
                        </el-upload>
                    </div>
                </div>
                <el-table
                    :data="tableData"
                    highlight-current-row
                    :show-header="false"
                    @current-change="handleNodeClick"
                    class="border"
                >
                    <el-table-column show-overflow-tooltip>
                        <template slot-scope="scope">
                            <i class="el-icon-document" style="font-size: 14px"></i>
                            <span style="font-size: 14px; margin-left: 8px">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="45" align="center">
                        <template slot-scope="scope">
                            <el-dropdown @command="handleCommand($event, scope.row)">
                                <span class="el-dropdown-link">
                                    <i class="el-icon-more"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item icon="el-icon-edit" command="edit">编辑</el-dropdown-item>
                                    <el-dropdown-item icon="el-icon-delete" command="delete">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </el-aside>
            <el-main>
                <div class="toolView">
                    <el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
                    <el-button type="text" icon="el-icon-circle-plus-outline" @click="showBatchDialog" size="small"
                        >批量添加</el-button
                    >
                </div>
                <div class="table">
                    <!--列表-->
                    <el-table
                        :data="treeData"
                        border
                        highlight-current-row
                        row-key="id"
                        default-expand-all
                        :tree-props="{ children: 'children' }"
                        :max-height="clientHeight - 165"
                    >
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column
                            prop="name"
                            label="名称"
                            header-align="center"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column prop="code" label="字典值" align="center"></el-table-column>
                        <el-table-column prop="sort" label="排序号" align="center"></el-table-column>
                        <el-table-column label="状态" align="center">
                            <template slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.status"
                                    :active-value="1"
                                    :inactive-value="0"
                                    @change="statusChange($event, scope.row)"
                                ></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-main>
        </el-container>
        <!--新增界面-->
        <el-dialog title="新增" width="500px" :visible.sync="addClassifyFormVisible" :close-on-click-modal="false">
            <el-form :model="addClassifyForm" label-width="60px" :rules="formRules" ref="addClassifyForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="addClassifyForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addClassifyFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addClassifySubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="500px" :visible.sync="editClassifyFormVisible" :close-on-click-modal="false">
            <el-form :model="editClassifyForm" label-width="60px" :rules="formRules" ref="editClassifyForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="editClassifyForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editClassifyFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editClassifySubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--新增界面-->
        <el-dialog title="新增" width="500px" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
                <el-form-item label="上级" prop="parentId">
                    <el-cascader
                        v-model="addForm.parentId"
                        :options="treeData"
                        :props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name' }"
                        clearable
                        placeholder="请选择上级"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="addForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="字典值" prop="code">
                    <el-input v-model="addForm.code" placeholder="请输入字典值"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="sort">
                    <el-input-number v-model="addForm.sort" placeholder="请输入排序号"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="500px" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
                <!-- <el-form-item label="上级" prop="parentId">
                    <el-cascader
                        v-model="editForm.parentId"
                        :options="treeData"
                        :props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name' }"
                        clearable
                        placeholder="请选择上级"
                    >
                    </el-cascader>
                </el-form-item> -->
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="字典值" prop="code">
                    <el-input v-model="editForm.code" placeholder="请输入字典值"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="sort">
                    <el-input-number v-model="editForm.sort" placeholder="请输入排序号"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--批量添加-->
        <el-dialog title="批量添加" width="500px" :visible.sync="batchVisible" :close-on-click-modal="false">
            <el-form :model="batchForm" label-width="0px" :rules="formRules" ref="batchForm">
                <el-form-item prop="remark">
                    <el-input
                        type="textarea"
                        :rows="10"
                        v-model="batchForm.remark"
                        placeholder="每行1个选项，请用回车分割"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="batchVisible = false">取消</el-button>
                <el-button type="primary" @click="batchSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import md5 from 'md5'
export default {
    data() {
        return {
            action: this.$axios.defaults.baseURL + '/dicClassify/import',
            headers: {
                Authorization: localStorage.getItem('Authorization')
            },
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            tableData: [],
            addClassifyFormVisible: false,
            addClassifyForm: {
                name: ''
            },
            editClassifyFormVisible: false,
            editClassifyForm: {
                id: '',
                name: ''
            },
            classifyId: '',
            treeData: [],
            addFormVisible: false,
            addForm: {
                parentId: '',
                classifyId: '',
                name: '',
                code: 1,
                sort: 1
            },
            editFormVisible: false,
            editForm: {
                id: '',
                parentId: '',
                classifyId: '',
                name: '',
                code: '',
                sort: ''
            },
            formRules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                code: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
                sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }],
                remark: [{ required: true, message: '每行1个选项，请用回车分割', trigger: 'blur' }]
            },
            batchVisible: false,
            batchForm: {
                classifyId: '',
                remark: ''
            }
        }
    },
    created() {
        let timestamp = Date.now()
        this.headers.Sign = md5(
            'dicClassify/import?timestamp=' + timestamp + '&key=yVwlsbIrY3q22EnoYYM4nR5zqTmqed05'
        ).toUpperCase()
        this.headers.Timestamp = timestamp
    },
    mounted() {
        this.queryClassify()
    },
    methods: {
        queryClassify() {
            this.$axios.get('dicClassify/queryDisplay').then(res => {
                if (res.data.code == 200) {
                    this.tableData = res.data.data
                }
            })
        },
        handleNodeClick(row) {
            if (row) {
                this.classifyId = row.id
                this.queryDisplay()
            }
        },
        handleCommand(command, row) {
            if (command === 'edit') {
                this.editClassifyForm = Object.assign({}, row)
                this.editClassifyFormVisible = true
                if (this.$refs.editClassifyForm) {
                    this.$refs.editClassifyForm.resetFields()
                }
            } else if (command === 'delete') {
                this.deleteClassifySubmit(row)
            }
        },
        queryDisplay() {
            const params = {
                classifyId: this.classifyId
            }
            this.$axios.get('dicDetail/queryDisplay', { params }).then(res => {
                if (res.data.code == 200) {
                    this.treeData = res.data.data
                }
            })
        },
        showAddClassifyDialog() {
            this.addClassifyFormVisible = true
            if (this.$refs.addClassifyForm) {
                this.$refs.addClassifyForm.resetFields()
            }
        },
        addClassifySubmit() {
            this.$refs.addClassifyForm.validate(valid => {
                if (valid) {
                    this.$axios.post('dicClassify/insert', this.addClassifyForm).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('新增成功')
                            this.addClassifyFormVisible = false
                            this.queryClassify()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        editClassifySubmit() {
            this.$refs.editClassifyForm.validate(valid => {
                if (valid) {
                    this.$axios.post('dicClassify/update', this.editClassifyForm).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('修改成功')
                            this.editClassifyFormVisible = false
                            this.queryClassify()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        deleteClassifySubmit(row) {
            if (this.classifyId) {
                this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                    this.$axios.post('dicClassify/delete/' + row.id, {}).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('删除成功')
                            this.queryClassify()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                })
            } else {
                this.$message.error('请选择字典分类')
            }
        },
        //显示新增界面
        showAddDialog() {
            if (this.classifyId) {
                this.addFormVisible = true
                if (this.$refs.addForm) {
                    this.$refs.addForm.resetFields()
                }
                this.addForm.classifyId = this.classifyId
                this.addForm.code = this.treeData.length + 1
                this.addForm.sort = this.treeData.length + 1
            } else {
                this.$message.error('请选择字典分类')
            }
        },
        //新增
        addSubmit() {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    this.$axios.post('dicDetail/insert', this.addForm).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('新增成功')
                            this.addFormVisible = false
                            this.queryDisplay()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        //显示编辑界面
        showEditDialog(row) {
            this.editForm = Object.assign({}, row)
            delete this.editForm.children
            this.editFormVisible = true
            if (this.$refs.editForm) {
                this.$refs.editForm.resetFields()
            }
        },
        //编辑
        editSubmit() {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    this.$axios.post('dicDetail/update', this.editForm).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('修改成功')
                            this.editFormVisible = false
                            this.queryDisplay()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        deleteSubmit(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('dicDetail/delete/' + row.id, {}).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.queryDisplay()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        },
        statusChange(value, row) {
            this.editForm = Object.assign({}, row)
            delete this.editForm.children
            this.$axios.post('dicDetail/update', this.editForm).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('修改成功')
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        showBatchDialog() {
            if (this.classifyId) {
                this.batchVisible = true
                if (this.$refs.batchForm) {
                    this.$refs.batchForm.resetFields()
                }
            } else {
                this.$message.error('请选择字典分类')
            }
        },
        batchSubmit() {
            this.batchForm.classifyId = this.classifyId
            this.$refs.batchForm.validate(valid => {
                if (valid) {
                    this.$axios.post('dicDetail/batch', this.batchForm).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('新增成功')
                            this.batchVisible = false
                            this.queryDisplay()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        beforeUpload(file) {
            const suffix = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
            if (suffix != 'xlsx' && suffix != 'xls') {
                this.$message.error(`只能选择excel文件`)
                return false
            }
            return true
        },
        successHandle(res, file, fileList) {
            if (res.code === 200) {
                this.$message.success('导入成功')
                this.queryClassify()
            } else {
                this.$message.error(res.message)
            }
        }
    }
}
</script>
<style scoped>
::v-deep .el-main {
    border-left: 1px solid #e5e9f2;
    padding: 0px;
    margin-left: 15px;
}
.add-classify {
    margin-top: 15px;
    border: 1px dashed #e5e9f2;
    border-radius: 6px;
    text-align: center;
    padding: 8px 6px;
    margin-bottom: 15px;
    cursor: pointer;
    flex: 1;
    font-size: 12px;
}
::v-deep .el-table__body tr.current-row td:not(.is-center) {
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
}
::v-deep .el-aside .el-table__body tr.current-row .is-center {
    border-top-right-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
}
::v-deep .aside .el-table td {
    border-bottom: 0px solid #ebeef5;
}
</style>
