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
            <el-table
                :data="tableData"
                border
                highlight-current-row
                @selection-change="handleSelectionChange"
                :max-height="clientHeight - 255"
            >
                <el-table-column prop="id" label="主键" width="55" align="center"></el-table-column>
                <el-table-column prop="mark" label="标识" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="180"></el-table-column>
                <el-table-column prop="updateTime" label="修改时间" align="center" width="180"></el-table-column>
                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-dropdown @command="handleCommand($event, scope.row)">
                            <el-button type="text" size="small">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="authority">权限设置</el-dropdown-item>
                                <el-dropdown-item command="flow">流程设计</el-dropdown-item>
                                <el-dropdown-item command="javascript">动作脚本</el-dropdown-item>
                                <el-dropdown-item command="sql">SQL配置</el-dropdown-item>
                                <el-dropdown-item command="import">导入配置</el-dropdown-item>
                                <el-dropdown-item command="print">打印模板</el-dropdown-item>
                                <el-dropdown-item command="dataTitle">数据标题</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
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
        <!--打印模板-->
        <el-dialog title="通过模板创建" width="580px" :visible.sync="printVisible" :close-on-click-modal="false">
            <div style="color: #7d7e80; font-size: 13px">
                <div style="background: #f1f3f7; border-radius: 8px; padding: 8px 8px">
                    <div style="display: flex; align-items: center; line-height: 30px">
                        <div
                            style="background: #3a6cfa; width: 6px; height: 6px; border-radius: 50%; margin-right: 5px"
                        >
                            &nbsp;
                        </div>
                        <div>请在本地的Word、Excel文件中编辑模板内容和样式;</div>
                    </div>
                    <div style="display: flex; align-items: center; line-height: 30px">
                        <div
                            style="background: #3a6cfa; width: 6px; height: 6px; border-radius: 50%; margin-right: 5px"
                        >
                            &nbsp;
                        </div>
                        <div>
                            若需要插入字段，请按照<span style="color: #3a6cfa">[字段对照表]</span
                            >将所需的字段对应的字段代码复制、粘贴到Word、
                        </div>
                    </div>
                    <div>Excel模板中对应的位置;</div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; line-height: 48px">
                    <div style="color: #000; font-weight: bold; font-size: 15px">上传模板</div>
                    <div style="color: #3a6cfa; cursor: pointer">查看字段对照表</div>
                </div>
                <div>
                    <el-upload
                        :limit="1"
                        :action="action"
                        :headers="headers"
                        :file-list="printPath"
                        accept=".docx,.xlsx"
                        :before-upload="beforeWordUpload"
                        :class="printPath.length === 1 ? 'upload-disabled' : ''"
                        :on-success="handleFileSuccess"
                    >
                        <div
                            style="
                                border: 1px dashed #d3dce6;
                                padding: 10px;
                                width: 505px;
                                border-radius: 8px;
                                color: #333;
                            "
                        >
                            <i class="el-icon-upload2"> 上传Word、Excel模板</i>
                        </div>
                        <div slot="file" slot-scope="{ file }" style="display: flex">
                            <a
                                ><i class="el-icon-document" style="margin-right: 7px; color: #909399"></i
                                >{{ file.name }}</a
                            >
                            <div>
                                <i class="el-icon-download" @click="handleFileDownload(file)"></i>
                                <i class="el-icon-close" @click="handleFileRemove(file)"></i>
                            </div>
                        </div>
                    </el-upload>
                </div>
                <div style="margin-top: 10px">
                    <div style="display: flex; align-items: center; line-height: 24px">
                        <div
                            style="background: #3a6cfa; width: 6px; height: 6px; border-radius: 50%; margin-right: 5px"
                        >
                            &nbsp;
                        </div>
                        <div>请上传.docx、.xlsx格式文件;</div>
                    </div>
                    <div style="display: flex; align-items: center; line-height: 24px">
                        <div
                            style="background: #3a6cfa; width: 6px; height: 6px; border-radius: 50%; margin-right: 5px"
                        >
                            &nbsp;
                        </div>
                        <div>上传的文件大小不可超过10M;</div>
                    </div>
                </div>
                <div style="color: #000; font-weight: bold; font-size: 15px; margin-top: 15px">选择文件生成格式</div>
                <div style="margin: 15px 0px">
                    <el-radio-group v-model="printType">
                        <el-radio label="word">Word</el-radio>
                        <el-radio label="excel">Excel</el-radio>
                        <el-radio label="pdf">PDF</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="printVisible = false">取消</el-button>
                <el-button type="primary" @click="resourcesnSubmit">确定</el-button>
            </div>
        </el-dialog>
        <!--数据标题配置-->
        <el-dialog title="数据标题" width="750px" top="30px" :visible.sync="titleVisible" :close-on-click-modal="false">
            <formula v-model="title" :height="200" :variable="variable" v-if="titleVisible"></formula>
            <div slot="footer" class="dialog-footer">
                <el-button @click="titleVisible = false">取消</el-button>
                <el-button type="primary" @click="titleSubmit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import md5 from 'md5'
