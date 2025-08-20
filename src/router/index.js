import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决报错
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
    return originalReplace.call(this, location).catch(err => err)
}

const routes = [
    {
        path: '/',
        name: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/layout/login')
    },
    {
        name: 'addForm',
        path: '/addForm',
        component: () => import('@/views/platform/add-form'),
        meta: {
            keepAlive: true,
            title: '添加表单'
        }
    },
    {
        name: 'editForm',
        path: '/editForm',
        component: () => import('@/views/platform/edit-form'),
        meta: {
            keepAlive: true,
            title: '编辑表单'
        }
    },
    {
        path: '/flowDesigner',
        name: 'flowDesigner',
        component: () => import('@/views/flow/flow-designer'),
        meta: {
            title: '流程设计'
        }
    },
    {
        path: '/flowDesignerSenior',
        name: 'flowDesignerSenior',
        component: () => import('@/views/flow/flow-designer-senior'),
        meta: {
            title: '流程设计'
        }
    },
    {
        name: 'gaugeSetting',
        path: '/gaugeSetting',
        component: () => import('@/views/platform/gauge-setting'),
        meta: {
            title: '仪表板设计'
        }
    },
    {
        name: 'authority',
        path: '/authority',
        component: () => import('@/views/platform/authority'),
        meta: {
            title: '权限设置'
        }
    },
    {
        name: 'javascript',
        path: '/javascript',
        component: () => import('@/views/platform/javascript'),
        meta: {
            title: '动作脚本'
        }
    },
    {
        name: 'sql',
        path: '/sql',
        component: () => import('@/views/platform/sql'),
        meta: {
            title: 'SQL配置'
        }
    },
    {
        name: 'home',
        path: '/home',
        component: () => import('@/views/layout/home'),
        children: [
            {
                name: 'readme',
                path: '/readme',
                component: () => import('@/views/layout/readme'),
                meta: {
                    title: '首页',
                    keepAlive: true
                }
            },
            {
                name: 'company',
                path: '/company',
                component: () => import('@/views/platform/company'),
                meta: {
                    title: '组织定义',
                    keepAlive: true
                }
            },
            {
                name: 'businessTable',
                path: '/businessTable',
                component: () => import('@/views/platform/business-table'),
                meta: {
                    title: '数据建模',
                    keepAlive: true
                }
            },
            {
                name: 'businessField',
                path: '/businessField',
                component: () => import('@/views/platform/business-field'),
                meta: {
                    title: '设计表',
                    keepAlive: true
                }
            },
            {
                name: 'taskScheduler',
                path: '/taskScheduler',
                component: () => import('@/views/platform/task-scheduler'),
                meta: {
                    title: '定时任务',
                    keepAlive: true
                }
            },
            {
                name: 'dic',
                path: '/dic',
                component: () => import('@/views/platform/dic'),
                meta: {
                    title: '数据字典',
                    keepAlive: true
                }
            },
            {
                name: 'form',
                path: '/form',
                component: () => import('@/views/platform/form'),
                meta: {
                    title: '表单管理',
                    keepAlive: true
                }
            },
            {
                name: 'gauge',
                path: '/gauge',
                component: () => import('@/views/platform/gauge'),
                meta: {
                    title: '仪表板',
                    keepAlive: true
                }
            },
            {
                name: 'door',
                path: '/door',
                component: () => import('@/views/platform/door'),
                meta: {
                    title: '门户管理',
                    keepAlive: true
                }
            },
            {
                name: 'menu',
                path: '/menu',
                component: () => import('@/views/platform/menu'),
                meta: {
                    title: '菜单管理',
                    keepAlive: true
                }
            },
            {
                name: 'log',
                path: '/log',
                component: () => import('@/views/platform/log'),
                meta: {
                    title: '系统日记',
                    keepAlive: true
                }
            },
            {
                name: 'import',
                path: '/import',
                component: () => import('@/views/platform/import'),
                meta: {
                    title: '导入配置',
                    keepAlive: true
                }
            },
            {
                name: 'flow',
                path: '/flow',
                component: () => import('@/views/platform/flow-definition'),
                meta: {
                    title: '流程设计',
                    keepAlive: true
                }
            },
            {
                name: 'serial',
                path: '/serial',
                component: () => import('@/views/platform/serial'),
                meta: {
                    title: '编号设置',
                    keepAlive: true
                }
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: 'console',
    routes
})

router.beforeEach((to, from, next) => {
    if (window.platform) {
        document.title = window.platform.title
    } else {
        document.title = localStorage.getItem('title')
    }
    var authorization = localStorage.getItem('Authorization')
    if (authorization) {
        next()
    } else {
        if (to.path === '/' || to.path === '/login') {
            next()
        } else {
            next('/login')
        }
    }
})

export default router
