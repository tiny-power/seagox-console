<template>
    <el-dialog
        title="人员选择"
        width="750px"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        append-to-body
    >
        <el-row>
            <el-col :span="10">
                <el-row style="height: 245px; border: 1px solid #ccc; border-radius: 6px; padding-top: 10px">
                    <el-tree
                        ref="tree"
                        :filter-node-method="filterNode"
                        :data="deptTreeData"
                        default-expand-all
                        @node-click="handleNodeClick"
                        :expand-on-click-node="false"
                        style="height: 100%; overflow: auto"
                    >
                        <div slot-scope="{ node, data }">
                            <i
                                class="el-icon-folder-opened"
                                style="margin-right: 2px"
                                v-if="!node.isLeaf && node.expanded"
                            ></i>
                            <i
                                class="el-icon-folder"
                                style="margin-right: 2px"
                                v-if="!node.isLeaf && !node.expanded"
                            ></i>
                            <i class="el-icon-folder" style="margin-right: 2px" v-if="node.isLeaf && data.alias"></i>
                            <i
                                class="el-icon-document"
                                style="margin-right: 2px"
                                v-if="node.isLeaf && data.companyName"
                            ></i>
                            {{ data.label }}
                        </div>
                    </el-tree>
                </el-row>
                <el-row style="height: 245px; border: 1px solid #ccc; border-radius: 6px; margin-top: 8px">
                    <el-table
                        :data="unCheckedGridData"
                        height="245"
                        ref="unCheckedGrid"
                        @selection-change="handleUnCheckSelectionChange"
                    >
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column property="name" label="全选"></el-table-column>
                    </el-table>
                    <el-button style="margin-top: 10px" size="small" @click="reverseElectionClick">反选</el-button>
                </el-row>
            </el-col>
            <el-col :span="4" style="height: 400px; text-align: center; line-height: 200px">
                <el-row>
                    <el-button type="primary" icon="el-icon-right" circle @click="handleRight"></el-button>
                    <br />
                    <el-button type="primary" icon="el-icon-back" circle @click="handleLeft"></el-button>
                </el-row>
            </el-col>
            <el-col :span="10" style="height: 500px; border: 1px solid #ccc; border-radius: 6px">
                <el-table
                    :data="checkedGridData"
                    height="500"
                    highlight-current-row
                    ref="checkedGrid"
                    @selection-change="handleCheckSelectionChange"
                >
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column property="name" label="全选"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleDetermine">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: false,
            deptTreeData: [],
            unCheckedGridData: [],
            checkedGridData: [],
            unCheckedMultipleSelection: [],
            checkedMultipleSelection: [],
            companyId: '',
            tempDeptTreeData: []
        }
    },
    created() {
        this.queryDepartment()
    },
    methods: {
        //反选
        reverseElectionClick() {
            this.unCheckedGridData.forEach(item => {
                let flg = false
                this.unCheckedMultipleSelection.forEach(el => {
                    // 判断在选择的数据中是否存在tableData里的数据,如果存在,证明已经是选中状态,让其取消选择
                    if (item.id == el.id) {
                        flg = true
                    }
                })
                // 取反, 如果flg为true,让当前行(item)取消选择,flg为false,让当前行(item)选中
                if (flg) {
                    this.$refs.unCheckedGrid.toggleRowSelection(item, false)
                } else {
                    this.$refs.unCheckedGrid.toggleRowSelection(item, true)
                }
            })
        },
        filterNode(value, data) {
            if (!value) return true
            return data.label.indexOf(value) !== -1
        },
        companyOptionChange() {
            if (this.companyId) {
                this.$axios.get('department/queryByCompanyId?searchCompanyId=' + this.companyId).then(res => {
                    if (res.data.code == 200) {
                        this.deptTreeData = res.data.data
                    }
                })
            } else {
                this.deptTreeData = this.tempDeptTreeData
            }
        },
        async queryDepartment() {
            let params = {
                isAll: true
            }
            let res = await this.$axios.get('company/queryAllAndDept', { params })
            if (res.data.code == 200) {
                this.deptTreeData = res.data.data
                this.tempDeptTreeData = res.data.data
            }
        },
        async queryByDeptId(id) {
            let res = await this.$axios.get('user/queryByDeptId?deptId=' + id)
            if (res.data.code == 200) {
                this.unCheckedGridData = res.data.data
            }
        },
        async queryByCompanyId(id) {
            let res = await this.$axios.get('user/queryUserByCompanyId?companyId=' + id)
            if (res.data.code == 200) {
                this.unCheckedGridData = res.data.data
            }
        },
        showDialog(value) {
            this.unCheckedGridData = []
            this.dialogVisible = true
            this.$nextTick(() => {
                this.checkedGridData = JSON.parse(JSON.stringify(value))
            })
        },
        handleNodeClick(data, node) {
            this.unCheckedGridData = []
            if (data.type === 'company') {
                //公司
                this.queryByCompanyCode(data.id)
            } else if (data.type === 'department') {
                //部门
                this.queryByDeptId(data.id)
            }
        },
        handleUnCheckSelectionChange(val) {
            this.unCheckedMultipleSelection = val
        },
        handleCheckSelectionChange(val) {
            this.checkedMultipleSelection = val
        },
        handleLeft() {
            for (var i = 0; i < this.checkedMultipleSelection.length; i++) {
                for (let j = 0; j < this.checkedGridData.length; j++) {
                    if (this.checkedMultipleSelection[i].id == this.checkedGridData[j].id) {
                        this.checkedGridData.splice(j, 1)
                        break
                    }
                }
            }
        },
        handleRight() {
            for (let i = 0; i < this.unCheckedMultipleSelection.length; i++) {
                let node = this.unCheckedMultipleSelection[i]
                let flag = true
                for (let j = 0; j < this.checkedGridData.length; j++) {
                    if (node.id == this.checkedGridData[j].id) {
                        flag = false
                        break
                    }
                }
                if (flag) {
                    this.checkedGridData.push(node)
                }
            }
        },
        handleDetermine() {
            let result = []
            for (let j = 0; j < this.checkedGridData.length; j++) {
                result.push({
                    id: String(this.checkedGridData[j].id),
                    name: this.checkedGridData[j].name
                })
            }
            this.$emit('confirm', result)
            this.dialogVisible = false
        }
    }
}
</script>
