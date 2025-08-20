<template>
    <div>
        <div class="header">
            <div class="header-left">
                <div class="header-back" @click="toReturn"><i class="el-icon-arrow-left"></i></div>
                <div class="header-title">{{ title }}</div>
            </div>
        </div>
        <div class="main" :style="{ width: '100%', height: clientHeight - 60 + 'px' }">
            <el-tabs v-model="activeName" style="width: 100%" @tab-click="handleTabClick">
                <el-tab-pane label="提交状态" name="1">
                    <el-button type="primary" plain style="margin-top: 15px; margin-bottom: 15px" @click="handleAdd"
                        >添加权限组</el-button
                    >
                    <el-form
                        ref="form"
                        :model="formAthority"
                        :rules="rules"
                        label-width="80px"
                        style="border: 1px solid #1583f2; padding-top: 20px; padding-right: 20px; border-radius: 8px"
                        v-if="formAthority.show"
                    >
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="formAthority.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                        <el-form-item label="权限成员" prop="members">
                            <el-cascader
                                v-model="formAthority.members"
                                placeholder="请选择角色"
                                clearable
                                :options="options"
                                :props="props"
                                filterable
                            ></el-cascader>
                        </el-form-item>
                        <el-form-item label="字段权限">
                            <el-table
                                :data="formAthority.field"
                                row-key="id"
                                default-expand-all
                                border
                                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                                max-height="300px"
                            >
                                <el-table-column prop="label" label="名称" align="center"></el-table-column>
                                <el-table-column prop="field" label="字段" align="center"></el-table-column>
                                <el-table-column prop="behavior" label="可编辑" align="center">
                                    <template slot-scope="scope">
                                        <el-radio v-model="scope.row.behavior" label="NORMAL">{{ '' }}</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="behavior" label="只读" align="center">
                                    <template slot-scope="scope">
                                        <el-radio v-model="scope.row.behavior" label="DISABLED">{{ '' }}</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="behavior" label="隐藏" align="center">
                                    <template slot-scope="scope">
                                        <el-radio v-model="scope.row.behavior" label="HIDDEN">{{ '' }}</el-radio>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                        <el-form-item style="text-align: right">
                            <el-button type="primary" @click="submitForm">保存</el-button>
                        </el-form-item>
                    </el-form>
                    <div style="margin-top: 15px">
                        <!--列表-->
                        <el-table :data="tableData" border>
                            <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                            <el-table-column prop="name" label="名称" align="center"></el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click="showEditDialog(scope.row)"
                                        >编辑</el-button
                                    >
                                    <el-divider direction="vertical"></el-divider>
                                    <el-button type="text" size="small" @click="deleteSubmit(scope.row)"
                                        >删除</el-button
                                    >
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
                </el-tab-pane>
                <el-tab-pane label="查看状态" name="2">
                    <el-button type="primary" plain style="margin-top: 15px; margin-bottom: 15px" @click="handleAdd"
                        >添加权限组</el-button
                    >
                    <el-form
                        ref="form"
                        :model="formAthority"
                        :rules="rules"
                        label-width="80px"
                        style="border: 1px solid #1583f2; padding-top: 20px; padding-right: 20px; border-radius: 8px"
                        v-if="formAthority.show"
                    >
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="formAthority.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                        <el-form-item label="权限成员" prop="members">
                            <el-cascader
                                v-model="formAthority.members"
                                placeholder="请选择角色"
                                clearable
                                :options="options"
                                :props="props"
                                filterable
                            ></el-cascader>
                        </el-form-item>
                        <el-form-item label="数据范围">
                            <el-button type="primary" size="medium" round icon="el-icon-plus" @click="handleDataRange"
                                >设置</el-button
                            >
                        </el-form-item>
                        <el-form-item label="字段权限">
                            <el-table
                                :data="formAthority.field"
                                row-key="id"
                                default-expand-all
                                border
                                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                                max-height="300px"
                            >
                                <el-table-column prop="label" label="名称" align="center"></el-table-column>
                                <el-table-column prop="field" label="字段" align="center"></el-table-column>
                                <el-table-column prop="behavior" label="可编辑" align="center">
                                    <template slot-scope="scope">
                                        <el-radio v-model="scope.row.behavior" label="NORMAL">{{ '' }}</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="behavior" label="只读" align="center">
                                    <template slot-scope="scope">
                                        <el-radio v-model="scope.row.behavior" label="DISABLED">{{ '' }}</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="behavior" label="隐藏" align="center">
                                    <template slot-scope="scope">
                                        <el-radio v-model="scope.row.behavior" label="HIDDEN">{{ '' }}</el-radio>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                        <el-form-item style="text-align: right">
                            <el-button type="primary" @click="submitForm">保存</el-button>
                        </el-form-item>
                    </el-form>
                    <div style="margin-top: 15px">
                        <!--列表-->
                        <el-table :data="tableData" border>
                            <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                            <el-table-column prop="name" label="名称" align="center"></el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click="showEditDialog(scope.row)"
                                        >编辑</el-button
                                    >
                                    <el-divider direction="vertical"></el-divider>
                                    <el-button type="text" size="small" @click="deleteSubmit(scope.row)"
                                        >删除</el-button
                                    >
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
                </el-tab-pane>
            </el-tabs>
        </div>
        <dataPermission ref="dataRange" @confirm="confirm"></dataPermission>
    </div>
</template>