import formula from '@/views/components/codemirror/formula'
export default {
    components: {
        formula
    },
    data() {
        return {
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            account: localStorage.getItem('account'),
            action: this.$axios.defaults.baseURL + '/upload/putObject/oss',
            headers: {
                Authorization: window.localStorage.getItem('Authorization')
            },
            tableData: [],
            pageNo: 1,
            total: 0,
            searchForm: {
                name: ''
            },
            currentRow: {},
            printVisible: false,
            printPath: [],
            printType: 'word',
            multipleSelection: [],
            printScript: '',
            titleVisible: false,
            title: '',
            variable: []
        }
    },
    created() {
        let timestamp = Date.now()
        this.headers.Sign = md5(
            'upload/putObject/oss?timestamp=' + timestamp + '&key=yVwlsbIrY3q22EnoYYM4nR5zqTmqed05'
        ).toUpperCase()
        this.headers.Timestamp = timestamp
        this.queryByPage()
    },
    methods: {
        queryByPage() {
            const params = {
                pageNo: this.pageNo,
                name: this.searchForm.name
            }
            this.$axios.get('form/queryByPage', { params }).then(res => {
                if (res.data.code == 200) {
                    this.tableData = res.data.data.list
                    this.total = res.data.data.total
                }
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        handleSearch() {
            this.pageNo = 1
            this.queryByPage()
        },
        handleCurrentChange() {
            this.queryByPage()
        },
        showAddDialog() {
            this.$router.push({ path: '/addForm', query: { id: new Date().getTime() } })
        },
        showEditDialog(row) {
            this.$router.push({ path: '/editForm', query: { id: row.id } })
        },
        deleteSubmit(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('form/delete/' + row.id, {}).then(res => {
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
        handleCommand(command, row) {
            this.currentRow = row
            let options = JSON.parse(row.options)
            if (command === 'print') {
                this.printPath = options.printPath || []
                this.printType = options.printType || 'word'
                this.printVisible = true
            } else if (command === 'authority') {
                this.$router.push({ path: '/authority', query: { id: row.id, title: row.name } })
            } else if (command === 'javascript') {
                this.$router.push({ path: '/javascript', query: { id: row.id, title: row.name } })
            } else if (command === 'sql') {
                this.$router.push({ path: '/sql', query: { id: row.id, title: row.name } })
            } else if (command === 'import') {
                this.$router.push({
                    path: '/import',
                    query: { formId: row.id, title: row.name, tableId: row.dataSource }
                })
            } else if (command === 'dataTitle') {
                this.title = options.title
                this.queryBusinessField(row.dataSource)
            } else if (command === 'flow') {
                this.$router.push({ path: '/flow', query: { id: row.id, title: row.name, dataSource: row.dataSource } })
            }
        },
        async queryBusinessField(tableId) {
            let res = await this.$axios.get('businessField/queryByTableId/' + tableId)
            if (res.data.code === 200) {
                let variable = [
                    {
                        value: 'formName',
                        label: '表单名称'
                    },
                    {
                        value: 'createTime',
                        label: '提交时间'
                    }
                ]
                let fieldOptions = res.data.data
                for (let i = 0; i < fieldOptions.length; i++) {
                    let field = fieldOptions[i]
                    variable.push({ value: field.name, label: field.remark })
                }
                this.titleVisible = true
                this.variable = variable
            }
        },
        beforeWordUpload(file) {
            const suffix = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
            if (suffix != 'docx' && suffix != 'xlsx' && suffix != 'xls') {
                this.$message.error(`只能选择Word或Excel文件`)
                return false
            }
            const fileSize = file.size / 1024 / 1024 < 10
            if (!fileSize) {
                this.$message.error('上传文件大小不能超过 10MB')
                return false
            }
            return true
        },
        handleFileSuccess(res, file, fileList) {
            if (res.code === 200) {
                let fileArray = this.printPath
                fileArray.push({
                    name: file.name,
                    size: file.size,
                    url: res.data
                })
                this.printPath = fileArray
            } else {
                this.$message.error(res.message)
            }
        },
        handleFileDownload(file) {
            let params = {
                url: file.url,
                fileName: file.name
            }
            this.$axios.post('upload/download', params, { responseType: 'blob' }).then(res => {
                let content = res.data
                let blob = new Blob([content])
                if ('download' in document.createElement('a')) {
                    // 非IE下载
                    let elink = document.createElement('a')
                    elink.download = file.name
                    elink.style.display = 'none'
                    elink.href = URL.createObjectURL(blob)
                    document.body.appendChild(elink)
                    elink.click()
                    URL.revokeObjectURL(elink.href) // 释放URL 对象
                    document.body.removeChild(elink)
                } else {
                    // IE10+下载
                    navigator.msSaveBlob(blob, file.name)
                }
            })
        },
        handleFileRemove(file) {
            this.printPath = []
        },
        resourcesnSubmit() {
            let options = JSON.parse(this.currentRow.options)
            options.printPath = this.printPath
            options.printType = this.printType
            var params = {
                id: this.currentRow.id,
                options: JSON.stringify(options)
            }
            this.$axios.post('form/update', params).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('配置成功')
                    this.printVisible = false
                    this.pageNo = 1
                    this.queryByPage()
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        titleSubmit() {
            if (!this.title) {
                this.$message.error('数据标题不能为空')
                return
            }
            let options = JSON.parse(this.currentRow.options)
            options.title = this.title
            var params = {
                id: this.currentRow.id,
                options: JSON.stringify(options)
            }
            this.$axios.post('form/update', params).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('配置成功')
                    this.titleVisible = false
                    this.pageNo = 1
                    this.queryByPage()
                } else {
                    this.$message.error(res.data.message)
                }
            })
        }
    }
}
</script>

<style scoped>
::v-deep .upload-disabled .el-upload--picture-card {
    display: none;
}
.el-upload-list__item .el-icon-download {
    display: inline;
    position: absolute;
    top: 5px;
    right: 26px;
    cursor: pointer;
    opacity: 0.75;
    color: #606266;
}
.el-upload-list__item .el-icon-close {
    display: inline;
}
</style>
