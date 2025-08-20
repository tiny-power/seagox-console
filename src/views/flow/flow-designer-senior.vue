<template>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <div class="header-close" @click="handleClose"><i class="el-icon-close"></i></div>
                <div class="header-title">{{ title }}</div>
            </div>
            <div class="header-right">
                <el-button class="button-publish" @click="handleSwitch">简单模式</el-button>
                <el-button class="button-publish" @click="handleLayout">布 局</el-button>
                <el-button class="button-publish" @click="handlePublish">发 布</el-button>
            </div>
        </div>
        <div
            id="relation-box"
            :style="{ height: height - 60 + 'px' }"
            @contextmenu.prevent="rightClickOpen($event)"
            @click="rightClickClose"
        >
            <el-alert
                title="提示 ：右键可以增加节点、右键当前节点可删除、右键连接线可设置或删除、双击节点设置属性、拖动小圆点可连接节点。"
                type="warning"
                center
                show-icon
                :closable="false"
                style="position: fixed; z-index: 2000"
            >
            </el-alert>
            <div
                v-for="(item, index) in nodes"
                :key="item.id"
                :id="item.id"
                :class="item.type"
                :style="{ left: item.x + 'px', top: item.y + 'px' }"
                @contextmenu.stop.prevent="nodeRightClickOpen(index, item, $event)"
                @dblclick="handleNodelDblClick(index, item)"
            >
                <div
                    v-if="
                        item.type == 'start' ||
                        item.type == 'end' ||
                        item.type == 'userTask' ||
                        item.type == 'ccTask' ||
                        item.type == 'scriptTask'
                    "
                >
                    {{ item.label }}
                </div>
                <i class="el-icon-s-custom type-icon" style="color: #22242a" v-if="item.type === 'userTask'"></i>
                <i class="el-icon-s-promotion type-icon" style="color: #22242a" v-if="item.type === 'ccTask'"></i>
                <i class="el-icon-s-tools type-icon" style="color: #22242a" v-if="item.type === 'scriptTask'"></i>
                <div v-if="item.type === 'parallelGateWay'">
                    <i class="el-icon-plus" style="font-weight: bold"></i>
                </div>
                <div v-if="item.type === 'exclusiveGateway'">
                    <i class="el-icon-close" style="font-weight: bold"></i>
                </div>
                <div v-if="item.type === 'manualTask'">
                    <i class="el-icon-rank" style="font-weight: bold"></i>
                </div>
            </div>
        </div>
        <nodeSetting
            ref="nodeSetting"
            :nodeInfo="currentNode"
            :operationAuthority="form.operationAuthority"
            @updateNodeInfo="updateNodeInfo"
        >
        </nodeSetting>
        <scriptSetting ref="scriptSetting" :nodeInfo="currentNode" @updateNodeInfo="updateNodeInfo"> </scriptSetting>
        <ul v-show="visible" :style="{ left: x + 'px', top: y + 'px' }" class="contextmenu">
            <li @click="handleAddNodeClick('userTask')" v-if="!connFlag">
                <i class="el-icon-s-custom" style="color: #22242a; font-size: 12px; font-weight: bold"> 审批任务</i>
            </li>
            <li @click="handleAddNodeClick('ccTask')" v-if="!connFlag">
                <i class="el-icon-s-promotion" style="color: #22242a; font-size: 12px; font-weight: bold"> 抄送任务</i>
            </li>
            <li @click="handleAddNodeClick('scriptTask')" v-if="!connFlag">
                <i class="el-icon-s-tools" style="color: #22242a; font-size: 12px; font-weight: bold"> 脚本任务</i>
            </li>
            <li @click="handleAddNodeClick('exclusiveGateway')" v-if="!connFlag">
                <i class="el-icon-close" style="color: #000; font-size: 12px; font-weight: bold"> 条件分支</i>
            </li>
            <li @click="handleAddNodeClick('parallelGateWay')" v-if="!connFlag">
                <i class="el-icon-plus" style="color: #000; font-size: 12px; font-weight: bold"> 并行网关</i>
            </li>
            <li @click="connMenu('setText')" v-if="connFlag">
                <i class="el-icon-setting" style="color: #000; font-size: 12px; font-weight: bold"> 设置</i>
            </li>
            <li @click="connMenu('deleteConn')" v-if="connFlag">
                <i class="el-icon-delete" style="color: #000; font-size: 12px; font-weight: bold"> 删除 </i>
            </li>
            <li @click="handleAddNodeClick('manualTask')" v-if="!connFlag">
                <i class="el-icon-rank" style="color: #000; font-size: 12px; font-weight: bold"> 手动选择</i>
            </li>
        </ul>
        <ul v-show="nodeVisible" :style="{ left: x + 'px', top: y + 'px' }" class="contextmenu">
            <li @click="handleDelNode"><i class="el-icon-delete" style="color: #f56c6c; font-size: 12px"> 删 除</i></li>
        </ul>
        <el-dialog title="条件设置" :visible.sync="edgeDialogVisible" width="750px">
            <el-form ref="linkForm" :model="linkForm" label-width="0px" :rules="rules">
                <el-form-item prop="label">
                    <el-input v-model="linkForm.label" placeholder="请输入文本"></el-input>
                </el-form-item>
                <el-form-item>
                    <formula
                        v-model="linkForm.condition"
                        :height="200"
                        :variable="variable"
                        v-if="edgeDialogVisible"
                    ></formula>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="edgeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEdgeText">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { jsPlumb } from 'jsplumb'
