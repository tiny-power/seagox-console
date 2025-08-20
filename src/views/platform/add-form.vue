<template>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <div class="header-back" @click="toReturn"><i class="el-icon-back"></i></div>
            </div>
            <div class="header-center">
                <el-steps :active="active" simple>
                    <el-step title="基础信息"></el-step>
                    <el-step title="表单设计"></el-step>
                    <el-step title="列表配置"></el-step>
                    <el-step title="搜索条件"></el-step>
                </el-steps>
            </div>
            <div class="header-right">
                <el-button @click="handleLast">上一步</el-button>
                <el-button @click="handleNext">下一步</el-button>
                <el-button type="primary" @click="handleSave">保 存</el-button>
            </div>
        </div>
        <div class="content" :style="{ height: clientHeight - 66 + 'px' }">
            <div class="step-one" v-show="active === 0">
                <el-form
                    :model="form"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="70px"
                    style="background-color: #fff; margin-top: 20px; padding: 20px; border-radius: 8px; width: 600px"
                >
                    <el-col :span="24">
                        <el-form-item label="表名" prop="dataSource">
                            <el-select
                                v-model="form.dataSource"
                                filterable
                                placeholder="请选择表名"
                                ref="dataSourceRef"
                                @change="dataSourceChange"
                            >
                                <el-option
                                    v-for="item in tableOptions"
                                    :key="item.id"
                                    :label="item.remark + '(' + item.name + ')'"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="名称" prop="name">
                            <el-input
                                v-model.trim="form.name"
                                placeholder="请输入名称"
                                :maxlength="10"
                                show-word-limit
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="24">
                        <el-form-item label="自定流程">
                            <el-select v-model="form.options.freeProcess">
                                <el-option label="否" :value="false"></el-option>
                                <el-option label="是" :value="true"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                </el-form>
            </div>
            <div class="step-two" v-show="active === 1">
                <div class="config">
                    <el-table :data="fieldOptions" border highlight-current-row :max-height="clientHeight - 75">
                        <el-table-column prop="remark" label="名称" align="center"></el-table-column>
                        <el-table-column prop="name" label="字段" align="center"></el-table-column>
                        <el-table-column label="操作" align="center" width="60">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="handleUse(scope.row)">使用</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div id="spreadsheet"></div>
                <div class="config">
                    <senior-config
                        ref="seniorConfig"
                        :currentModule="currentModule"
                        :dataSource="form.dataSource"
                        @submitConfigForm="submitConfigForm"
                        @deleteConfigForm="deleteConfigForm"
                    />
                </div>
            </div>
            <div class="step-three" v-show="active === 2">
                <div class="toolView">
                    <el-button type="text" icon="el-icon-plus" @click="showAddTableColumnDialog" size="small"
                        >新增</el-button
                    >
                </div>
                <div style="margin: 0px 15px">
                    <!--列表-->
                    <el-table
                        :data="form.options.tableColumn"
                        border
                        highlight-current-row
                        row-key="id"
                        default-expand-all
                        :tree-props="{ children: 'children' }"
                        :max-height="clientHeight - 120"
                    >
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="prop" label="字段名" align="center"></el-table-column>
                        <el-table-column prop="label" label="名称" align="center"></el-table-column>
                        <el-table-column prop="width" label="列宽" align="center">
                            <template slot-scope="scope">
                                <div v-if="!scope.row.width">-</div>
                                <div v-else>{{ scope.row.width }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="锁定" align="center" width="188">
                            <template slot-scope="scope">
                                <el-button-group>
                                    <el-button
                                        size="mini"
                                        :type="scope.row.locking === 1 ? 'primary' : ''"
                                        @click="handleLocking(scope.row, 1)"
                                        >左侧</el-button
                                    >
                                    <el-button
                                        size="mini"
                                        :type="scope.row.locking === 2 ? 'primary' : ''"
                                        @click="handleLocking(scope.row, 2)"
                                        >右侧</el-button
                                    >
                                    <el-button
                                        size="mini"
                                        :type="scope.row.locking === 3 ? 'primary' : ''"
                                        @click="handleLocking(scope.row, 3)"
                                        >否</el-button
                                    >
                                </el-button-group>
                            </template>
                        </el-table-column>
                        <el-table-column label="合并" align="center" width="100">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.summary" active-value="1" inactive-value="0"> </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="合计" align="center" width="100">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.total" active-value="1" inactive-value="0"> </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="排序" align="center" width="100">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.sortable"> </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="120">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="showTableColumnEditDialog(scope.row)"
                                    >编辑</el-button
                                >
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" size="small" @click="handleDeleteTableColumn(scope.row)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="step-four" v-show="active === 3">
                <div class="toolView">
                    <el-button type="text" icon="el-icon-plus" @click="showSearchAddDialog" size="small"
                        >新增</el-button
                    >
                </div>
                <div style="margin: 0px 15px">
                    <el-table :data="form.options.searchColumn" border highlight-current-row max-height="500">
                        <el-table-column prop="field" label="字段" align="center"></el-table-column>
                        <el-table-column
                            prop="type"
                            label="类型"
                            align="center"
                            :formatter="typeFormatter"
                        ></el-table-column>
                        <el-table-column prop="desc" label="说明" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" @click="showSearchEditDialog(scope.row)" size="small"
                                    >编辑</el-button
                                >
                                <el-divider direction="vertical"></el-divider>
                                <el-button type="text" @click="searchDelSubmit(scope.$index)" size="small"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <!--新增列表配置-->
        <el-dialog title="新增" width="750px" :visible.sync="addTableColumnVisible" :close-on-click-modal="false">
            <el-form :model="addTableColumnForm" label-width="80px" :rules="tableColumnRules" ref="addTableColumnForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="字段名" prop="prop">
                            <el-autocomplete
                                v-model="addTableColumnForm.prop"
                                placeholder="请输入字段名"
                                :fetch-suggestions="querySearch"
                                @select="handleSelect"
                                clearable
                            ></el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="名称" prop="label">
                            <el-input v-model="addTableColumnForm.label" placeholder="请输入名称" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="上级" prop="parentId">
                            <el-cascader
                                v-model="addTableColumnForm.parentId"
                                :options="form.options.tableColumn"
                                :props="{ checkStrictly: true, emitPath: false, value: 'id' }"
                                clearable
                                placeholder="请选择上级"
                            >
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="列宽" prop="width">
                            <el-input-number
                                v-model="addTableColumnForm.width"
                                :controls="false"
                                :precision="0"
                                placeholder="请输入列宽"
                            ></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="格式化" prop="formatter">
                            <el-select
                                v-model="addTableColumnForm.formatter"
                                placeholder="请选择数据源"
                                clearable
                                filterable
                                @change="tableHeaderFormatterChange"
                            >
                                <el-option
                                    v-for="item in formatterOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addTableColumnVisible = false">取消</el-button>
                <el-button type="primary" @click="addTableColumnSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑列表配置--->
        <el-dialog title="编辑" width="750px" :visible.sync="editTableColumnVisible" :close-on-click-modal="false">
            <el-form
                :model="editTableColumnForm"
                label-width="80px"
                :rules="tableColumnRules"
                ref="editTableColumnForm"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="字段名" prop="prop">
                            <el-autocomplete
                                v-model="editTableColumnForm.prop"
                                placeholder="请输入字段名"
                                :fetch-suggestions="querySearch"
                                @select="handleSelect"
                                clearable
                            ></el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="标题" prop="label">
                            <el-input v-model="editTableColumnForm.label" placeholder="请输入标题" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="上级" prop="parentId">
                            <el-cascader
                                v-model="editTableColumnForm.parentId"
                                :options="form.options.tableColumn"
                                :props="{ checkStrictly: true, emitPath: false, value: 'id' }"
                                clearable
                                placeholder="请选择上级"
                                disabled
                            >
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="列宽" prop="width">
                            <el-input-number
                                v-model="editTableColumnForm.width"
                                :controls="false"
                                :precision="0"
                                placeholder="请输入列宽"
                            ></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="格式化" prop="formatter">
                            <el-select
                                v-model="editTableColumnForm.formatter"
                                placeholder="请选择数据源"
                                clearable
                                filterable
                                @change="tableHeaderFormatterChange"
                            >
                                <el-option
                                    v-for="item in formatterOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editTableColumnVisible = false">取消</el-button>
                <el-button type="primary" @click="editTableColumnSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--新增搜索配置-->
        <el-dialog title="新增" width="500px" :visible.sync="addSearchVisible" :close-on-click-modal="false">
            <el-form :model="addSearchForm" label-width="80px" :rules="searchRules" ref="addSearchForm">
                <el-form-item label="字段" prop="field">
                    <el-autocomplete
                        v-model="addSearchForm.field"
                        placeholder="请输入字段"
                        :fetch-suggestions="querySearch"
                        @select="handleSelect"
                        clearable
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="addSearchForm.type" placeholder="请选择类型">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明" prop="desc">
                    <el-input
                        v-model="addSearchForm.desc"
                        placeholder="请输入说明"
                        :maxlength="4"
                        show-word-limit
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="占位提示" prop="placeholder">
                    <el-input
                        v-model="addSearchForm.placeholder"
                        placeholder="请输入占位提示"
                        show-word-limit
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="数据源"
                    prop="source"
                    filterable
                    v-if="addSearchForm.type === 'select' || addSearchForm.type === 'cascader'"
                >
                    <el-select
                        v-model="addSearchForm.source"
                        placeholder="请选择数据源"
                        clearable
                        @change="sourceChange"
                        filterable
                    >
                        <el-option v-for="item in formatterOptions" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="是否多选"
                    v-if="addSearchForm.type === 'select' || addSearchForm.type === 'cascader'"
                >
                    <el-switch v-model="addSearchForm.multiple"></el-switch>
                </el-form-item>
                <el-form-item label="日期类型" v-if="addSearchForm.type === 'datePicker'" prop="dateType">
                    <el-select v-model="addSearchForm.dateType" placeholder="请选择日期类型">
                        <el-option label="年" value="year|yyyy"></el-option>
                        <el-option label="年-月" value="month|yyyy-MM"></el-option>
                        <el-option label="年-月-日" value="date|yyyy-MM-dd"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addSearchVisible = false">取消</el-button>
                <el-button type="primary" @click="addSearchSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑搜索配置-->
        <el-dialog title="编辑" width="500px" :visible.sync="editSearchVisible" :close-on-click-modal="false">
            <el-form :model="editSearchForm" label-width="80px" :rules="searchRules" ref="editSearchForm">
                <el-form-item label="字段" prop="field">
                    <el-autocomplete
                        v-model="editSearchForm.field"
                        placeholder="请输入字段"
                        :fetch-suggestions="querySearch"
                        @select="handleSelect"
                        clearable
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="editSearchForm.type" placeholder="请选择类型">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明" prop="desc">
                    <el-input
                        v-model="editSearchForm.desc"
                        placeholder="请输入说明"
                        :maxlength="4"
                        show-word-limit
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="占位提示" prop="placeholder">
                    <el-input
                        v-model="editSearchForm.placeholder"
                        placeholder="请输入占位提示"
                        show-word-limit
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="数据源"
                    prop="source"
                    filterable
                    v-if="editSearchForm.type === 'select' || editSearchForm.type === 'cascader'"
                >
                    <el-select
                        v-model="editSearchForm.source"
                        placeholder="请选择数据源"
                        clearable
                        @change="sourceChange"
                        filterable
                    >
                        <el-option v-for="item in formatterOptions" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="是否多选"
                    v-if="editSearchForm.type === 'select' || editSearchForm.type === 'cascader'"
                >
                    <el-switch v-model="editSearchForm.multiple"></el-switch>
                </el-form-item>
                <el-form-item label="日期类型" v-if="editSearchForm.type === 'datePicker'" prop="dateType">
                    <el-select v-model="editSearchForm.dateType" placeholder="请选择日期类型">
                        <el-option label="年" value="year|yyyy"></el-option>
                        <el-option label="年-月" value="month|yyyy-MM"></el-option>
                        <el-option label="年-月-日" value="date|yyyy-MM-dd"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editSearchVisible = false">取消</el-button>
                <el-button type="primary" @click="editSearchSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Spreadsheet from 'x-data-spreadsheet'
import zhCN from 'x-data-spreadsheet/dist/locale/zh-cn'
import seniorConfig from '@/views/senior/senior-config'
import Sortable from 'sortablejs'
export default {
    components: {
        seniorConfig
    },
    data() {
        return {
            active: 0,
            form: {
                mark: '',
                name: '',
                dataSource: '',
                workbook: {
                    row: 10,
                    col: 6,
                    data: {},
                    module: {}
                },
                options: {
                    title: "formName + '(' + user_id + ' ' + createTime + ')'",
                    freeProcess: false,
                    sql: '',
                    tableColumn: [],
                    searchColumn: []
                }
            },
            rules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                dataSource: [{ required: true, message: '请选择表名', trigger: 'change' }]
            },
            option: {
                showBottomBar: false,
                view: {
                    height: () => document.documentElement.clientHeight - 75,
                    width: () => 781
                },
                row: {
                    height: 36,
                    len: 10
                },
                col: {
                    width: 120,
                    len: 6
                }
            },
            xs: null,
            rowIndex: 0,
            colIndex: 0,
            currentModule: {
                type: 'word',
                field: []
            },
            tableOptions: [],
            tableHeaderData: [],
            tableColumnRules: {
                prop: [{ required: true, message: '请输入字段名', trigger: 'blur' }],
                label: [{ required: true, message: '请输入名称', trigger: 'blur' }]
            },
            addTableColumnVisible: false,
            addTableColumnForm: {
                id: '',
                parentId: '',
                prop: '',
                label: '',
                width: '',
                locking: 3,
                summary: 2,
                total: 2,
                align: 'left',
                formatter: ''
            },
            editTableColumnVisible: false,
            editTableColumnForm: {
                id: '',
                parentId: '',
                prop: '',
                label: '',
                width: '',
                locking: 3,
                summary: 2,
                total: 2,
                align: 'left',
                formatter: ''
            },
            typeOptions: [
                {
                    label: '输入框',
                    value: 'input'
                },
                {
                    label: '下拉选择',
                    value: 'select'
                },
                {
                    label: '日期选择',
                    value: 'datePicker'
                },
                {
                    label: '级联选择',
                    value: 'cascader'
                },
                {
                    label: '自定义',
                    value: 'custom'
                }
            ],
            searchRules: {
                type: [{ required: true, message: '请选择类型', trigger: 'change' }],
                field: [{ required: true, message: '请输入字段', trigger: 'blur' }],
                desc: [{ required: true, message: '请输入说明', trigger: 'blur' }],
                placeholder: [{ required: true, message: '请输入占位提示', trigger: 'blur' }],
                dateType: [{ required: true, message: '请选择日期类型', trigger: 'change' }],
                source: [{ required: true, message: '请选择数据源', trigger: 'change' }]
            },
            addSearchVisible: false,
            addSearchForm: {
                id: '',
                type: 'input',
                field: '',
                desc: '',
                placeholder: ''
            },
            editSearchVisible: false,
            editSearchForm: {
                id: '',
                type: '',
                field: '',
                desc: '',
                placeholder: ''
            },
            formatterOptions: [],
            businessOptions: [],
            fieldOptions: []
        }
    },
    beforeMount() {
        this.clientWidth = document.documentElement.clientWidth || document.body.clientWidth
        this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
    },
    created() {
        this.queryFormatter()
        this.queryBusinessTable()
        this.queryBusiness()
    },
    mounted() {
        Spreadsheet.locale('zh-cn')
        const that = this
        const step_four_tbody = document.querySelector('.step-three .el-table__body-wrapper tbody')
        Sortable.create(step_four_tbody, {
            onEnd({ newIndex, oldIndex }) {
                const currRow = that.form.options.tableColumn.splice(oldIndex, 1)[0]
                that.$nextTick(() => {
                    that.form.options.tableColumn.splice(newIndex, 0, currRow)
                })
            }
        })
        const step_five_tbody = document.querySelector('.step-four .el-table__body-wrapper tbody')
        Sortable.create(step_five_tbody, {
            onEnd({ newIndex, oldIndex }) {
                const currRow = that.form.options.searchColumn.splice(oldIndex, 1)[0]
                that.$nextTick(() => {
                    that.form.options.searchColumn.splice(newIndex, 0, currRow)
                })
            }
        })
    },
    methods: {
        loadSheet() {
            if (!this.xs) {
                this.xs = new Spreadsheet('#spreadsheet', this.option).loadData(this.form.workbook.data)
                this.xs.on('cell-selected', (cell, rowIndex, colIndex) => {
                    if (cell && cell.key && this.form.workbook.module[cell.key]) {
                        this.currentModule = this.form.workbook.module[cell.key]
                    } else {
                        this.currentModule = {
                            type: 'word'
                        }
                    }
                    this.rowIndex = rowIndex
                    this.colIndex = colIndex
                })

                var cell = this.xs.cell(this.rowIndex, this.colIndex)
                if (cell && cell.key && this.form.workbook.module[cell.key]) {
                    this.currentModule = this.form.workbook.module[cell.key]
                }
            }
        },
        async queryFormatter() {
            let res = await this.$axios.get('dicClassify/queryDisplay')
            if (res.data.code === 200) {
                this.formatterOptions = res.data.data
            }
        },
        async queryBusinessTable() {
            let res = await this.$axios.get('businessTable/queryAll')
            if (res.data.code === 200) {
                this.tableOptions = res.data.data
            }
        },
        async queryBusiness() {
            let res = await this.$axios.get('form/queryByCompanyId')
            if (res.data.code === 200) {
                this.businessOptions = res.data.data
            }
        },
        toReturn() {
            this.$confirm('系统可能不会保存您所做的更改, 是否继续退出?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$router.go(-1)
                })
                .catch(() => {})
        },
        handleLast() {
            if (this.active != 0) {
                this.active--
            }
        },
        handleNext() {
            if (this.$refs.seniorConfig.fieldOptions) {
                let fieldOptions = this.$refs.seniorConfig.fieldOptions
                for (let i = 0; i < fieldOptions.length; i++) {
                    let field = fieldOptions[i]
                    field['value'] = field.name + '(' + field.remark + ')'
                }
                this.fieldOptions = fieldOptions
            }
            if (this.active === 0) {
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        this.loadSheet()
                        this.active++
                    }
                })
            } else if (this.active === 1) {
                if (!this.form.options.sql) {
                    let label = this.$refs.dataSourceRef.selected.label
                    let tableName = label.substring(label.lastIndexOf('(') + 1, label.length - 1)
                    let sql = `<mapper><select id="getList" resultType="camelKeyMap">\n          select * from ${tableName}\n    </select></mapper>`
                    this.form.options.sql = sql
                }
                this.active++
            } else if (this.active != 3) {
                this.active++
            }
        },
        handleSave() {
            if (this.xs) {
                this.form.workbook.data = this.xs.getData()[0]
            }
            if (this.active === 0) {
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        this.saveSubmit()
                    }
                })
            } else {
                this.saveSubmit()
            }
        },
        saveSubmit() {
            if (this.form.options.tableColumn.length === 0) {
                this.$message.error('列表配置不能为空')
                return
            }
            this.form.workbook.row = this.form.workbook.data.rows.len
            this.form.workbook.col = this.form.workbook.data.cols.len
            let rowsStr = JSON.stringify(this.form.workbook.data.rows)
            let module = this.form.workbook.module
            for (var key in module) {
                if (!rowsStr.includes(key)) {
                    delete this.form.workbook.module[key]
                }
            }
            var params = {
                id: this.$route.query.id,
                mark: this.form.mark,
                name: this.form.name,
                dataSource: this.form.dataSource,
                workbook: JSON.stringify(this.form.workbook),
                options: JSON.stringify(this.form.options)
            }
            this.$axios.post('form/insert', params).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('新增成功')
                    this.$router.go(-1)
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        handleUse(row) {
            let placeholder = ''
            if (
                row.kind === 'text' ||
                row.kind === 'textarea' ||
                row.kind === 'number' ||
                row.kind === 'editor' ||
                row.kind === 'bill'
            ) {
                placeholder = '请输入' + row.remark
            } else if (
                row.kind === 'radio' ||
                row.kind === 'checkbox' ||
                row.kind === 'select' ||
                row.kind === 'cascader' ||
                row.kind === 'datePicker' ||
                row.kind === 'department' ||
                row.kind === 'member' ||
                row.kind === 'company' ||
                row.kind === 'business'
            ) {
                placeholder = '请选择' + row.remark
            } else if (row.kind === 'picture' || row.kind === 'upload') {
                placeholder = '请选择' + row.remark
            }
            this.currentModule = {
                type: row.kind,
                field: row.name,
                label: row.remark,
                placeholder: placeholder,
                required: row.notNull === 1
            }
            this.submitConfigForm({
                type: row.kind,
                field: row.name,
                label: row.remark,
                placeholder: placeholder,
                required: row.notNull === 1
            })
        },
        submitConfigForm(value) {
            var key = ''
            var cell = this.xs.cell(this.rowIndex, this.colIndex)
            if (cell && cell.key) {
                key = cell.key
            } else {
                key = Math.random().toString(36).slice(-6)
            }
            this.xs.sheet.data.setSelectedCellAttr('align', 'center')
            this.xs.sheet.data.setSelectedCellAttr('bgcolor', '#a1a3a6')
            this.xs.sheet.data.setSelectedCellAttr('key', key)
            if (value.type === 'text') {
                this.xs.cellText(this.rowIndex, this.colIndex, '输入框').reRender()
            } else if (value.type === 'number') {
                this.xs.cellText(this.rowIndex, this.colIndex, '数字').reRender()
            } else if (value.type === 'editor') {
                this.xs.cellText(this.rowIndex, this.colIndex, '富文本').reRender()
            } else if (value.type === 'radio') {
                this.xs.cellText(this.rowIndex, this.colIndex, '单选框').reRender()
            } else if (value.type === 'checkbox') {
                this.xs.cellText(this.rowIndex, this.colIndex, '多选框').reRender()
            } else if (value.type === 'select') {
                this.xs.cellText(this.rowIndex, this.colIndex, '下拉选择').reRender()
            } else if (value.type === 'cascader') {
                this.xs.cellText(this.rowIndex, this.colIndex, '级联选择').reRender()
            } else if (value.type === 'switch') {
                this.xs.cellText(this.rowIndex, this.colIndex, '开关组件').reRender()
            } else if (value.type === 'datePicker') {
                this.xs.cellText(this.rowIndex, this.colIndex, '日期选择').reRender()
            } else if (value.type === 'picture') {
                this.xs.cellText(this.rowIndex, this.colIndex, '图片上传').reRender()
            } else if (value.type === 'upload') {
                this.xs.cellText(this.rowIndex, this.colIndex, '附件上传').reRender()
            } else if (value.type === 'table') {
                this.xs.cellText(this.rowIndex, this.colIndex, '表格').reRender()
            } else if (value.type === 'bill') {
                this.xs.cellText(this.rowIndex, this.colIndex, '流水号').reRender()
            } else if (value.type === 'department') {
                this.xs.cellText(this.rowIndex, this.colIndex, '部门组件').reRender()
            } else if (value.type === 'member') {
                this.xs.cellText(this.rowIndex, this.colIndex, '成员组件').reRender()
            } else if (value.type === 'company') {
                this.xs.cellText(this.rowIndex, this.colIndex, '单位组件').reRender()
            } else if (value.type === 'business') {
                this.xs.cellText(this.rowIndex, this.colIndex, '业务组件').reRender()
            } else if (value.type === 'custom') {
                this.xs.cellText(this.rowIndex, this.colIndex, '自定义组件').reRender()
            }
            this.$set(this.form.workbook.module, key, JSON.parse(JSON.stringify(this.currentModule)))
        },
        deleteConfigForm() {
            var key = ''
            var cell = this.xs.cell(this.rowIndex, this.colIndex)
            if (cell && cell.key) {
                key = cell.key
                this.xs.sheet.data.setSelectedCellAttr('align', 'left')
                this.xs.sheet.data.setSelectedCellAttr('bgcolor', '#fff')
                this.xs.cellText(this.rowIndex, this.colIndex, '').reRender()
                delete this.form.workbook.module[key]
                this.currentModule = {
                    type: 'word'
                }
            }
        },
        showAddTableColumnDialog() {
            this.addTableColumnVisible = true
            if (this.$refs.addTableColumnForm) {
                this.$refs.addTableColumnForm.resetFields()
            }
            this.addTableColumnForm.id = Math.random().toString(36).slice(-6)
        },
        showTableColumnEditDialog(row) {
            this.editTableColumnForm = Object.assign({}, row)
            this.editTableColumnVisible = true
            if (this.$refs.editTableColumnForm) {
                this.$refs.editTableColumnForm.resetFields()
            }
        },
        handleDeleteTableColumn(row) {
            this.delTableColumnRecursion(this.form.options.tableColumn, row)
        },
        delTableColumnRecursion(tableColumnData, delTableColumn) {
            for (let i = 0; i < tableColumnData.length; i++) {
                let tableColumn = tableColumnData[i]
                if (tableColumn.id === delTableColumn.id) {
                    tableColumnData.splice(i, 1)
                    return
                }
                if (tableColumn.children) {
                    this.delTableColumnRecursion(tableColumn.children, delTableColumn)
                }
            }
        },
        addTableColumnSubmit() {
            this.$refs['addTableColumnForm'].validate(valid => {
                if (valid) {
                    let addTableColumn = JSON.parse(JSON.stringify(this.addTableColumnForm))
                    if (addTableColumn.parentId) {
                        let tableColumnData = this.form.options.tableColumn
                        this.addTableColumnRecursion(tableColumnData, addTableColumn)
                    } else {
                        this.form.options.tableColumn.push(addTableColumn)
                    }
                    this.addTableColumnVisible = false
                }
            })
        },
        addTableColumnRecursion(tableColumnData, addTableColumn) {
            for (let i = 0; i < tableColumnData.length; i++) {
                let tableColumn = tableColumnData[i]
                if (tableColumn.id === addTableColumn.parentId) {
                    if (!tableColumn.children) {
                        this.$set(tableColumn, 'children', [])
                    }
                    tableColumn.children.push(addTableColumn)
                    return
                }
                if (tableColumn.children) {
                    this.addTableColumnRecursion(tableColumn.children, addTableColumn)
                }
            }
        },
        editTableColumnSubmit() {
            this.$refs['editTableColumnForm'].validate(valid => {
                if (valid) {
                    let editTableColumn = JSON.parse(JSON.stringify(this.editTableColumnForm))
                    let tableColumnData = this.form.options.tableColumn
                    this.editTableColumnRecursion(tableColumnData, editTableColumn)
                    this.editTableColumnVisible = false
                }
            })
        },
        editTableColumnRecursion(tableColumnData, editTableColumn) {
            for (let i = 0; i < tableColumnData.length; i++) {
                let tableColumn = tableColumnData[i]
                if (tableColumn.id === editTableColumn.id) {
                    this.$set(tableColumnData, i, editTableColumn)
                    return
                }
                if (tableColumn.children) {
                    this.editTableColumnRecursion(tableColumn.children, editTableColumn)
                }
            }
        },
        typeFormatter(row) {
            if (row.type === 'input') {
                return '输入框'
            } else if (row.type === 'select') {
                return '下拉选择'
            } else if (row.type === 'datePicker') {
                return '日期选择'
            } else if (row.type === 'cascader') {
                return '级联选择'
            } else if (row.type === 'custom') {
                return '自定义'
            }
        },
        showSearchAddDialog() {
            this.addSearchVisible = true
            if (this.$refs.addSearchForm) {
                this.$refs.addSearchForm.resetFields()
            }
            this.addSearchForm.id = Math.random().toString(36).slice(-6)
        },
        addSearchSubmit() {
            this.$refs.addSearchForm.validate(valid => {
                if (valid) {
                    let addSearchForm = JSON.parse(JSON.stringify(this.addSearchForm))
                    this.form.options.searchColumn.push(addSearchForm)
                    this.addSearchVisible = false
                }
            })
        },
        showSearchEditDialog(row) {
            this.editSearchForm = Object.assign({}, row)
            this.editSearchVisible = true
            if (this.$refs.editSearchForm) {
                this.$refs.editSearchForm.resetFields()
            }
        },
        editSearchSubmit() {
            this.$refs.editSearchForm.validate(valid => {
                if (valid) {
                    let editSearchForm = JSON.parse(JSON.stringify(this.editSearchForm))
                    let searchColumn = this.form.options.searchColumn
                    for (let i = 0; i < searchColumn.length; i++) {
                        if (searchColumn[i].id === editSearchForm.id) {
                            this.form.options.searchColumn.splice(i, 1, editSearchForm)
                            this.editSearchVisible = false
                            return
                        }
                    }
                }
            })
        },
        searchDelSubmit(index) {
            this.form.options.searchColumn.splice(index, 1)
        },
        tableHeaderFormatterChange(value) {
            if (this.addTableColumnVisible) {
                if (value) {
                    this.$axios.get('dicDetail/queryDisplayNoTree?classifyId=' + value).then(res => {
                        if (res.data.code == 200) {
                            this.addTableColumnForm.options = JSON.stringify(res.data.data)
                        }
                    })
                } else {
                    this.addTableColumnForm.options = ''
                }
            } else {
                if (value) {
                    this.$axios.get('dicDetail/queryDisplayNoTree?classifyId=' + value).then(res => {
                        if (res.data.code == 200) {
                            this.editTableColumnForm.options = JSON.stringify(res.data.data)
                        }
                    })
                } else {
                    this.editTableColumnForm.options = ''
                }
            }
        },
        sourceChange(value) {
            this.$axios.get('dicDetail/queryDisplay?classifyId=' + value).then(res => {
                if (res.data.code == 200) {
                    if (this.addSearchVisible) {
                        this.addSearchForm.options = res.data.data
                    } else {
                        this.editSearchForm.options = res.data.data
                    }
                }
            })
        },
        querySearch(queryString, cb) {
            var fieldOptions = this.fieldOptions
            var results = queryString ? fieldOptions.filter(this.createFilter(queryString)) : fieldOptions
            cb(results)
        },
        createFilter(queryString) {
            return item => {
                return item.value.indexOf(queryString) > -1
            }
        },
        handleSelect(item) {
            if (this.addTableColumnVisible) {
                this.addTableColumnForm.prop = item.name
                this.addTableColumnForm.label = item.remark
                this.$nextTick(() => {
                    this.$refs['addTableColumnForm'].clearValidate()
                })
            } else if (this.editTableColumnVisible) {
                this.editTableColumnForm.prop = item.name
                this.editTableColumnForm.label = item.remark
                this.$nextTick(() => {
                    this.$refs['editTableColumnForm'].clearValidate()
                })
            } else if (this.addSearchVisible) {
                this.addSearchForm.field = item.name
                this.addSearchForm.desc = item.remark
                if (this.addSearchForm.type === 'input') {
                    this.addSearchForm.placeholder = '请输入' + item.remark
                } else if (
                    this.addSearchForm.type === 'select' ||
                    this.addSearchForm.type === 'cascader' ||
                    this.addSearchForm.type === 'datePicker'
                ) {
                    this.addSearchForm.placeholder = '请选择' + item.remark
                }
                this.$nextTick(() => {
                    this.$refs['addSearchForm'].clearValidate()
                })
            } else if (this.editSearchVisible) {
                this.editSearchForm.field = item.name
                this.editSearchForm.desc = item.remark
                if (this.editSearchForm.type === 'input') {
                    this.editSearchForm.placeholder = '请输入' + item.remark
                } else if (
                    this.editSearchForm.type === 'select' ||
                    this.editSearchForm.type === 'cascader' ||
                    this.editSearchForm.type === 'datePicker'
                ) {
                    this.editSearchForm.placeholder = '请选择' + item.remark
                }
                this.$nextTick(() => {
                    this.$refs['editSearchForm'].clearValidate()
                })
            }
        },
        dataSourceChange() {
            this.$nextTick(() => {
                let label = this.$refs.dataSourceRef.selected.label
                this.form.mark = label.substring(label.lastIndexOf('(') + 1, label.length - 1)
            })
        },
        handleLocking(row, value) {
            row.locking = value
        }
    }
}
</script>
<style scoped>
.el-autocomplete {
    width: 100%;
}
.el-steps--simple {
    background-color: #fff;
}
.config {
    width: 320px;
    background-color: #fff;
}
.container {
    background-color: #f7f8fa;
    height: 100%;
    overflow: hidden;
}
.header {
    width: 100%;
    height: 66px;
    font-size: 14px;
    background-color: #fff;
    display: flex;
    align-items: center;
}
.header-left {
    display: -webkit-box;
    display: flex;
    align-items: center;
    flex: 1;
}
.header-center {
    flex: 3;
}
.header-back {
    display: inline-block;
    width: 60px;
    height: 66px;
    font-size: 22px;
    text-align: center;
    cursor: pointer;
    line-height: 66px;
}
.header-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    text-align: right;
    margin-right: 15px;
}
.step-one {
    display: flex;
    justify-content: center;
}
.step-two {
    display: flex;
    justify-content: center;
}
</style>
