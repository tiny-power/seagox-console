<template>
    <div>
        <div class="searchView">
            <el-form label-width="65px">
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="字段名">
                            <el-input v-model="searchForm.name" clearable placeholder="请输入字段名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="注释">
                            <el-input v-model="searchForm.remark" clearable placeholder="请输入注释"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-button
                            type="primary"
                            icon="el-icon-search"
                            @click.native="handleSearch"
                            style="margin-left: 15px"
                            >查询</el-button
                        >
                        <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">新增</el-button>
                        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="showBatchDialog"
                            >批量添加</el-button
                        >
                        <el-upload
                            style="display: inline; margin-left: 10px; margin-right: 10px"
                            :action="action"
                            :show-file-list="false"
                            accept=".xlsx,.xls"
                            :headers="headers"
                            :before-upload="beforeUpload"
                            :on-success="successHandle"
                            :data="uploadParams"
                        >
                            <el-button type="primary" icon="el-icon-upload2">导入</el-button>
                        </el-upload>
                        <el-button type="primary" icon="el-icon-download" @click="downloadTemplate">下载模版</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table">
            <!--列表-->
            <el-table :data="tableData" border highlight-current-row :height="clientHeight - 200">
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="name" label="字段名" align="center"></el-table-column>
                <el-table-column prop="remark" label="注释" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="必填" align="center">
                    <template slot-scope="scope">
                        <i
                            class="el-icon-check"
                            style="color: green; font-weight: bold"
                            v-if="scope.row.notNull === 1"
                        ></i>
                        <i class="el-icon-close" style="color: red; font-weight: bold" v-else></i>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类型" align="center"></el-table-column>
                <el-table-column prop="length" label="长度" align="center"></el-table-column>
                <el-table-column prop="decimals" label="小数" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.decimals">{{ scope.row.decimals }}</div>
                        <div v-else>-</div>
                    </template>
                </el-table-column>
                <el-table-column prop="defaultValue" label="默认值" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.defaultValue">{{ scope.row.defaultValue }}</div>
                        <div v-else>-</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120">
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
            <el-form :model="addForm" label-width="70px" :rules="rules" ref="addForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="注释" prop="remark">
                            <el-input v-model="addForm.remark" placeholder="请输入注释"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="字段名" prop="name">
                            <el-input v-model.trim="addForm.name" placeholder="请输入字段名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类型" prop="type">
                            <el-select v-model="addForm.type" filterable placeholder="请选择类型" @change="typeChange">
                                <el-option label="枚举(integer)" value="integer"></el-option>
                                <el-option label="整数值(bigint)" value="bigint"></el-option>
                                <el-option label="小数值(decimal)" value="decimal"></el-option>
                                <el-option label="日期值(date)" value="date"></el-option>
                                <el-option label="日期时间值(timestamp)" value="timestamp"></el-option>
                                <el-option label="字符串(varchar)" value="varchar"></el-option>
                                <el-option label="长文本(text)" value="text"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="种类" prop="kind">
                            <el-select v-model="addForm.kind" filterable placeholder="请选择种类">
                                <el-option label="输入框" value="text"></el-option>
                                <el-option label="数字" value="number"></el-option>
                                <el-option label="单选框" value="radio"></el-option>
                                <el-option label="多选框" value="checkbox"></el-option>
                                <el-option label="下拉选择" value="select"></el-option>
                                <el-option label="级联选择" value="cascader"></el-option>
                                <el-option label="开关组件" value="switch"></el-option>
                                <el-option label="日期选择" value="datePicker"></el-option>
                                <el-option label="图片上传" value="picture"></el-option>
                                <el-option label="附件上传" value="upload"></el-option>
                                <el-option label="富文本" value="editor"></el-option>
                                <el-option label="流水号" value="bill"></el-option>
                                <el-option label="部门组件" value="department"></el-option>
                                <el-option label="成员组件" value="member"></el-option>
                                <el-option label="单位组件" value="company"></el-option>
                                <el-option label="业务组件" value="business"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addForm.type === 'decimal' || addForm.type === 'varchar'">
                        <el-form-item label="长度" prop="length">
                            <el-input-number
                                v-model="addForm.length"
                                :controls="false"
                                :precision="0"
                                :min="0"
                                :max="3000"
                                placeholder="请输入长度"
                            >
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addForm.type === 'decimal'">
                        <el-form-item label="小数" prop="decimals">
                            <el-input-number
                                v-model="addForm.decimals"
                                :controls="false"
                                :precision="0"
                                :min="0"
                                :max="30"
                                placeholder="请输入小数"
                            >
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="必填" prop="notNull">
                            <el-select v-model="addForm.notNull">
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="外键" prop="targetTableId">
                            <el-select v-model="addForm.targetTableId" placeholder="请选择表名" clearable filterable>
                                <el-option
                                    v-for="item in tableOptions"
                                    :key="item.id"
                                    :label="item.remark + '(' + item.name + ')'"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12" v-if="addForm.type != 'text'">
                        <el-form-item label="默认值" prop="defaultValue">
                            <el-input placeholder="请输入默认值" v-model="addForm.defaultValue"> </el-input>
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
            <el-form :model="editForm" label-width="70px" :rules="rules" ref="editForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="注释" prop="remark">
                            <el-input v-model="editForm.remark" placeholder="请输入注释"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="字段名" prop="name">
                            <el-input v-model.trim="editForm.name" placeholder="请输入字段名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类型" prop="type">
                            <el-select v-model="editForm.type" filterable placeholder="请选择类型" @change="typeChange">
                                <el-option label="枚举(integer)" value="integer"></el-option>
                                <el-option label="整数值(bigint)" value="bigint"></el-option>
                                <el-option label="小数值(decimal)" value="decimal"></el-option>
                                <el-option label="日期值(date)" value="date"></el-option>
                                <el-option label="日期时间值(timestamp)" value="timestamp"></el-option>
                                <el-option label="字符串(varchar)" value="varchar"></el-option>
                                <el-option label="长文本(text)" value="text"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="种类" prop="kind">
                            <el-select v-model="editForm.kind" filterable placeholder="请选择种类">
                                <el-option label="输入框" value="text"></el-option>
                                <el-option label="数字" value="number"></el-option>
                                <el-option label="单选框" value="radio"></el-option>
                                <el-option label="多选框" value="checkbox"></el-option>
                                <el-option label="下拉选择" value="select"></el-option>
                                <el-option label="级联选择" value="cascader"></el-option>
                                <el-option label="开关组件" value="switch"></el-option>
                                <el-option label="日期选择" value="datePicker"></el-option>
                                <el-option label="图片上传" value="picture"></el-option>
                                <el-option label="附件上传" value="upload"></el-option>
                                <el-option label="富文本" value="editor"></el-option>
                                <el-option label="流水号" value="bill"></el-option>
                                <el-option label="部门组件" value="department"></el-option>
                                <el-option label="成员组件" value="member"></el-option>
                                <el-option label="单位组件" value="company"></el-option>
                                <el-option label="业务组件" value="business"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="editForm.type === 'decimal' || editForm.type === 'varchar'">
                        <el-form-item label="长度" prop="length">
                            <el-input-number
                                v-model="editForm.length"
                                :controls="false"
                                :precision="0"
                                :min="0"
                                :max="3000"
                                placeholder="请输入长度"
                            >
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="editForm.type === 'decimal'">
                        <el-form-item label="小数" prop="decimals">
                            <el-input-number
                                v-model="editForm.decimals"
                                :controls="false"
                                :precision="0"
                                :min="0"
                                :max="30"
                                placeholder="请输入小数"
                            >
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="必填" prop="notNull">
                            <el-select v-model="editForm.notNull">
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="外键" prop="targetTableId">
                            <el-select v-model="editForm.targetTableId" placeholder="请选择表名" clearable filterable>
                                <el-option
                                    v-for="item in tableOptions"
                                    :key="item.id"
                                    :label="item.remark + '(' + item.name + ')'"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12" v-if="editForm.type != 'text'">
                        <el-form-item label="默认值" prop="defaultValue">
                            <el-input placeholder="请输入默认值" v-model="editForm.defaultValue"> </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--批量添加-->
        <el-dialog title="批量添加" width="1146px" :visible.sync="batchVisible" :close-on-click-modal="false">
            <div style="margin-top: -15px; margin-bottom: 15px">
                <el-button @click="handleBatchAdd" type="text" size="small" icon="el-icon-circle-plus-outline"
                    >添加</el-button
                >
                <el-table :data="batchData" border highlight-current-row>
                    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                    <el-table-column prop="remark" label="注释" align="center" width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="small" placeholder="请输入注释"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="字段名" align="center" width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.name" size="small" placeholder="请输入字段名"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" align="center" width="150">
                        <template slot-scope="scope">
                            <el-select
                                v-model="scope.row.type"
                                size="small"
                                filterable
                                placeholder="请选择类型"
                                @change="batchTypeChange($event, scope.$index)"
                            >
                                <el-option label="枚举(integer)" value="integer"></el-option>
                                <el-option label="整数值(bigint)" value="bigint"></el-option>
                                <el-option label="小数值(decimal)" value="decimal"></el-option>
                                <el-option label="日期值(date)" value="date"></el-option>
                                <el-option label="日期时间值(timestamp)" value="timestamp"></el-option>
                                <el-option label="字符串(varchar)" value="varchar"></el-option>
                                <el-option label="长文本(text)" value="text"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="kind" label="种类" align="center" width="150">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.kind" size="small" filterable placeholder="请选择种类">
                                <el-option label="输入框" value="text"></el-option>
                                <el-option label="数字" value="number"></el-option>
                                <el-option label="单选框" value="radio"></el-option>
                                <el-option label="多选框" value="checkbox"></el-option>
                                <el-option label="下拉选择" value="select"></el-option>
                                <el-option label="级联选择" value="cascader"></el-option>
                                <el-option label="开关组件" value="switch"></el-option>
                                <el-option label="日期选择" value="datePicker"></el-option>
                                <el-option label="图片上传" value="picture"></el-option>
                                <el-option label="附件上传" value="upload"></el-option>
                                <el-option label="富文本" value="editor"></el-option>
                                <el-option label="流水号" value="bill"></el-option>
                                <el-option label="部门组件" value="department"></el-option>
                                <el-option label="成员组件" value="member"></el-option>
                                <el-option label="单位组件" value="company"></el-option>
                                <el-option label="业务组件" value="business"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="length" label="长度" align="center" width="80">
                        <template slot-scope="scope">
                            <el-input-number
                                v-model="scope.row.length"
                                :controls="false"
                                :precision="0"
                                :min="0"
                                :max="3000"
                                placeholder="请输入长度"
                                size="small"
                            >
                            </el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column prop="decimals" label="小数" align="center" width="80">
                        <template slot-scope="scope">
                            <el-input-number
                                v-model="scope.row.decimals"
                                :controls="false"
                                :precision="0"
                                :min="0"
                                :max="30"
                                placeholder="请输入小数"
                                size="small"
                            >
                            </el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column prop="notNull" label="必填" align="center" width="85">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.notNull" size="small">
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="0"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="defaultValue" label="默认值" align="center" width="150">
                        <template slot-scope="scope">
                            <el-input placeholder="请输入默认值" v-model="scope.row.defaultValue" size="small">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="60">
                        <template slot-scope="scope">
                            <i
                                class="el-icon-remove-outline"
                                style="color: #f56c6c; font-size: 16px"
                                @click="handleBatchDel(scope.$index)"
                            ></i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="batchVisible = false">取消</el-button>
                <el-button type="primary" @click="batchSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import md5 from 'md5'