<script>
import dataPermission from '@/views/components/form/dataPermission'
export default {
    components: {
        dataPermission
    },
    data() {
        return {
            clientHeight: 0,
            activeName: '1',
            options: [],
            props: { multiple: true, emitPath: false },
            submitAthority: [],
            viewAthority: [],
            formAthority: {
                show: false,
                name: '',
                members: [],
                field: [],
                scope: []
            },
            rules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                members: [{ required: true, message: '请选择角色', trigger: 'change' }]
            },
            tableData: [],
            pageNo: 1,
            total: 0
        }
    },
    beforeMount() {
        this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
    },
    computed: {
        title() {
            return this.$route.query.title
        }
    },
    mounted() {
        this.queryByPage()
        this.queryById()
        this.queryAllAndRole()
    },
    methods: {
        async queryByPage() {
            let params = {
                formId: this.$route.query.id,
                type: this.activeName,
                pageNo: this.pageNo
            }
            let res = await this.$axios.get('formAthority/queryByPage', { params })
            if (res.data.code == 200) {
                this.tableData = res.data.data.list
                this.total = res.data.data.total
            }
        },
        async queryById() {
            let res = await this.$axios.get('form/queryById/' + this.$route.query.id)
            if (res.data.code == 200) {
                let module = JSON.parse(res.data.data.workbook).module
                let submitAthority = []
                let viewAthority = []
                for (let key in module) {
                    let attribute = module[key]
                    if (attribute.type === 'table') {
                        let children = []
                        for (let i = 0; i < attribute.tableColumn.length; i++) {
                            let column = attribute.tableColumn[i]
                            children.push({
                                id: Math.random().toString(36).slice(-6),
                                label: column.name,
                                field: attribute.table + '.' + column.field,
                                behavior: 'NORMAL'
                            })
                        }
                        submitAthority.push({
                            id: key,
                            type: attribute.type,
                            label: attribute.label,
                            field: attribute.field,
                            behavior: 'NORMAL',
                            children: children
                        })
                        viewAthority.push({
                            id: key,
                            type: attribute.type,
                            label: attribute.label,
                            field: attribute.field,
                            behavior: 'DISABLED',
                            children: children
                        })
                    } else if (attribute.type === 'custom') {
                    } else {
                        submitAthority.push({
                            id: key,
                            type: attribute.type,
                            label: attribute.label,
                            field: attribute.field,
                            behavior: 'NORMAL'
                        })
                        viewAthority.push({
                            id: key,
                            type: attribute.type,
                            label: attribute.label,
                            field: attribute.field,
                            behavior: 'DISABLED'
                        })
                    }
                }
                this.submitAthority = submitAthority
                this.viewAthority = viewAthority
            }
        },
        async queryAllAndRole() {
            let res = await this.$axios.get('company/queryAllAndRole')
            if (res.data.code == 200) {
                this.options = res.data.data
            }
        },
        handleTabClick() {
            this.formAthority.show = false
            this.queryByPage()
        },
        handleCurrentChange() {
            this.queryByPage()
        },
        toReturn() {
            this.$router.go(-1)
        },
        handleAdd() {
            if (this.activeName == 1) {
                this.formAthority = {
                    show: true,
                    name: '',
                    members: [],
                    field: this.submitAthority,
                    scope: []
                }
            } else if (this.activeName == 2) {
                this.formAthority = {
                    show: true,
                    name: '',
                    members: [],
                    field: this.viewAthority,
                    scope: []
                }
            }
        },
        submitForm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    var params = {
                        formId: this.$route.query.id,
                        name: this.formAthority.name,
                        members: this.formAthority.members.toString(),
                        type: this.activeName,
                        field: JSON.stringify(this.formAthority.field),
                        scope: JSON.stringify(this.formAthority.scope)
                    }
                    if (this.formAthority.id) {
                        params.id = this.formAthority.id
                        this.$axios.post('formAthority/update', params).then(res => {
                            if (res.data.code == 200) {
                                this.$message.success('保存成功')
                                this.queryByPage()
                                this.formAthority.show = false
                            } else {
                                this.$message.error(res.data.message)
                            }
                        })
                    } else {
                        this.$axios.post('formAthority/insert', params).then(res => {
                            if (res.data.code == 200) {
                                this.$message.success('保存成功')
                                this.queryByPage()
                                this.formAthority.show = false
                            } else {
                                this.$message.error(res.data.message)
                            }
                        })
                    }
                }
            })
        },
        showEditDialog(row) {
            this.formAthority = {
                id: row.id,
                show: true,
                name: row.name,
                members: row.members.split(','),
                field: JSON.parse(row.field),
                scope: JSON.parse(row.scope)
            }
        },
        deleteSubmit(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('formAthority/delete/' + row.id, {}).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.pageNo = 1
                        this.queryByPage()
                        this.formAthority.show = false
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        },
        handleDataRange() {
            this.$refs.dataRange.showDialog(this.formAthority.scope)
        },
        confirm(value) {
            this.formAthority.scope = value
        }
    }
}
</script>

<style scoped>
::v-deep .el-scrollbar__wrap {
    overflow-x: hidden !important;
}
::v-deep .cm-variable {
    color: #00f;
    font-size: 16px;
}
.main {
    display: flex;
    padding: 15px;
    box-sizing: border-box;
}
.header {
    width: 100%;
    height: 60px;
    font-size: 14px;
    color: #fff;
    background: #3a6cfa;
    display: flex;
    align-items: center;
}

.header > * {
    flex: 1;
    width: 100%;
}

.header-left {
    display: -webkit-box;
    display: flex;
    align-items: center;
}

.header-back {
    display: inline-block;
    width: 60px;
    height: 60px;
    font-size: 22px;
    border-right: 1px solid #1583f2;
    text-align: center;
    cursor: pointer;
}

.header-back .el-icon-arrow-left {
    line-height: 60px;
}

.header-back:hover {
    background: #5af;
}

.header-title {
    width: 0;
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0 15px;
}
</style>
