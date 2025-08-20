<template>
    <div
        :style="{
            width: '100%',
            height: clientHeight + 'px',
            background: 'url(' + backgroundImage + ') no-repeat',
            'background-size': '100% 100%'
        }"
    >
        <div class="form">
            <div class="title">欢 迎 登 录</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                <el-form-item prop="account">
                    <el-input v-model="ruleForm.account" placeholder="请输入账号" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        v-model="ruleForm.password"
                        placeholder="请输入密码"
                        prefix-icon="el-icon-lock"
                        @keyup.enter.native="onEnter"
                        show-password
                    ></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm"> 登 录 </el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            clientHeight: 0,
            ruleForm: {
                account: '',
                password: ''
            },
            rules: {
                account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        }
    },
    beforeMount() {
        this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        this.backgroundImage = require('@/' + window.platform.backgroundImage)
    },
    created() {
        localStorage.clear()
        localStorage.setItem('title', window.platform.title)
    },
    methods: {
        onEnter(event) {
            if (event.keyCode == 13) {
                this.submitForm()
            }
        },
        submitForm() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.ruleForm)
                    this.$axios.post('auth/console', params).then(res => {
                        if (res.data.code == 200) {
                            localStorage.setItem('alias', res.data.data.alias)
                            localStorage.setItem('logo', res.data.data.logo)
                            localStorage.setItem('tenantId', res.data.data.companyId)
                            localStorage.setItem('Authorization', res.data.data.accessToken)

                            localStorage.setItem('avatar', res.data.data.avatar)
                            localStorage.setItem('userId', res.data.data.userId)
                            localStorage.setItem('account', res.data.data.account)
                            localStorage.setItem('name', res.data.data.name)
                            localStorage.setItem('tenantList', JSON.stringify(res.data.data.company))

                            this.$router.replace({
                                path: this.$route.query.redirect || '/readme'
                            })

                            this.$store.commit('handleLogin')
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
::v-deep .el-form-item__content {
    line-height: 54px;
}
::v-deep .el-input__inner {
    height: 44px;
}
.form {
    width: 280px;
    height: 360px;
    position: absolute;
    margin: auto;
    top: 0;
    left: 50%;
    right: 0;
    bottom: 0;
    border-radius: 8px;
    background-color: #fff;
    padding: 0px 25px 0px 25px;
}
.title {
    font-weight: 700;
    line-height: 60px;
    color: #364a63;
    text-align: center;
    margin-top: 30px;
    margin-bottom: 10px;
    font-size: 26px;
}
.login-btn button {
    width: 100%;
    height: 44px;
}
</style>