import Schema from 'async-validator'
export default {
    data() {
        return {
            action: this.$axios.defaults.baseURL + '/businessField/import',
            headers: {
                Authorization: localStorage.getItem('Authorization')
            },
            uploadParams: {
                tableId: this.$route.query.businessTableId
            },
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            searchForm: {
                name: '',
                remark: ''
            },
            tableData: [],
            addFormVisible: false,
            addForm: {
                businessTableId: '',
                name: '',
                length: 30,
                decimals: 2,
                remark: '',
                type: '',
                kind: '',
                notNull: 0,
                defaultValue: ''
            },
            editFormVisible: false,
            editForm: {
                id: '',
                businessTableId: '',
                name: '',
                length: 30,
                decimals: 2,
                remark: '',
                type: '',
                kind: '',
                notNull: 0,
                defaultValue: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入字段名', trigger: 'blur' },
                    { pattern: /^[a-z_]{1,}$/, message: '只能输入小写英文字母或下划线' }
                ],
                length: [{ required: true, message: '请输入长度', trigger: 'blur' }],
                decimals: [{ required: true, message: '请输入小数', trigger: 'blur' }],
                remark: [{ required: true, message: '请输入注释', trigger: 'blur' }],
                type: [{ required: true, message: '请选择类型', trigger: 'change' }],
                kind: [{ required: true, message: '请选择种类', trigger: 'change' }]
            },
            tableOptions: [],
            batchVisible: false,
            batchData: []
        }
    },
    created() {
        let timestamp = Date.now()
        this.headers.Sign = md5(
            'businessField/import?tableId=' +
                this.$route.query.businessTableId +
                '&timestamp=' +
                timestamp +
                '&key=yVwlsbIrY3q22EnoYYM4nR5zqTmqed05'
        ).toUpperCase()
        this.headers.Timestamp = timestamp
    },
    mounted() {
        this.queryByPage()
        this.queryTable()
    },
    methods: {
        async queryByPage() {
            const params = {
                businessTableId: this.$route.query.businessTableId,
                name: this.searchForm.name,
                remark: this.searchForm.remark
            }
            let res = await this.$axios.get('businessField/queryByTableId', { params })
            if (res.data.code == 200) {
                this.tableData = res.data.data
            }
        },
        async queryTable() {
            let res = await this.$axios.get('businessTable/queryAll')
            if (res.data.code == 200) {
                this.tableOptions = res.data.data
            }
        },
        kindFormatter(row) {
            if (row.kind === 'text') {
                return '输入框'
            } else if (row.kind === 'number') {
                return '数字'
            } else if (row.kind === 'radio') {
                return '单选框'
            } else if (row.kind === 'checkbox') {
                return '多选框'
            } else if (row.kind === 'select') {
                return '下拉选择'
            } else if (row.kind === 'cascader') {
                return '级联选择'
            } else if (row.kind === 'switch') {
                return '开关组件'
            } else if (row.kind === 'datePicker') {
                return '日期选择'
            } else if (row.kind === 'picture') {
                return '图片上传'
            } else if (row.kind === 'upload') {
                return '附件上传'
            } else if (row.kind === 'editor') {
                return '富文本'
            } else if (row.kind === 'bill') {
                return '流水号'
            } else if (row.kind === 'company') {
                return '单位组件'
            } else if (row.kind === 'department') {
                return '部门组件'
            } else if (row.kind === 'member') {
                return '成员组件'
            } else if (row.kind === 'business') {
                return '业务组件'
            }
            return row.kind
        },
        handleSearch() {
            this.queryByPage()
        },
        handleCurrentChange() {
            this.queryByPage()
        },
        //显示新增界面
        showAddDialog() {
            this.addFormVisible = true
            if (this.$refs.addForm) {
                this.$refs.addForm.resetFields()
            }
            this.addForm.businessTableId = this.$route.query.businessTableId
        },
        //新增
        addSubmit() {
            if (this.addForm.type === 'varchar') {
                if (this.addForm.length == 0) {
                    this.$message.error('长度不能为0')
                    return
                }
            }
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    this.$axios.post('businessField/insert', this.addForm).then(res => {
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
            if (this.editForm.type === 'varchar') {
                if (this.editForm.length == 0) {
                    this.$message.error('长度不能为0')
                    return
                }
            }
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    this.$axios.post('businessField/update', this.editForm).then(res => {
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
            this.$confirm('亲，确认要删除吗', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('businessField/delete/' + row.id, {}).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.queryByPage()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        },
        typeChange(value) {
            if (this.addFormVisible) {
                if (value === 'integer') {
                    this.addForm.length = 4
                    this.addForm.decimals = 0
                    this.addForm.kind = 'select'
                } else if (value === 'bigint') {
                    this.addForm.length = 20
                    this.addForm.decimals = 0
                    this.addForm.kind = ''
                } else if (value === 'decimal') {
                    this.addForm.length = 20
                    this.addForm.decimals = 2
                    this.addForm.kind = 'number'
                } else if (value === 'varchar') {
                    this.addForm.length = 30
                    this.addForm.decimals = 0
                    this.addForm.kind = 'text'
                } else if (value === 'date') {
                    this.addForm.length = 30
                    this.addForm.decimals = 0
                    this.addForm.kind = 'datePicker'
                } else if (value === 'timestamp') {
                    this.addForm.length = 30
                    this.addForm.decimals = 0
                    this.addForm.kind = 'datePicker'
                } else {
                    this.addForm.length = 30
                    this.addForm.decimals = 0
                    this.addForm.kind = ''
                }
                this.addForm.defaultValue = ''
            } else {
                if (value === 'integer') {
                    this.editForm.length = 4
                    this.editForm.decimals = 0
                    this.editForm.kind = 'select'
                } else if (value === 'bigint') {
                    this.editForm.length = 20
                    this.editForm.decimals = 0
                    this.editForm.kind = ''
                } else if (value === 'decimal') {
                    this.editForm.length = 20
                    this.editForm.decimals = 2
                    this.editForm.kind = 'number'
                } else if (value === 'varchar') {
                    this.editForm.length = 30
                    this.editForm.decimals = 0
                    this.editForm.kind = 'text'
                } else if (value === 'date') {
                    this.editForm.length = 30
                    this.editForm.decimals = 0
                    this.editForm.kind = 'datePicker'
                } else if (value === 'timestamp') {
                    this.editForm.length = 30
                    this.editForm.decimals = 0
                    this.editForm.kind = 'datePicker'
                } else {
                    this.editForm.length = 30
                    this.editForm.decimals = 0
                    this.editForm.kind = ''
                }
                this.editForm.defaultValue = ''
            }
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
                this.queryByPage()
            } else {
                this.$message.error(res.message)
            }
        },
        downloadTemplate() {
            let params = {
                templateName: 'fieldModel.xlsx'
            }
            this.$axios.post('upload/downloadTemplate', params, { responseType: 'blob' }).then(res => {
                let content = res.data
                let blob = new Blob([content])
                if ('download' in document.createElement('a')) {
                    // 非IE下载
                    let elink = document.createElement('a')
                    elink.download = '数据建模.xlsx'
                    elink.style.display = 'none'
                    elink.href = URL.createObjectURL(blob)
                    document.body.appendChild(elink)
                    elink.click()
                    URL.revokeObjectURL(elink.href) // 释放URL 对象
                    document.body.removeChild(elink)
                } else {
                    // IE10+下载
                    navigator.msSaveBlob(blob, '数据建模.xlsx')
                }
            })
        },
        showBatchDialog() {
            this.batchVisible = true
            this.batchData = []
        },
        handleBatchAdd() {
            this.batchData.push({
                businessTableId: this.$route.query.businessTableId,
                name: '',
                length: 30,
                decimals: 2,
                remark: '',
                type: '',
                kind: '',
                notNull: 0,
                defaultValue: ''
            })
        },
        handleBatchDel(index) {
            this.batchData.splice(index, 1)
        },
        batchTypeChange(value, index) {
            let item = this.batchData[index]
            if (value === 'integer') {
                item.length = 4
                item.decimals = 0
                item.kind = 'select'
            } else if (value === 'bigint') {
                item.length = 20
                item.decimals = 0
                item.kind = ''
            } else if (value === 'decimal') {
                item.length = 20
                item.decimals = 2
                item.kind = 'number'
            } else if (value === 'varchar') {
                item.length = 30
                item.decimals = 0
                item.kind = 'text'
            } else if (value === 'date') {
                item.length = 30
                item.decimals = 0
                item.kind = 'datePicker'
            } else if (value === 'timestamp') {
                item.length = 30
                item.decimals = 0
                item.kind = 'datePicker'
            } else {
                item.length = 30
                item.decimals = 0
                item.kind = ''
            }
            item.defaultValue = ''
            this.$set(this.batchData, index, item)
        },
        batchSubmit() {
            if (this.batchData.length === 0) {
                this.$message.error('请添加数据')
                return
            }
            let valid = true
            const descriptor = {
                name: {
                    type: 'string',
                    required: true,
                    message: '注释不能为空'
                },
                remark: {
                    type: 'string',
                    required: true,
                    message: '字段名不能为空'
                },
                type: {
                    type: 'string',
                    required: true,
                    message: '类型不能为空'
                },
                kind: {
                    type: 'string',
                    required: true,
                    message: '种类不能为空'
                },
                length: {
                    type: 'integer',
                    required: true,
                    message: '长度不能为空'
                },
                decimals: {
                    type: 'integer',
                    required: true,
                    message: '小数不能为空'
                }
            }
            const validator = new Schema(descriptor)
            for (let i = 0; i < this.batchData.length; i++) {
                if (valid) {
                    validator.validate(this.batchData[i], (errors, fields) => {
                        if (errors) {
                            valid = false
                            this.$message.error('第' + (i + 1) + '行，' + errors[0].message)
                            return
                        }
                    })
                }
            }
            if (valid) {
                let params = {
                    data: JSON.stringify(this.batchData)
                }
                this.$axios.post('businessField/batch', params).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('新增成功')
                        this.batchVisible = false
                        this.queryByPage()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            }
        }
    }
}
</script>
<style scoped>
::v-deep .is-without-controls .el-input .el-input__inner {
    text-align: left;
}
.add-classify {
    border: 1px dashed #e5e9f2;
    border-radius: 6px;
    text-align: center;
    padding: 8px;
    margin-bottom: 15px;
    cursor: pointer;
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
