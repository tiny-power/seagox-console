<template>
    <div>
        <div class="toolView">
            <el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
            <el-button type="text" icon="el-icon-coin" @click="generateIcon" size="small">图标生成</el-button>
        </div>
        <el-tabs v-model="activeName" style="margin-left: 15px">
            <el-tab-pane label="PC端" name="pc">
                <div style="margin-top: 10px; margin-right: 10px">
                    <!--列表-->
                    <el-table
                        :data="pcData"
                        border
                        :max-height="clientHeight - 215"
                        row-key="id"
                        :tree-props="{ children: 'children' }"
                    >
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column prop="name" label="菜单名称" header-align="center">
                            <template slot-scope="scope">
                                <i :class="scope.row.icon" style="font-size: 12px"></i>
                                {{ scope.row.name }}
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" align="center" :formatter="typeFormatter"></el-table-column>
                        <el-table-column
                            prop="path"
                            label="菜单路径"
                            align="center"
                            show-overflow-tooltip
                            :formatter="pathFormatter"
                        ></el-table-column>
                        <el-table-column prop="sort" label="排序" align="center"></el-table-column>
                        <el-table-column prop="status" label="状态" align="center">
                            <template slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.status"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    :active-value="1"
                                    :inactive-value="2"
                                    @change="statusChange(scope.row, $event)"
                                >
                                </el-switch>
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
            </el-tab-pane>
            <el-tab-pane label="移动端" name="mobile">
                <div style="margin-top: 10px; margin-right: 10px">
                    <!--列表-->
                    <el-table
                        :data="mobileData"
                        border
                        :max-height="clientHeight - 215"
                        row-key="id"
                        :tree-props="{ children: 'children' }"
                    >
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column prop="name" label="菜单名称" header-align="center">
                            <template slot-scope="scope">
                                <i :class="scope.row.icon" style="font-size: 12px"></i>
                                {{ scope.row.name }}
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" align="center" :formatter="typeFormatter"></el-table-column>
                        <el-table-column
                            prop="path"
                            label="菜单路径"
                            align="center"
                            show-overflow-tooltip
                            :formatter="pathFormatter"
                        ></el-table-column>
                        <el-table-column prop="sort" label="排序" align="center"></el-table-column>
                        <el-table-column prop="status" label="状态" align="center">
                            <template slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.status"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    :active-value="1"
                                    :inactive-value="2"
                                    @change="statusChange(scope.row, $event)"
                                >
                                </el-switch>
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
            </el-tab-pane>
        </el-tabs>

        <!--新增界面-->
        <el-dialog title="新增" width="750px" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="类型" prop="type">
                            <el-select v-model="addForm.type" placeholder="请选择类型" @change="typeChange">
                                <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model.trim="addForm.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="上级菜单" prop="parentId">
                            <el-cascader
                                ref="parentId"
                                v-model="addForm.parentId"
                                :options="menuData"
                                :props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name' }"
                                clearable
                                placeholder="请选择上级"
                                @change="handleParentChange"
                            >
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addForm.type === 2 || addForm.type === 4 || addForm.type === 7">
                        <el-form-item label="路径" prop="path">
                            <el-input v-model="addForm.path" placeholder="请输入路径"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addForm.type === 1 || addForm.type === 3 || addForm.type === 6">
                        <el-form-item label="路径" prop="path">
                            <el-cascader
                                v-model="addForm.path"
                                placeholder="请选择路径"
                                clearable
                                :options="frgOptions"
                                :props="{ emitPath: false, value: 'id', label: 'name' }"
                                filterable
                            ></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="图标" prop="icon">
                            <el-input placeholder="请选择图标" v-model="addForm.icon" readonly>
                                <i slot="prefix" :class="['el-input__icon', addForm.icon]" v-if="addForm.icon"></i>
                                <i slot="suffix" class="el-input__icon el-icon-tickets" @click="handleIconDialog"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序">
                            <el-input-number v-model="addForm.sort" :min="1"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" width="750px" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="类型" prop="type">
                            <el-select v-model="editForm.type" placeholder="请选择类型" @change="typeChange">
                                <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="上级菜单" prop="parentId">
                            <el-cascader
                                v-model="editForm.parentId"
                                :options="menuData"
                                :props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name' }"
                                clearable
                                placeholder="请选择上级"
                            >
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="editForm.type === 2 || editForm.type === 4 || editForm.type === 7">
                        <el-form-item label="路径" prop="path">
                            <el-input v-model="editForm.path" placeholder="请输入路径"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="editForm.type === 1 || editForm.type === 3 || editForm.type === 6">
                        <el-form-item label="路径" prop="path">
                            <el-cascader
                                v-model="editForm.path"
                                placeholder="请选择路径"
                                clearable
                                :options="frgOptions"
                                :props="{ emitPath: false, value: 'id', label: 'name' }"
                                filterable
                            ></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="图标" prop="icon">
                            <el-input placeholder="请选择图标" v-model="editForm.icon" readonly>
                                <i slot="prefix" :class="['el-input__icon', editForm.icon]" v-if="editForm.icon"></i>
                                <i slot="suffix" class="el-input__icon el-icon-tickets" @click="handleIconDialog"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序">
                            <el-input-number v-model="editForm.sort" :min="1"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--图标选择界面-->
        <el-dialog title="图标选择" width="950px" :visible.sync="iconFormVisible" :close-on-click-modal="false">
            <div style="padding-bottom: 15px">
                <el-form label-width="65px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="名称">
                                <el-input v-model="searchIconName" clearable placeholder="请输入名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-button
                                type="primary"
                                icon="el-icon-search"
                                @click.native="handleCurrentChange"
                                style="margin-left: 15px"
                                >查询</el-button
                            >
                        </el-col>
                    </el-row>
                </el-form>
                <el-scrollbar style="height: 100%">
                    <el-row>
                        <el-col
                            :span="3"
                            v-for="(item, index) in iconData"
                            :key="index"
                            style="margin-bottom: 10px; cursor: pointer"
                        >
                            <div
                                @click="handleIconClick(item)"
                                style="
                                    width: 100px;
                                    height: 100px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    flex-direction: column;
                                    border: 1px dashed #60606d;
                                    border-radius: 5px;
                                "
                            >
                                <i :class="item.font" style="font-size: 36px; color: #111111"></i>
                                <span style="color: #666; margin-top: 10px">{{ item.name }}</span>
                            </div>
                        </el-col>
                    </el-row>
                </el-scrollbar>
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
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            typeOptions: [
                {
                    value: 1,
                    label: '表单列表'
                },
                {
                    value: 2,
                    label: '按钮'
                },
                {
                    value: 3,
                    label: '新增表单'
                },
                {
                    value: 4,
                    label: '菜单页面'
                },
                {
                    value: 5,
                    label: '目录'
                },
                {
                    value: 6,
                    label: '仪表板'
                },
                {
                    value: 7,
                    label: '单页面'
                }
            ],
            pcData: [],
            mobileData: [],
            menuData: [],
            addFormVisible: false,
            addForm: {
                companyId: '',
                classify: '',
                type: '',
                name: '',
                parentId: '',
                icon: '',
                path: '',
                status: 1,
                sort: 1
            },
            editFormVisible: false,
            editForm: {
                id: '',
                companyId: '',
                classify: '',
                type: '',
                name: '',
                parentId: '',
                icon: '',
                path: '',
                status: 1,
                sort: 1
            },
            formRules: {
                type: [{ required: true, message: '请选择类型', trigger: 'change' }],
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                path: [{ required: true, message: '请输入路径', trigger: 'blur,change' }],
                icon: [{ required: true, message: '请选择图标', trigger: 'change' }]
            },
            frgOptions: [],
            iconOptions: [],
            iconFormVisible: false,
            pageSize: 32,
            pageNo: 1,
            total: 0,
            searchIconName: '',
            iconData: [],
            activeName: 'pc'
        }
    },
    created() {
        this.queryPcByCompanyId()
        this.queryMobileByCompanyId()
    },
    methods: {
        async queryPcByCompanyId() {
            let params = {
                classify: 1
            }
            const res = await this.$axios.get('menu/queryByCompanyId', { params })
            if (res.data.code == 200) {
                this.pcData = res.data.data
            }
        },
        async queryMobileByCompanyId() {
            let params = {
                classify: 2
            }
            const res = await this.$axios.get('menu/queryByCompanyId', { params })
            if (res.data.code == 200) {
                this.mobileData = res.data.data
            }
        },
        async queryForm() {
            const res = await this.$axios.get('form/queryByCompanyId')
            if (res.data.code == 200) {
                this.frgOptions = res.data.data
            }
        },
        async queryGauge() {
            const res = await this.$axios.get('gauge/queryByCompanyId')
            if (res.data.code == 200) {
                this.frgOptions = res.data.data
            }
        },
        typeFormatter(row) {
            if (row.type === 1) {
                return '表单列表'
            } else if (row.type === 2) {
                return '按钮'
            } else if (row.type === 3) {
                return '新增表单'
            } else if (row.type === 4) {
                return '菜单页面'
            } else if (row.type === 5) {
                return '目录'
            } else if (row.type === 6) {
                return '仪表板'
            } else if (row.type === 7) {
                return '单页面'
            }
        },
        pathFormatter(row) {
            if (row.type === 1 || row.type === 3 || row.type === 6 || row.type === 7) {
                return ''
            } else {
                return row.path
            }
        },
        typeChange(value) {
            if (value === 1 || value === 3) {
                this.queryForm()
            } else if (value === 6) {
                this.queryGauge()
            }
            if (this.addFormVisible) {
                this.$set(this.addForm, 'path', '')
            } else {
                this.$set(this.editForm, 'path', '')
            }
        },
        statusChange(row, value) {
            var params = {
                id: row.id,
                status: value,
                parentId: row.parentId
            }
            this.$axios.post('menu/update', params).then(res => {
                if (res.data.code == 200) {
                    if (value === 1) {
                        this.$message.success('启用成功')
                    } else {
                        this.$message.success('禁用成功')
                    }
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        showAddDialog() {
            this.addFormVisible = true
            if (this.$refs.addForm) {
                this.$refs.addForm.resetFields()
            }
            if (this.activeName === 'pc') {
                this.addForm.classify = 1
                this.menuData = this.pcData
            } else if (this.activeName === 'mobile') {
                this.addForm.classify = 2
                this.menuData = this.mobileData
            }
            if (this.activeName === 'pc') {
                this.addForm.sort = this.pcData.length + 1
            } else if (this.activeName === 'mobile') {
                this.addForm.sort = this.mobileData.length + 1
            }
        },
        addSubmit() {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    if (this.activeName === 'mobile') {
                        if (this.addForm.parentId) {
                            if (this.addForm.type == 2 || this.addForm.type == 5 || this.addForm.type == 7) {
                                this.$message.error('移动端下级级菜单不能选择按钮、目录及单页面')
                                return
                            }
                        } else {
                            if (this.addForm.type != 5) {
                                this.$message.error('移动端一级菜单只能选择目录')
                                return
                            }
                        }
                    }
                    this.$axios.post('menu/insert', this.addForm).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('新增成功')
                            this.addFormVisible = false
                            if (this.activeName === 'pc') {
                                this.queryPcByCompanyId()
                            } else if (this.activeName === 'mobile') {
                                this.queryMobileByCompanyId()
                            }
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
            if (this.activeName === 'pc') {
                this.menuData = this.pcData
            } else if (this.activeName === 'mobile') {
                this.menuData = this.mobileData
            }
            if (this.editForm.type === 1 || this.editForm.type === 3) {
                this.editForm.path = parseInt(this.editForm.path)
                this.queryForm()
            } else if (this.editForm.type === 6) {
                this.editForm.path = parseInt(this.editForm.path)
                this.queryGauge()
            }
        },
        editSubmit() {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    if (this.activeName === 'mobile') {
                        if (this.editForm.parentId) {
                            if (this.editForm.type == 2 || this.editForm.type == 5 || this.editForm.type == 7) {
                                this.$message.error('移动端下级级菜单不能选择按钮、目录及单页面')
                                return
                            }
                        } else {
                            if (this.editForm.type != 5) {
                                this.$message.error('移动端一级菜单只能选择目录')
                                return
                            }
                        }
                    }
                    var params = {
                        icon: this.editForm.icon,
                        id: this.editForm.id,
                        type: this.editForm.type,
                        name: this.editForm.name,
                        path: this.editForm.path,
                        sort: this.editForm.sort,
                        status: this.editForm.status,
                        parentId: this.editForm.parentId
                    }
                    this.$axios.post('menu/update', params).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('修改成功')
                            this.editFormVisible = false
                            if (this.activeName === 'pc') {
                                this.queryPcByCompanyId()
                            } else if (this.activeName === 'mobile') {
                                this.queryMobileByCompanyId()
                            }
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        deleteSubmit(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('menu/delete/' + row.id, {}).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.pageNo = 1
                        if (this.activeName === 'pc') {
                            this.queryPcByCompanyId()
                        } else if (this.activeName === 'mobile') {
                            this.queryMobileByCompanyId()
                        }
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        },
        queryIconByPage() {
            var params = {
                pageSize: this.pageSize,
                pageNo: this.pageNo,
                name: this.searchIconName
            }
            this.$axios.get('icon/queryByPage', { params }).then(res => {
                if (res.data.code == 200) {
                    this.iconData = res.data.data.list
                    this.total = res.data.data.total
                }
            })
        },
        handleCurrentChange() {
            this.queryIconByPage()
        },
        handleIconDialog() {
            this.queryIconByPage()
            this.iconFormVisible = true
        },
        handleIconClick(item) {
            if (this.addFormVisible) {
                this.addForm.icon = item.font
            } else if (this.editFormVisible) {
                this.editForm.icon = item.font
            }
            this.iconFormVisible = false
        },
        async generateIcon() {
            const res = await this.$axios.get('icon/generate')
            if (res.data.code == 200) {
                this.$message.success('生成成功')
            }
        },
        handleParentChange(value) {
            this.addForm.sort = this.$refs.parentId.getCheckedNodes()[0].children.length + 1
        }
    }
}
</script>
<style scoped></style>
