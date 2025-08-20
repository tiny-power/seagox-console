<template>
    <div class="formContainer" :style="{ height: clientHeight - 66 + 'px' }">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="form">
            <el-form-item label="组件类型">
                <el-select v-model="form.type" filterable>
                    <el-option label="文本" value="word"></el-option>
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
                    <el-option label="单位组件" value="company"></el-option>
                    <el-option label="部门组件" value="department"></el-option>
                    <el-option label="成员组件" value="member"></el-option>
                    <el-option label="业务组件" value="business"></el-option>
                    <el-option label="自定义组件" value="custom"></el-option>
                </el-select>
            </el-form-item>
            <div v-if="form.type === 'custom'">
                <el-form-item label="组件名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入组件名称"></el-input>
                </el-form-item>
            </div>
            <el-form-item label="绑定字段" prop="field" v-if="form.type != 'word' && form.type != 'custom'">
                <el-select
                    v-model="form.field"
                    filterable
                    placeholder="请选择绑定字段"
                    ref="fieldRef"
                    @change="fieldChange"
                >
                    <el-option v-for="item in fieldOptions" :key="item.name" :label="item.remark" :value="item.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="占位提示"
                prop="placeholder"
                v-if="form.type != 'word' && form.type != 'custom' && form.type != 'switch'"
            >
                <el-input v-model="form.placeholder"></el-input>
            </el-form-item>
            <el-form-item label="输入类型" v-if="form.type === 'text'">
                <el-select v-model="form.inputType">
                    <el-option label="单行输入" value="text"></el-option>
                    <el-option label="多行输入" value="textarea"></el-option>
                </el-select>
            </el-form-item>
            <div v-if="form.type === 'text'">
                <el-form-item label="默认值">
                    <el-input v-model="form.defaultValue" placeholder="请输入默认值"></el-input>
                </el-form-item>
                <el-form-item label="最多输入">
                    <el-input placeholder="请输入字符长度" v-model="form.maxlength" type="number">
                        <template slot="append">个字符</template>
                    </el-input>
                </el-form-item>
            </div>
            <div v-if="form.type === 'number'">
                <el-form-item label="默认值">
                    <el-input-number
                        :controls="false"
                        :precision="0"
                        v-model="form.defaultValue"
                        placeholder="请输入默认值"
                    >
                    </el-input-number>
                </el-form-item>
            </div>
            <!-- 流水号 -->
            <div v-if="form.type === 'bill'">
                <el-form-item label="编号配置" prop="serial">
                    <el-select v-model="form.serial" placeholder="请选择编号">
                        <el-option v-for="item in serialOptions" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <!-- datePicker -->
            <div v-if="form.type === 'datePicker'">
                <el-form-item label="日期类型" prop="dateType">
                    <el-select v-model="form.dateType">
                        <el-option label="年" value="year|yyyy"></el-option>
                        <el-option label="年-月" value="month|yyyy-MM"></el-option>
                        <el-option label="年-月-日" value="date|yyyy-MM-dd"></el-option>
                        <el-option label="年-月-日 时:分:秒(24小时制)" value="datetime|yyyy-MM-dd HH:mm:ss"></el-option>
                        <el-option label="年-月-日 时:分:秒(12小时制)" value="datetime|yyyy-MM-dd hh:mm:ss"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="默认当前">
                    <el-switch v-model="form.isCurrent"></el-switch>
                </el-form-item>
                <el-form-item label="默认值" v-if="!form.isCurrent">
                    <el-date-picker
                        v-model="form.defaultValue"
                        :type="form.dateType.split('|')[0]"
                        :value-format="form.dateType.split('|')[1]"
                        placeholder="请选择默认值"
                        clearable
                        align="center"
                    >
                    </el-date-picker>
                </el-form-item>
            </div>
            <!-- 开关 -->
            <div v-if="form.type === 'switch'">
                <el-form-item label="打开时值">
                    <el-input-number v-model="form.activeValue"></el-input-number>
                </el-form-item>
                <el-form-item label="关闭时值">
                    <el-input-number v-model="form.inactiveValue"></el-input-number>
                </el-form-item>
            </div>
            <!-- 图片上传 -->
            <div v-if="form.type === 'picture' || form.type === 'upload'">
                <el-form-item label="最小值">
                    <el-input-number
                        v-model="form.minValue"
                        :min="0"
                        :precision="0"
                        :controls="false"
                        placeholder="请输入最小值(单位:MB)"
                    >
                    </el-input-number>
                </el-form-item>
                <el-form-item label="最大值">
                    <el-input-number
                        v-model="form.maxValue"
                        :min="0"
                        :precision="0"
                        :controls="false"
                        placeholder="请输入最大值(单位:MB)"
                    >
                    </el-input-number>
                </el-form-item>
            </div>
            <el-form-item label="限制类型" v-if="form.type === 'picture' || form.type === 'upload'">
                <el-select v-model="form.accept" filterable multiple placeholder="请选择限制类型" collapse-tags>
                    <el-option v-for="item in acceptOptions" :key="item" :label="item" :value="item"> </el-option>
                </el-select>
            </el-form-item>
            <!-- 多选组件 -->
            <div
                v-if="
                    form.type === 'radio' ||
                    form.type === 'checkbox' ||
                    form.type === 'select' ||
                    form.type === 'cascader'
                "
            >
                <el-form-item label="数据来源" prop="source">
                    <el-select v-model="form.source" filterable placeholder="请选择数据来源" @change="dicChange">
                        <el-option
                            v-for="item in dicClassifyOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="默认值" v-if="form.type === 'radio'">
                    <el-select v-model="form.defaultValue" filterable placeholder="请选择默认值" clearable>
                        <el-option
                            v-for="item in dicDetailOptions"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="默认值" v-if="form.type === 'checkbox'">
                    <el-select v-model="form.defaultValue" filterable placeholder="请选择默认值" clearable multiple>
                        <el-option
                            v-for="item in dicDetailOptions"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="默认值" v-if="form.type === 'select'">
                    <el-select
                        v-model="form.defaultValue"
                        filterable
                        placeholder="请选择默认值"
                        clearable
                        :multiple="form.multiple"
                    >
                        <el-option
                            v-for="item in dicDetailOptions"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <!-- 部门组件 -->
            <div v-if="form.type === 'department'">
                <el-form-item label="默认值">
                    <el-select v-model="form.defaultValue" placeholder="请选择默认值" clearable>
                        <el-option label="当前用户数据" value="current"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <!-- 成员组件 -->
            <div v-if="form.type === 'member'">
                <el-form-item label="默认值">
                    <el-select v-model="form.defaultValue" placeholder="请选择默认值" clearable>
                        <el-option label="当前用户数据" value="current"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <!-- 单位组件 -->
            <div v-if="form.type === 'company'">
                <el-form-item label="默认值">
                    <el-select v-model="form.defaultValue" placeholder="请选择默认值" clearable>
                        <el-option label="当前用户数据" value="current"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <!-- 业务组件 -->
            <div v-if="form.type === 'business'">
                <el-form-item label="数据来源" prop="source">
                    <el-select
                        v-model="form.source"
                        filterable
                        placeholder="请选择数据来源"
                        @change="businessChange($event, true)"
                    >
                        <el-option v-for="item in businessOptions" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示字段" prop="showField">
                    <el-select v-model="form.showField" placeholder="请选择显示字段">
                        <el-option
                            v-for="(item, index) in showFieldOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.prop"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <!-- 按钮开关 -->
            <el-form-item label="是否必填" v-if="form.type != 'word' && form.type != 'custom' && form.type != 'switch'">
                <el-switch v-model="form.required"></el-switch>
            </el-form-item>
            <el-form-item label="是否禁用" v-if="form.type != 'word' && form.type != 'custom'">
                <el-switch v-model="form.disabled"></el-switch>
            </el-form-item>
            <el-form-item label="千分位分隔" v-if="form.type === 'number'" label-width="85px">
                <el-switch v-model="form.thousandsSeparators"></el-switch>
            </el-form-item>
            <el-form-item label="小数点位数" v-if="form.type === 'number'" label-width="85px">
                <el-input-number v-model="form.precision" step-strictly :min="0" :max="20"></el-input-number>
            </el-form-item>
            <el-form-item
                label="是否多选"
                v-if="
                    form.type === 'select' ||
                    form.type === 'picture' ||
                    form.type === 'department' ||
                    form.type === 'member' ||
                    form.type === 'company'
                "
            >
                <el-switch v-model="form.multiple"></el-switch>
            </el-form-item>
            <el-form-item
                v-if="form.type != 'word'"
                label-width="0px"
                style="display: flex; align-items: center; justify-content: center"
            >
                <el-button type="danger" @click="deleteConfigForm" style="width: 136px">删除</el-button>
                <el-button type="primary" @click="submitConfigForm" style="width: 136px">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props: ['currentModule', 'dataSource'],
    watch: {
        currentModule: {
            handler(newVal) {
                this.form = newVal
                if (this.form.type === 'text') {
                    if (!this.form.inputType) {
                        this.form.inputType = 'text'
                    }
                }
                if (this.form.type === 'number') {
                    if (!this.form.precision) {
                        this.form.precision = 0
                    }
                }
                if (
                    this.form.type === 'radio' ||
                    this.form.type === 'checkbox' ||
                    this.form.type === 'select' ||
                    this.form.type === 'cascader'
                ) {
                    this.dicClassifyOptions = this.$parent.formatterOptions
                    if (newVal.source) {
                        this.queryDicDetail(newVal.source)
                    }
                }

                if (this.form.type === 'business') {
                    this.businessOptions = this.$parent.businessOptions
                    if (newVal.source) {
                        this.businessChange(this.form.source, false)
                    }
                }

                if (this.form.type === 'datePicker' && !this.form.dateType) {
                    this.$set(this.form, 'dateType', 'date|yyyy-MM-dd')
                }

                if (this.form.type === 'switch') {
                    if (!this.form.inactiveValue) {
                        this.form.inactiveValue = 0
                    }
                    if (!this.form.activeValue) {
                        this.form.activeValue = 1
                    }
                }
            },
            immediate: true,
            deep: true
        },
        dataSource: {
            handler(newVal) {
                if (newVal) {
                    this.queryBusinessField(newVal)
                }
            },
            immediate: true,
            deep: true
        }
    },
    data() {
        return {
            clientHeight: 0,
            form: {},
            rules: {
                field: [{ required: true, message: '请选择绑定字段', trigger: 'change' }],
                dateType: [{ required: true, message: '请选择日期类型', trigger: 'change' }],
                placeholder: [
                    { required: true, message: '请输入占位提示', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                showField: [{ required: true, message: '请选择显示字段', trigger: 'change' }],
                source: [{ required: true, message: '请选择数据来源', trigger: 'change' }],
                serial: [{ required: true, message: '请选择编号', trigger: 'change' }],
                nodeName: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
                name: [{ required: true, message: '请输入组件名称', trigger: 'blur' }]
            },
            fieldOptions: [],
            dicClassifyOptions: [],
            dicDetailOptions: [],
            showFieldOptions: [],
            acceptOptions: [
                'txt',
                'doc',
                'docx',
                'xls',
                'xlsx',
                'ppt',
                'pptx',
                'pdf',
                'ofd',
                'bmp',
                'jpg',
                'png',
                'tif',
                'gif'
            ],
            businessOptions: [],
            serialOptions: []
        }
    },
    beforeMount() {
        this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
    },
    mounted() {
        this.querySerial()
    },
    methods: {
        async querySerial() {
            let res = await this.$axios.get('serial/queryAll')
            if (res.data.code === 200) {
                this.serialOptions = res.data.data
            }
        },
        async queryDicDetail(classifyId) {
            let res = await this.$axios.get('dicDetail/queryDisplay?classifyId=' + classifyId)
            if (res.data.code === 200) {
                this.dicDetailOptions = res.data.data
            }
        },
        async queryBusinessField(tableId) {
            let res = await this.$axios.get('businessField/queryByTableId/' + tableId)
            if (res.data.code === 200) {
                this.fieldOptions = res.data.data
            }
        },
        async businessChange(value, clearable) {
            if (clearable) {
                this.form.showField = ''
            }
            let res = await this.$axios.get('form/queryById/' + value)
            if (res.data.code === 200) {
                let options = JSON.parse(res.data.data.options)
                this.showFieldOptions = options.tableColumn
            }
        },
        dicChange(value) {
            this.dicDetailOptions = []
            this.queryDicDetail(value)
        },
        submitConfigForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    let exclude = ['word', 'custom']
                    if (!exclude.includes(this.form.type)) {
                        this.form.label = this.$refs.fieldRef.selected.label
                    }
                    this.$emit('submitConfigForm', this.form)
                }
            })
        },
        deleteConfigForm() {
            this.$emit('deleteConfigForm')
        },
        assignmentSubmit(data) {
            this.form.assignment = data
            this.$emit('submitConfigForm', this.form)
        },
        fieldChange() {
            this.$nextTick(() => {
                if (
                    this.form.type === 'text' ||
                    this.form.type === 'number' ||
                    this.form.type === 'editor' ||
                    this.form.type === 'bill'
                ) {
                    this.$set(this.form, 'placeholder', '请输入' + this.$refs.fieldRef.selected.label)
                } else if (
                    this.form.type === 'radio' ||
                    this.form.type === 'checkbox' ||
                    this.form.type === 'select' ||
                    this.form.type === 'cascader' ||
                    this.form.type === 'datePicker' ||
                    this.form.type === 'department' ||
                    this.form.type === 'member' ||
                    this.form.type === 'company' ||
                    this.form.type === 'business'
                ) {
                    this.$set(this.form, 'placeholder', '请选择' + this.$refs.fieldRef.selected.label)
                } else if (this.form.type === 'picture' || this.form.type === 'upload') {
                    this.$set(this.form, 'placeholder', '请上传' + this.$refs.fieldRef.selected.label)
                }
            })
        }
    }
}
</script>

<style scoped>
::v-deep .is-without-controls .el-input .el-input__inner {
    text-align: left;
}
.formContainer {
    border-left: 1px solid #e2e4e8;
    width: 320px;
    background-color: #fff;
    overflow: auto;
}
.form {
    padding: 20px 15px 15px 15px;
}
::v-deep .el-tabs__nav {
    width: 100%;
}
::v-deep .el-tabs__item {
    width: 50%;
    text-align: center;
}
::v-deep .el-row {
    margin-bottom: 10px;
}
::v-deep .el-date-editor.el-input {
    width: 100%;
}
</style>