import nodeSetting from '@/views/flow/node-setting'
import scriptSetting from '@/views/flow/script-setting'
import formula from '@/views/components/codemirror/formula'
import dagre from 'dagre'
export default {
    components: {
        nodeSetting,
        scriptSetting,
        formula
    },
    data() {
        return {
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
            jsPlumbInstance: '',
            jsPlumbSetting: {
                Connector: [
                    'Flowchart',
                    {
                        gap: 2,
                        midpoint: 0,
                        cornerRadius: 3
                    }
                ],
                Endpoint: ['Dot', { radius: 3 }],
                EndpointStyle: {
                    stroke: '#888',
                    fill: '#fff'
                },
                PaintStyle: { stroke: '#22242A', strokeWidth: 2, outlineStroke: '#f7f8fa' },
                Overlays: [['Arrow', { width: 10, length: 10, location: 1 }]]
            },
            jsPlumbConnectOptions: {
                isSource: true,
                isTarget: true,
                anchor: 'AutoDefault'
            },
            nodes: [],
            edges: [],
            currentIndex: -1,
            currentNode: {},
            form: {},
            x: 0,
            y: 0,
            visible: false,
            edgeDialogVisible: false,
            currentConn: {},
            nodeVisible: false,
            linkForm: {
                label: '',
                condition: ''
            },
            rules: {
                label: [{ required: true, message: '请输入文本', trigger: 'blur' }]
            },
            connFlag: false,
            contextConn: {},
            variable: []
        }
    },
    computed: {
        title() {
            return this.$route.query.title
        }
    },
    mounted() {
        document.onselectstart = function () {
            return false
        }
        this.queryById()
    },
    methods: {
        handleLayout() {
            var g = new dagre.graphlib.Graph()
            g.setGraph({
                rankdir: 'LR',
                ranksep: 100,
                marginx: 50,
                marginy: 100
            })

            g.setDefaultEdgeLabel(function () {
                return {}
            })
            for (let i = 0; i < this.nodes.length; i++) {
                let item = this.nodes[i]
                item.width = 100
                item.height = 60
                g.setNode(item.id, item)
            }
            for (let i = 0; i < this.edges.length; i++) {
                g.setEdge(this.edges[i].source, this.edges[i].target)
            }
            dagre.layout(g)
            let nodes = []
            g.nodes().forEach(function (v) {
                nodes.push(g.node(v))
            })
            this.nodes = nodes
            this.drawLines()
        },
        async queryById() {
            let params = {
                dataSource: this.$route.query.dataSource
            }
            let res = await this.$axios.get('seaDefinition/queryById/' + this.$route.query.id, { params })
            if (res.data.code == 200) {
                this.form = res.data.data
                let variable = []
                let fieldOptions = this.form.operationAuthority
                for (let i = 0; i < fieldOptions.length; i++) {
                    let field = fieldOptions[i]
                    variable.push({ value: field.field, label: field.comment })
                }
                this.variable = variable
                if (res.data.data.resources) {
                    var resource = JSON.parse(res.data.data.resources)
                    this.nodes = resource.nodes
                    this.edges = resource.edges
                }
                this.drawLines()
            }
        },
        drawLines() {
            this.$nextTick().then(() => {
                jsPlumb.ready(() => {
                    if (this.jsPlumbInstance) {
                        this.jsPlumbInstance.reset()
                    }
                    this.jsPlumbInstance = jsPlumb.getInstance()

                    this.jsPlumbInstance.importDefaults(this.jsPlumbSetting)
                    this.nodes.forEach(item => {
                        this.addEndpoint(item.id)
                    })
                    //连接线
                    this.edges.forEach(item => {
                        if (item.label) {
                            item.overlays = [
                                [
                                    'Label',
                                    { label: item.label, location: 0.5, id: 'label', cssClass: 'process-point-label' }
                                ]
                            ]
                        }
                        let connect = this.jsPlumbInstance.connect(item, this.jsPlumbConnectOptions)
                        if (item.condition) {
                            connect.setParameter('condition', item.condition)
                        }
                    })
                    this.nodes.forEach(item => {
                        this.addEndpoint(item.id)
                    })

                    //删除新连接或现有连接时触发此事件
                    this.jsPlumbInstance.bind('beforeDrop', conn => {
                        let allConnections = this.jsPlumbInstance.getAllConnections()
                        let repeatFlag = false
                        for (let i = 0; i < allConnections.length; i++) {
                            if (
                                (conn.sourceId === allConnections[i].sourceId &&
                                    conn.targetId === allConnections[i].targetId) ||
                                (conn.sourceId === allConnections[i].targetId &&
                                    conn.targetId === allConnections[i].sourceId)
                            ) {
                                repeatFlag = true
                                break
                            }
                        }
                        if (repeatFlag) {
                            return false
                        } else {
                            this.edges.push({
                                source: conn.sourceId,
                                target: conn.targetId
                            })
                            return true
                        }
                    })
                    //右键进入连接线菜单
                    this.jsPlumbInstance.bind('contextmenu', conn => {
                        this.connFlag = true
                        this.contextConn = conn
                        this.nodeVisible = false
                    })
                    this.jsPlumbInstance.repaintEverything() // 重绘
                })
            })
        },
        addEndpoint(id) {
            let that = this
            if (id === 'start') {
                //拖拽
                this.jsPlumbInstance.draggable(id, {
                    grid: [10, 10],
                    drag(event) {
                        if (event.pos[0] < 0) {
                            let startNode = document.getElementById(event.el.id)
                            startNode.style.left = 0
                        }
                        if (event.pos[1] < 0) {
                            let startNode = document.getElementById(event.el.id)
                            startNode.style.top = 0
                        }
                        that.jsPlumbInstance.repaintEverything()
                    }
                    // stop(event) {
                    //     that.nodes.map((key, index) => {
                    //         if (key.id == event.el.id) {
                    //             key.x = event.pos[0] < 0 ? 0 : event.pos[0]
                    //             key.y = event.pos[1] < 0 ? 0 : event.pos[1]
                    //         }
                    //     })
                    // }
                })
                //瞄点
                this.jsPlumbInstance.addEndpoint(
                    id,
                    {
                        anchors: ['Top']
                    },
                    {
                        isSource: true,
                        isTarget: false
                    }
                )
                this.jsPlumbInstance.addEndpoint(
                    id,
                    {
                        anchors: ['Bottom']
                    },
                    {
                        isSource: true,
                        isTarget: false
                    }
                )
                this.jsPlumbInstance.addEndpoint(
                    id,
                    {
                        anchors: ['Left']
                    },
                    {
                        isSource: true,
                        isTarget: false
                    }
                )
                this.jsPlumbInstance.addEndpoint(
                    id,
                    {
                        anchors: ['Right']
                    },
                    {
                        isSource: true,
                        isTarget: false
                    }
                )
            } else if (id === 'end') {
                //拖拽
                this.jsPlumbInstance.draggable(id, {
                    grid: [10, 10],
                    drag(event) {
                        if (event.pos[0] < 0) {
                            let startNode = document.getElementById(event.el.id)
                            startNode.style.left = 0
                        }
                        if (event.pos[1] < 0) {
                            let startNode = document.getElementById(event.el.id)
                            startNode.style.top = 0
                        }
                        that.jsPlumbInstance.repaintEverything()
                    }
                })
                //瞄点
                this.jsPlumbInstance.addEndpoint(
                    id,
                    {
                        anchors: ['Top']
                    },
                    {
                        isSource: false,
                        isTarget: true,
                        maxConnections: -1
                    }
                )
                this.jsPlumbInstance.addEndpoint(
                    id,
                    {
                        anchors: ['Bottom']
                    },
                    {
                        isSource: false,
                        isTarget: true,
                        maxConnections: -1
                    }
                )
                this.jsPlumbInstance.addEndpoint(
                    id,
                    {
                        anchors: ['Left']
                    },
                    {
                        isSource: false,
                        isTarget: true,
                        maxConnections: -1
                    }
                )
                this.jsPlumbInstance.addEndpoint(
                    id,
                    {
                        anchors: ['Right']
                    },
                    {
                        isSource: false,
                        isTarget: true,
                        maxConnections: -1
                    }
                )
            } else {
                //拖拽
                this.jsPlumbInstance.draggable(id, {
                    grid: [10, 10],
                    containment: 'parent',
                    drag(event) {
                        that.jsPlumbInstance.repaintEverything()
                    }
                })
                //瞄点
                this.jsPlumbInstance.addEndpoint(
                    id,
                    {
                        anchors: ['Top']
                    },
                    {
                        isSource: true,
                        isTarget: true,
                        maxConnections: -1
                    }
                )
                this.jsPlumbInstance.addEndpoint(
                    id,
                    {
                        anchors: ['Bottom']
                    },
                    {
                        isSource: true,
                        isTarget: true,
                        maxConnections: -1
                    }
                )
                this.jsPlumbInstance.addEndpoint(
                    id,
                    {
                        anchors: ['Left']
                    },
                    {
                        isSource: true,
                        isTarget: true,
                        maxConnections: -1
                    }
                )
                this.jsPlumbInstance.addEndpoint(
                    id,
                    {
                        anchors: ['Right']
                    },
                    {
                        isSource: true,
                        isTarget: true,
                        maxConnections: -1
                    }
                )
            }
        },
        rightClickOpen(e) {
            this.x = e.pageX
            this.y = e.pageY
            this.visible = true
            this.connFlag = false
            this.nodeVisible = false
        },
        rightClickClose() {
            this.visible = false
            this.nodeVisible = false
            this.connFlag = false
        },
        nodeRightClickOpen(index, item, e) {
            if (
                item.type === 'userTask' ||
                item.type === 'ccTask' ||
                item.type === 'scriptTask' ||
                item.type === 'parallelGateWay' ||
                item.type === 'exclusiveGateway' ||
                item.type === 'manualTask'
            ) {
                this.currentIndex = index
                this.currentNode = item
                this.x = e.pageX
                this.y = e.pageY
                this.nodeVisible = true
                this.visible = false
                this.connFlag = false
            }
        },
        //连接线的右键菜单功能
        connMenu(command) {
            if (command === 'deleteConn') {
                // 删除线
                this.jsPlumbInstance.deleteConnection(this.contextConn)
                for (let i = 0; i < this.edges.length; i++) {
                    if (
                        this.edges[i].source === this.contextConn.sourceId &&
                        this.edges[i].target === this.contextConn.targetId
                    ) {
                        this.edges.splice(i, 1)
                    }
                }
                this.jsPlumbInstance.repaintEverything()
            } else if (command === 'setText') {
                // 设置文本
                this.edgeDialogVisible = true
                this.currentConn = this.contextConn
                for (let i = 0; i < this.edges.length; i++) {
                    if (
                        this.edges[i].source === this.contextConn.sourceId &&
                        this.edges[i].target === this.contextConn.targetId
                    ) {
                        this.linkForm = {
                            label: this.edges[i].label,
                            condition: this.edges[i].condition
                        }
                        break
                    }
                }
            }
            this.connFlag = false
            this.visible = false
        },
        handleAddNodeClick(command) {
            this.visible = false
            this.nodeVisible = false
            this.connFlag = false
            let nodeId = Math.random().toString(36).slice(-6)
            if (command === 'userTask') {
                this.nodes.push({
                    id: nodeId,
                    type: 'userTask',
                    label: '审批任务',
                    x: this.x,
                    y: this.y
                })
            } else if (command === 'ccTask') {
                this.nodes.push({
                    id: nodeId,
                    type: 'ccTask',
                    label: '抄送任务',
                    x: this.x,
                    y: this.y
                })
            } else if (command === 'scriptTask') {
                this.nodes.push({
                    id: nodeId,
                    type: 'scriptTask',
                    label: '脚本任务',
                    x: this.x,
                    y: this.y
                })
            } else if (command === 'exclusiveGateway') {
                this.nodes.push({
                    id: nodeId,
                    type: 'exclusiveGateway',
                    label: '排他网关',
                    x: this.x,
                    y: this.y
                })
            } else if (command === 'parallelGateWay') {
                this.nodes.push({
                    id: nodeId,
                    type: 'parallelGateWay',
                    label: '并行网关',
                    x: this.x,
                    y: this.y
                })
            } else if (command === 'manualTask') {
                this.nodes.push({
                    id: nodeId,
                    type: 'manualTask',
                    label: '手动选择',
                    x: this.x,
                    y: this.y
                })
            }
            this.$nextTick().then(() => {
                this.addEndpoint(nodeId)
            })
        },
        handleNodelDblClick(index, item) {
            this.currentIndex = index
            this.currentNode = item
            if (item.type === 'userTask' || item.type === 'ccTask') {
                this.$refs.nodeSetting.showDialog()
            } else if (item.type === 'scriptTask') {
                this.$refs.scriptSetting.showDialog()
            } else if (item.type === 'condition') {
                this.$refs.condition.showDialog(item)
            }
        },
        handleDelNode() {
            if (
                this.currentNode.type === 'userTask' ||
                this.currentNode.type === 'ccTask' ||
                this.currentNode.type === 'scriptTask' ||
                this.currentNode.type === 'parallelGateWay' ||
                this.currentNode.type === 'exclusiveGateway' ||
                this.currentNode.type === 'manualTask'
            ) {
                this.jsPlumbInstance.remove(this.currentNode.id)
                for (let i = 0; i < this.nodes.length; i++) {
                    if (this.nodes[i].id === this.currentNode.id) {
                        this.nodes.splice(i, 1)
                        break
                    }
                }
                for (let i = 0; i < this.edges.length; i++) {
                    if (this.edges[i].source === this.currentNode.id || this.edges[i].target === this.currentNode.id) {
                        this.edges.splice(i, 1)
                    }
                }
                this.currentIndex = -1
                this.currentNode = {}
                this.nodeVisible = false
            }
        },
        handleClose() {
            window.close()
        },
        handlePublish() {
            let edges = []
            let sourceList = []
            let targetList = []
            let allConnections = this.jsPlumbInstance.getAllConnections()
            for (let i = 0; i < allConnections.length; i++) {
                let parameters = allConnections[i].getParameters()
                edges.push({
                    source: allConnections[i].sourceId,
                    target: allConnections[i].targetId,
                    label: allConnections[i].getLabel(),
                    condition: parameters.condition
                })
                sourceList.push(allConnections[i].sourceId)
                targetList.push(allConnections[i].targetId)
            }
            for (let i = 0; i < this.nodes.length; i++) {
                let nodeItem = this.nodes[i]
                let nodeStyle = document.getElementById(nodeItem.id).style
                if (nodeStyle.top) {
                    nodeItem.y = nodeStyle.top.replace('px', '')
                }
                if (nodeStyle.left) {
                    nodeItem.x = nodeStyle.left.replace('px', '')
                }
                this.nodes[i] = nodeItem
                if (nodeItem.id === 'start') {
                    if (sourceList.indexOf(nodeItem.id) === -1) {
                        //开始节点未连线
                        this.$message.error(nodeItem.label + '节点未连线')
                        return
                    }
                } else if (nodeItem.id === 'end') {
                    if (targetList.indexOf(nodeItem.id) === -1) {
                        //结束节点未连线
                        this.$message.error(nodeItem.label + '节点未连线')
                        return
                    }
                } else {
                    if (sourceList.indexOf(nodeItem.id) === -1 || targetList.indexOf(nodeItem.id) === -1) {
                        //节点未连线
                        this.$message.error(nodeItem.label + '节点未连线')
                        return
                    }
                    if (nodeItem.type === 'userTask' || nodeItem.type === 'ccTask') {
                        //审批、抄送节点
                        if (!nodeItem.value || nodeItem.value.length === 0) {
                            this.$message.error(nodeItem.label + '节点未设置条件')
                            return
                        }
                    } else if (nodeItem.type === 'exclusiveGateway') {
                        // 排它网关
                        for (let j = 0; j < edges.length; j++) {
                            let edge = edges[j]
                            if (nodeItem.id === edge.source) {
                                if (!(edge.label && edge.condition)) {
                                    this.$message.error('条件分支出口线未设置条件')
                                    return
                                }
                            }
                        }
                    }
                }
            }
            var resource = {
                nodes: this.nodes,
                edges: edges
            }
            var params = {
                id: this.$route.query.id,
                dataSource: this.form.dataSource,
                empower: this.form.empower,
                resources: JSON.stringify(resource)
            }
            this.$axios.post('seaDefinition/update', params).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('发布成功')
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        updateNodeInfo(data) {
            this.$set(this.nodes, this.currentIndex, data)
        },
        handleEdgeText() {
            this.$refs.linkForm.validate(valid => {
                if (valid) {
                    for (let i = 0; i < this.edges.length; i++) {
                        if (
                            this.edges[i].source === this.currentConn.sourceId &&
                            this.edges[i].target === this.currentConn.targetId
                        ) {
                            this.edges[i].label = this.linkForm.label
                            this.edges[i].condition = this.linkForm.condition
                            break
                        }
                    }
                    this.jsPlumbInstance.deleteEveryConnection()
                    //连接线
                    this.edges.forEach(item => {
                        if (item.label) {
                            item.overlays = [
                                [
                                    'Label',
                                    { label: item.label, location: 0.5, id: 'label', cssClass: 'process-point-label' }
                                ]
                            ]
                        } else {
                            item.overlays = []
                        }
                        let connect = this.jsPlumbInstance.connect(item, this.jsPlumbConnectOptions)
                        if (item.condition) {
                            connect.setParameter('condition', item.condition)
                        }
                    })
                    this.edgeDialogVisible = false
                }
            })
        },
        handleSwitch() {
            this.$router.replace({
                path: '/flowDesigner',
                query: this.$route.query
            })
        }
    }
}
</script>

<style scoped>
.container {
    background-color: #f7f8fa;
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

.header-close {
    display: inline-block;
    width: 60px;
    height: 60px;
    font-size: 22px;
    border-right: 1px solid #1583f2;
    text-align: center;
    cursor: pointer;
}

.header-close .el-icon-close {
    line-height: 60px;
}

.header-close:hover {
    background: #5af;
}

.header-question {
    display: inline-block;
    width: 60px;
    height: 60px;
    font-size: 22px;
    text-align: center;
    cursor: pointer;
}

.header-question .el-icon-question {
    line-height: 60px;
}

.header-question:hover {
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

#relation-box {
    position: relative;
    overflow: auto;
}

::v-deep .process-point-label {
    background: #f7f8fa;
    padding: 4px;
}

.start {
    position: absolute;
    border: 2px solid #22242a;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    text-align: center;
    line-height: 60px;
    background-color: #fff;
    cursor: pointer;
    font-size: 12px;
}

.end {
    position: absolute;
    border: 4px solid #22242a;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    text-align: center;
    line-height: 56px;
    background-color: #fff;
    cursor: pointer;
    font-size: 12px;
}

.userTask {
    position: absolute;
    border: 2px solid #22242a;
    width: 100px;
    height: 60px;
    border-radius: 10px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    cursor: pointer;
    font-size: 12px;
}

.ccTask {
    position: absolute;
    border: 2px solid #22242a;
    width: 100px;
    height: 60px;
    border-radius: 10px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    cursor: pointer;
    font-size: 12px;
}

.scriptTask {
    position: absolute;
    border: 2px solid #22242a;
    width: 100px;
    height: 60px;
    border-radius: 10px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    cursor: pointer;
    font-size: 12px;
}

.exclusiveGateway,
.parallelGateWay,
.manualTask {
    position: absolute;
    border: 2px solid #22242a;
    width: 60px;
    height: 60px;
    transform: rotate(45deg) scale(0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    cursor: pointer;
}
.exclusiveGateway:focus,
.parallelGateWay:focus,
.manualTask:focus {
    transform: translateX(-40px) rotate(45deg) scale(0.75);
}

.exclusiveGateway i,
.parallelGateWay i,
.manualTask i {
    transform: rotate(-45deg) scale(3);
}

.contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}

.contextmenu li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
}

.contextmenu li:hover {
    background: #eee;
}

.type-icon {
    width: 12px;
    height: 12px;
    position: absolute;
    top: 4px;
    left: 4px;
}
::v-deep .jtk-overlay {
    margin-top: -15px;
}
::v-deep .jtk-connector {
    cursor: pointer;
}
</style>
