<template>
    <div class="container">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="起始行" prop="startLine">
                        <el-input-number v-model="form.startLine" :controls="false" :precision="0" :min="1" :max="9999">
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <div style="text-align: left">
                        <el-button
                            style="margin-bottom: 10px"
                            type="text"
                            size="small"
                            icon="el-icon-plus"
                            @click="handleAddDetail"
                            >新增</el-button
                        >
                    </div>
                    <el-table
                        :data="form.rules"
                        :row-key="getRowKey"
                        border
                        highlight-current-row
                        :max-height="clientHeight - 305"
                    >
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column label="名称" align="center">
                            <template slot-scope="scope">
                                <el-autocomplete
                                    v-model="scope.row.label"
                                    size="small"
                                    placeholder="请输入名称"
                                    :fetch-suggestions="querySearch"
                                    @select="handleSelect($event, scope.$index)"
                                ></el-autocomplete>
                            </template>
                        </el-table-column>
                        <el-table-column label="字段名" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.prop" size="small" placeholder="请输入字段名"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="对应列" align="center" width="150">
                            <template slot-scope="scope">
                                <div>{{ letterOptions[scope.$index] }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="规则" align="center" width="60">
                            <template slot-scope="scope">
                                <i
                                    class="el-icon-document"
                                    style="font-size: 16px"
                                    @click="showRuleDialog(scope.$index)"
                                ></i>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="60">
                            <template slot-scope="scope">
                                <i
                                    class="el-icon-remove-outline"
                                    style="color: #f56c6c; font-size: 16px"
                                    @click="handleDelDetail(scope.$index)"
                                ></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="24">
                    <el-form-item style="margin-top: 15px; float: right">
                        <el-button type="primary" @click="handleSubmit">提 交</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--规则配置-->
        <el-dialog title="规则配置" width="600px" :visible.sync="ruleVisible" :close-on-click-modal="false">
            <div style="margin-bottom: 15px">
                <annotate
                    v-model="rule"
                    :height="200"
                    placeholder="按@键进行代码提示，每行1个选项，请用回车分割"
                    v-if="ruleVisible"
                ></annotate>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="ruleVisible = false">取消</el-button>
                <el-button type="primary" @click="ruleSubmit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Schema from 'async-validator'
import Sortable from 'sortablejs'
import annotate from '@/views/components/codemirror/annotate'
export default {
    components: {
        annotate
    },
    data() {
        return {
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            fieldOptions: [],
            letterOptions: [
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'O',
                'P',
                'Q',
                'R',
                'S',
                'T',
                'U',
                'V',
                'W',
                'X',
                'Y',
                'Z',
                'AA',
                'AB',
                'AC',
                'AD',
                'AE',
                'AF',
                'AG',
                'AH',
                'AI',
                'AJ',
                'AK',
                'AL',
                'AM',
                'AN',
                'AO',
                'AP',
                'AQ',
                'AR',
                'AS',
                'AT',
                'AU',
                'AV',
                'AW',
                'AX',
                'AY',
                'AZ',
                'BA',
                'BB',
                'BC',
                'BD',
                'BE',
                'BF',
                'BG',
                'BH',
                'BI',
                'BJ',
                'BK',
                'BL',
                'BM',
                'BN',
                'BO',
                'BP',
                'BQ',
                'BR',
                'BS',
                'BT',
                'BU',
                'BV',
                'BW',
                'BX',
                'BY',
                'BZ'
            ],
            form: {
                startLine: 2,
                rules: []
            },
            rules: {
                startLine: [{ required: true, message: '请输入起始行', trigger: 'blur' }]
            },
            ruleVisible: false,
            rule: '',
            currentIndex: -1
        }
    },
    created() {
        this.queryByFormId()
        this.queryFieldByTableId()
    },
    mounted() {
        const that = this
        const tbody = document.querySelector('.el-table__body-wrapper tbody')
        Sortable.create(tbody, {
            onEnd({ newIndex, oldIndex }) {
                const currRow = that.form.rules.splice(oldIndex, 1)[0]
                that.$nextTick(() => {
                    that.form.rules.splice(newIndex, 0, currRow)
                })
            }
        })
    },
    methods: {
        async queryByFormId() {
            let res = await this.$axios.get('importRule/queryByFormId/' + this.$route.query.formId, {})
            if (res.data.code === 200) {
                this.form = res.data.data
                this.form.rules = JSON.parse(this.form.rules)
            }
        },
        async queryFieldByTableId() {
            let res = await this.$axios.get('businessField/queryByTableId/' + this.$route.query.tableId)
            if (res.data.code === 200) {
                let fieldOptions = []
                for (let i = 0; i < res.data.data.length; i++) {
                    let item = res.data.data[i]
                    item.value = item.remark + '（ ' + item.name + '）'
                    fieldOptions.push(item)
                }
                this.fieldOptions = fieldOptions
            }
        },
        getRowKey(row) {
            return Math.random().toString(36).substr(2, 9)
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
        handleSelect(value, index) {
            let item = this.form.rules[index]
            item.label = value.remark
            item.prop = value.name
            this.$set(this.form.rules, index, item)
        },
        handleAddDetail() {
            this.form.rules.push({})
        },
        handleDelDetail(index) {
            this.form.rules.splice(index, 1)
        },
        showRuleDialog(index) {
            this.currentIndex = index
            this.rule = this.form.rules[index].rule
            this.ruleVisible = true
        },
        ruleSubmit() {
            let item = this.form.rules[this.currentIndex]
            item.rule = this.rule
            this.$set(this.form.rules, this.currentIndex, item)
            this.ruleVisible = false
        },
        handleSubmit() {
            let valid = true
            const descriptor = {
                label: {
                    type: 'string',
                    required: true,
                    message: '名称不能为空'
                },
                prop: {
                    type: 'string',
                    required: true,
                    message: '字段名不能为空'
                }
            }
            const validator = new Schema(descriptor)
            for (let i = 0; i < this.form.rules.length; i++) {
                if (valid) {
                    validator.validate(this.form.rules[i], (errors, fields) => {
                        if (errors) {
                            valid = false
                            this.$message.error('第' + (i + 1) + '行，' + errors[0].message)
                            return
                        }
                    })
                }
            }
            if (valid) {
                var params = {
                    id: this.form.id,
                    formId: this.form.formId,
                    startLine: this.form.startLine,
                    rules: JSON.stringify(this.form.rules)
                }
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.$axios.post('importRule/update', params).then(res => {
                            if (res.data.code === 200) {
                                this.$message.success('提交成功')
                            } else {
                                this.$message.error(res.data.message)
                            }
                        })
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
::v-deep .el-autocomplete {
    width: 100%;
}
.container {
    padding: 15px 15px 0px 15px;
}
</style>
