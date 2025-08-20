<template>
    <div>
        <div class="container">
            <div>
                <div class="content" @click="handleClick('/company')">
                    <div
                        class="content-icon"
                        :style="{ 'background-image': `url(${require('@/assets/plugin/company.png')})` }"
                    ></div>
                </div>
                <div class="title">组织架构</div>
            </div>
            <div>
                <div class="content" @click="handleClick('/businessTable')">
                    <div
                        class="content-icon"
                        :style="{ 'background-image': `url(${require('@/assets/plugin/model.png')})` }"
                    ></div>
                </div>
                <div class="title">数据建模</div>
            </div>
            <div>
                <div class="content" @click="handleClick('/form')">
                    <div
                        class="content-icon"
                        :style="{ 'background-image': `url(${require('@/assets/plugin/form.png')})` }"
                    ></div>
                </div>
                <div class="title">表单管理</div>
            </div>
            <div>
                <div class="content" @click="handleClick('/menu')">
                    <div
                        class="content-icon"
                        :style="{ 'background-image': `url(${require('@/assets/plugin/menu.png')})` }"
                    ></div>
                </div>
                <div class="title">菜单管理</div>
            </div>
            <div>
                <div class="content" @click="handleClick('/taskScheduler')">
                    <div
                        class="content-icon"
                        :style="{ 'background-image': `url(${require('@/assets/plugin/job.png')})` }"
                    ></div>
                </div>
                <div class="title">定时任务</div>
            </div>
        </div>
        <div class="container">
            <div>
                <div class="content" @click="handleClick('/gauge')">
                    <div
                        class="content-icon"
                        :style="{ 'background-image': `url(${require('@/assets/plugin/gauge.png')})` }"
                    ></div>
                </div>
                <div class="title">仪表板</div>
            </div>
            <div>
                <div class="content" @click="handleClick('/door')">
                    <div
                        class="content-icon"
                        :style="{ 'background-image': `url(${require('@/assets/plugin/door.png')})` }"
                    ></div>
                </div>
                <div class="title">门户管理</div>
            </div>
            <div>
                <div class="content" @click="handleClick('/dic')">
                    <div
                        class="content-icon"
                        :style="{ 'background-image': `url(${require('@/assets/plugin/dic.png')})` }"
                    ></div>
                </div>
                <div class="title">数据字典</div>
            </div>
            <div>
                <div class="content" @click="handleClick('/serial')">
                    <div
                        class="content-icon"
                        :style="{ 'background-image': `url(${require('@/assets/plugin/serial.png')})` }"
                    ></div>
                </div>
                <div class="title">编号设置</div>
            </div>
            <div>
                <div class="content" @click="handleClick('/log')">
                    <div
                        class="content-icon"
                        :style="{ 'background-image': `url(${require('@/assets/plugin/log.png')})` }"
                    ></div>
                </div>
                <div class="title">系统日记</div>
            </div>
        </div>
        <!-- <div class="container">
            <div>
                <div class="not-content">
                    <div class="content-icon"></div>
                </div>
            </div>
            <div>
                <div class="not-content">
                    <div class="content-icon"></div>
                </div>
            </div>
            <div>
                <div class="not-content">
                    <div class="content-icon"></div>
                </div>
            </div>
            <div>
                <div class="not-content">
                    <div class="content-icon"></div>
                </div>
            </div>
            <div>
                <div class="not-content">
                    <div class="content-icon"></div>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            account: localStorage.getItem('account')
        }
    },
    methods: {
        handleClick(path) {
            this.$router.push(path)
        }
    }
}
</script>

<style scoped>
.container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20px 0px;
}
.content {
    padding: 28px;
    margin-bottom: 15px;
    border: 1px solid #ececec;
    border-radius: 16px;
    box-shadow: 0 16px 64px 0 rgb(12 31 80 / 12%);
    transition: transform 0.4s;
    cursor: pointer;
}
.not-content {
    padding: 28px;
    margin-bottom: 15px;
}
.content-icon {
    width: 80px;
    padding-bottom: 100%;
    background-size: cover;
}
.title {
    font-size: 16px;
    line-height: 18px;
    color: #2b3441;
    text-align: center;
    font-weight: 600;
}
</style>
