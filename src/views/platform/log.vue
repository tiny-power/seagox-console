<template>
    <div>
        <div class="searchView">
            <el-form label-width="60px" :inline="true">
                <el-form-item label="操作人">
                    <el-input v-model="searchForm.account" clearable placeholder="请输入操作人"></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="searchForm.name" clearable placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="searchForm.uri" clearable placeholder="请输入地址"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                        <el-option label="成功" :value="1"> </el-option>
                        <el-option label="失败" :value="2"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-tabs v-model="activeName" style="margin-left: 15px; margin-top: -10px">
            <el-tab-pane label="登录日志" name="login">
                <div style="margin-top: 10px; margin-right: 10px">
                    <!--列表-->
                    <el-table :data="loginData" border highlight-current-row :max-height="clientHeight - 290">
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column
                            prop="createTime"
                            label="操作时间"
                            align="center"
                            width="150"
                        ></el-table-column>
                        <el-table-column prop="ip" label="访问地址" align="center" width="150"></el-table-column>
                        <el-table-column prop="uri" label="地址" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" label="名称" align="center"></el-table-column>
                        <el-table-column
                            prop="ua"
                            label="浏览器"
                            align="center"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column prop="status" label="状态" align="center" width="80">
                            <template slot-scope="scope">
                                <el-tag type="success" v-if="scope.row.status === 1">成功</el-tag>
                                <el-tag type="danger" v-else>失败</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="55">
                            <template slot-scope="scope">
                                <el-button
                                    type="text"
                                    icon="el-icon-view"
                                    size="small"
                                    @click="showDetailDialog(scope.row)"
                                ></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <div class="pagination">
                        <el-pagination
                            background
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next"
                            :current-page.sync="loginPageNo"
                            :total="loginTotal"
                        >
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="操作日记" name="operate">
                <div style="margin-top: 10px; margin-right: 10px">
                    <!--列表-->
                    <el-table :data="operateData" border highlight-current-row :max-height="clientHeight - 290">
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column prop="account" label="操作人" align="center" width="120"></el-table-column>
                        <el-table-column
                            prop="createTime"
                            label="操作时间"
                            align="center"
                            width="150"
                        ></el-table-column>
                        <el-table-column prop="ip" label="访问地址" align="center" width="150"></el-table-column>
                        <el-table-column prop="uri" label="地址" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" label="名称" align="center"></el-table-column>
                        <el-table-column
                            prop="ua"
                            label="浏览器"
                            align="center"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column prop="status" label="状态" align="center" width="80">
                            <template slot-scope="scope">
                                <el-tag type="success" v-if="scope.row.status === 1">成功</el-tag>
                                <el-tag type="danger" v-else>失败</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="55">
                            <template slot-scope="scope">
                                <el-button
                                    type="text"
                                    icon="el-icon-view"
                                    size="small"
                                    @click="showDetailDialog(scope.row)"
                                ></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <div class="pagination">
                        <el-pagination
                            background
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next"
                            :current-page.sync="operatePageNo"
                            :total="operateTotal"
                        >
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!--详情界面-->
        <el-dialog title="详情" width="750px" :visible.sync="formVisible" :close-on-click-modal="false">
            <el-form :model="form" label-width="80px" ref="form">
                <el-form-item label="调用方法">
                    <el-input v-model="form.method" disabled></el-input>
                </el-form-item>
                <el-form-item label="请求参数">
                    <json-viewer :value="form.params" copyable boxed></json-viewer>
                </el-form-item>
                <el-form-item label="操作结果">
                    <json-viewer :value="form.result" copyable boxed></json-viewer>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import JsonViewer from 'vue-json-viewer'
export default {
    components: {
        JsonViewer
    },
    data() {
        return {
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            loginData: [],
            loginPageNo: 1,
            loginTotal: 0,
            operateData: [],
            operatePageNo: 1,
            operateTotal: 0,
            searchForm: {
                account: '',
                name: '',
                uri: '',
                status: ''
            },
            formVisible: false,
            form: {
                name: '',
                path: '',
                dataAuthority: ''
            },
            activeName: 'login'
        }
    },
    mounted() {
        this.queryByPage('login')
        this.queryByPage('operate')
    },
    methods: {
        queryByPage(type) {
            const params = {
                type: type,
                pageNo: type === 'login' ? this.loginPageNo : this.operatePageNo,
                account: this.searchForm.account,
                name: this.searchForm.name,
                uri: this.searchForm.uri,
                status: this.searchForm.status
            }
            this.$axios.get('log/queryByPage', { params }).then(res => {
                if (res.data.code == 200) {
                    if (type === 'login') {
                        this.loginData = res.data.data.list
                        this.loginTotal = res.data.data.total
                    } else if (type === 'operate') {
                        this.operateData = res.data.data.list
                        this.operateTotal = res.data.data.total
                    }
                }
            })
        },
        // 翻页
        handleCurrentChange(val) {
            this.queryByPage(this.activeName)
        },
        //显示详情界面
        showDetailDialog(row) {
            this.form = Object.assign({}, row)
            this.form.params = JSON.parse(this.form.params)
            this.form.result = JSON.parse(this.form.result)
            this.formVisible = true
            if (this.$refs.form) {
                this.$refs.form.resetFields()
            }
        },
        handleSearch() {
            if (this.activeName === 'login') {
                this.loginPageNo = 1
            } else if (this.activeName === 'operate') {
                this.operatePageNo = 1
            }
            this.queryByPage(this.activeName)
        }
    }
}
</script>
