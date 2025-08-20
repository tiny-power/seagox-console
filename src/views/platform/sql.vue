<template>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <div class="header-back" @click="toReturn"><i class="el-icon-arrow-left"></i></div>
                <div class="header-title">{{ title }}</div>
            </div>
            <div class="header-right">
                <el-button class="button-publish" @click="handleFormat">格式化</el-button>
                <el-button class="button-publish" @click="saveSubmit">保 存</el-button>
            </div>
        </div>
        <div class="main" :style="{ width: '100%', height: clientHeight - 60 + 'px' }">
            <codemirrorXml
                id="sql"
                ref="sql"
                v-model="sql"
                placeholder="请输入SQL"
                :style="{ width: '100%', height: clientHeight - 65 + 'px' }"
            />
        </div>
    </div>
</template>

<script>
import codemirrorXml from '@/views/components/codemirror/xml'
import xmlFormat from 'xml-formatter'
export default {
    components: {
        codemirrorXml
    },
    data() {
        return {
            clientHeight: 0,
            form: {},
            sql: ''
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
        this.queryById()
    },
    methods: {
        async queryById() {
            let res = await this.$axios.get('form/queryById/' + this.$route.query.id)
            if (res.data.code == 200) {
                this.form = res.data.data
                this.sql = JSON.parse(res.data.data.options).sql
                this.$nextTick(() => {
                    this.$refs.sql.editor.setValue(this.sql || '')
                })
            }
        },
        toReturn() {
            this.$router.go(-1)
        },
        saveSubmit() {
            if (!this.sql) {
                this.$message.error('SQL配置不能为空')
                return
            }
            let options = JSON.parse(this.form.options)
            options.sql = this.sql
            var params = {
                id: this.form.id,
                options: JSON.stringify(options)
            }
            this.$axios.post('form/update', params).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('保存成功')
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        handleFormat() {
            this.$refs.sql.editor.setValue(xmlFormat(this.sql) || '')
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
.container {
    background-color: #f9fafc;
}
.main {
    display: flex;
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

.header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    text-align: right;
}

.button-publish {
    min-width: 80px;
    margin-left: 4px;
    margin-right: 15px;
    color: #3a6cfa;
    border-color: #fff;
    height: 32px;
    line-height: 32px;
    padding: 0px 20px;
}
</style>
