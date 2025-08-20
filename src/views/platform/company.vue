<template>
    <div>
        <div class="toolView">
            <el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
        </div>
        <div class="table">
            <!--列表-->
            <el-table
                :max-height="clientHeight - 165"
                :data="tableData"
                border
                highlight-current-row
                default-expand-all
                row-key="id"
                :tree-props="{ children: 'children' }"
            >
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column prop="code" label="编码" header-align="center"></el-table-column>
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column prop="alias" label="简称" align="center"></el-table-column>
                <el-table-column label="logo" align="center">
                    <template slot-scope="scope">
                        <el-image
                            style="width: 36px; height: 36px; margin-top: 6px; border-radius: 36px"
                            :src="scope.row.logo"
                            :preview-src-list="[scope.row.logo]"
                        >
                            <div slot="error">
                                <i class="el-icon-picture-outline-round" style="font-size: 36px"></i>
                            </div>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--新增界面-->
        <el-dialog title="新增" width="750px" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm">
                <el-col :span="12">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model.trim="addForm.name" clearable placeholder="请输入名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="简称" prop="alias">
                        <el-input v-model.trim="addForm.alias" clearable placeholder="请输入简称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="上级" prop="parentId">
                        <el-cascader
                            ref="parentId"
                            v-model="addForm.parentId"
                            :options="tableData"
                            :props="{ checkStrictly: true, emitPath: false }"
                            clearable
                            placeholder="请选择上级"
                            @change="handleParentChange"
                        >
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                    <el-form-item label="排序号" prop="sort">
                        <el-input-number v-model="addForm.sort" placeholder="请输入排序号"></el-input-number>
                    </el-form-item>
                </el-col> -->
                <el-col :span="24">
                    <el-form-item label="logo" prop="logo">
                        <el-upload
                            class="avatar-uploader"
                            :action="action"
                            :headers="headers"
                            :show-file-list="false"
                            :on-success="handleUploadSuccess"
                            :before-upload="beforeUpload"
                        >
                            <img v-if="addForm.logo" :src="addForm.logo" class="avatar" />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="750px" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <div class="el-dialog-div"></div>
            <el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
                <el-col :span="12">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model.trim="editForm.name" clearable placeholder="请输入名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="简称" prop="alias">
                        <el-input v-model.trim="editForm.alias" clearable placeholder="请输入简称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="上级">
                        <el-cascader
                            v-model="editForm.parentId"
                            :options="tableData"
                            :props="{ checkStrictly: true, emitPath: false }"
                            placeholder="请选择上级"
                        >
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                    <el-form-item label="排序号" prop="sort">
                        <el-input-number v-model="editForm.sort" placeholder="请输入排序号"></el-input-number>
                    </el-form-item>
                </el-col> -->
                <el-col :span="24">
                    <el-form-item label="logo" prop="logo">
                        <el-upload
                            class="avatar-uploader"
                            :action="action"
                            :headers="headers"
                            :show-file-list="false"
                            :on-success="handleUploadSuccess"
                            :before-upload="beforeUpload"
                        >
                            <img v-if="editForm.logo" :src="editForm.logo" class="avatar" />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import md5 from 'md5'
export default {
    data() {
        return {
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            action: this.$axios.defaults.baseURL + '/upload/putObject/oss',
            headers: {
                Authorization: window.localStorage.getItem('Authorization')
            },
            tableData: [],
            addFormVisible: false,
            addForm: {
                name: '',
                alias: '',
                parentId: '',
                logo: '',
                sort: 0
            },
            editFormVisible: false,
            editForm: {
                id: '',
                name: '',
                alias: '',
                parentId: '',
                logo: '',
                sort: ''
            },
            rules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                alias: [{ required: true, message: '请输入简称', trigger: 'blur' }],
                parentId: [{ required: true, message: '请选择上级', trigger: 'change' }]
            }
        }
    },
    created() {
        let timestamp = Date.now()
        this.headers.Sign = md5(
            'upload/putObject/oss?timestamp=' + timestamp + '&key=yVwlsbIrY3q22EnoYYM4nR5zqTmqed05'
        ).toUpperCase()
        this.headers.Timestamp = timestamp
        this.queryAll()
    },
    methods: {
        async queryAll() {
            let res = await this.$axios.get('company/queryAll')
            if (res.data.code == 200) {
                this.tableData = res.data.data
            }
        },
        handleUploadSuccess(res, file) {
            if (res.code === 200) {
                if (this.addFormVisible) {
                    this.addForm.logo = res.data
                } else {
                    this.$set(this.editForm, 'logo', res.data)
                }
            } else {
                this.$message.error(res.message)
            }
        },
        beforeUpload(file) {
            const suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
            const filelist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
            let result = filelist.find(item => item === suffix)
            if (!result) {
                this.$message.error('请上传图片类型')
                return false
            }
            const isLtSize = file.size / 1024 / 1024 < 10
            if (!isLtSize) {
                this.$message.error('上传头像图片大小不能超过10MB')
                return false
            }
            return true
        },
        //显示新增界面
        showAddDialog() {
            this.addFormVisible = true
            if (this.$refs.addForm) {
                this.$refs.addForm.resetFields()
            }
            this.addForm.sort = this.tableData.length + 1
        },
        //新增
        addSubmit() {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    this.$axios.post('company/insert', this.addForm).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('新增成功')
                            this.addFormVisible = false
                            this.queryAll()
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
            this.editFormVisible = true
            if (this.$refs.editForm) {
                this.$refs.editForm.resetFields()
            }
        },
        //编辑
        editSubmit() {
            let params = {
                id: this.editForm.id,
                parentId: this.editForm.parentId,
                name: this.editForm.name,
                alias: this.editForm.alias,
                sort: this.editForm.sort
            }
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    this.$axios.post('company/update', params).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('修改成功')
                            this.editFormVisible = false
                            this.queryAll()
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        deleteSubmit(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('company/delete/' + row.id, {}).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.queryAll()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        },
        handleParentChange(value) {
            this.addForm.sort = this.$refs.parentId.getCheckedNodes()[0].children.length + 1
        }
    }
}
</script>
