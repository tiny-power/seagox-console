<template>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <div class="header-close" @click="handleClose"><i class="el-icon-close"></i></div>
                <div class="header-title">{{ title }}</div>
            </div>
            <div class="header-right">
                <el-button class="button-publish" @click="handleSwitch">高级模式</el-button>
                <el-button class="button-publish" @click="handlePublish">发 布</el-button>
            </div>
        </div>
        <div id="relation-box" :style="{ height: height - 60 + 'px' }" @click="rightClickClose">
            <el-alert
                title="提示 ：单击流程中的某个节点，可以增加节点、删除当前节点、设置节点属性。"
                type="warning"
                center
                show-icon
                :closable="false"
                style="position: fixed; z-index: 2000"
            >
            </el-alert>
            <div v-for="(item, index) in nodes" :key="index">
                <div
                    :id="item.id"
                    :class="item.type"
                    :style="{ left: item.x + 'px', top: item.y + 'px' }"
                    v-if="item.type == 'end'"
                >
                    {{ item.label }}
                </div>
                <el-popover placement="bottom-start" trigger="click" width="100" :visible-arrow="false" v-else>
                    <div class="contextMenu">
                        <div
                            style="line-height: 36px; cursor: pointer; padding: 0 20px"
                            @click="handleNode(item, 'userTask')"
                        >
                            用户任务
                        </div>
                        <div
                            style="line-height: 36px; cursor: pointer; padding: 0 20px"
                            @click="handleNode(item, 'ccTask')"
                        >
                            抄送任务
                        </div>
                        <div
                            style="line-height: 36px; cursor: pointer; padding: 0 20px"
                            @click="handleNode(item, 'exclusiveGateway')"
                        >
                            排他网关
                        </div>
                        <div
                            style="line-height: 36px; cursor: pointer; padding: 0 20px"
                            @click="handleNode(item, 'manualTask')"
                        >
                            手动选择
                        </div>
                        <div
                            style="line-height: 36px; cursor: pointer; padding: 0 20px"
                            @click="handleNode(item, 'scriptTask')"
                        >
                            脚本任务
                        </div>
                        <div
                            style="line-height: 36px; cursor: pointer; padding: 0 20px"
                            @click="handleNode(item, 'delete')"
                            v-if="
                                item.type == 'userTask' ||
                                item.type == 'ccTask' ||
                                item.type == 'scriptTask' ||
                                item.type === 'manualTask' ||
                                item.type === 'exclusiveGateway'
                            "
                        >
                            删除节点
                        </div>
                    </div>
                    <div
                        slot="reference"
                        :id="item.id"
                        :class="item.type"
                        :style="{ left: item.x + 'px', top: item.y + 'px' }"
                    >
                        <div>
                            <div
                                v-if="
                                    item.type == 'start' ||
                                    item.type == 'userTask' ||
                                    item.type == 'ccTask' ||
                                    item.type == 'scriptTask'
                                "
                            >
                                {{ item.label }}
                            </div>
                            <i
                                class="el-icon-s-custom type-icon"
                                style="color: #22242a"
                                v-if="item.type === 'userTask'"
                            ></i>
                            <i
                                class="el-icon-s-promotion type-icon"
                                style="color: #22242a"
                                v-if="item.type === 'ccTask'"
                            ></i>
                            <i
                                class="el-icon-s-tools type-icon"
                                style="color: #22242a"
                                v-if="item.type === 'scriptTask'"
                            ></i>
                            <div v-if="item.type === 'parallelGateWay'">
                                <i class="el-icon-plus" style="font-weight: bold"></i>
                            </div>
                            <div v-if="item.type === 'exclusiveGateway'">
                                <i class="el-icon-close" style="font-weight: bold"></i>
                            </div>
                            <div v-if="item.type === 'manualTask'">
                                <i class="el-icon-rank"></i>
                            </div>
                        </div>
                    </div>
                </el-popover>
            </div>
        </div>
        <personnel ref="member" @confirm="personnelConfirm"></personnel>
        <ul v-show="connVisible" :style="{ left: x + 'px', top: y + 'px' }" class="contextmenu">
            <li @click="connMenu('setText')">
                <i class="el-icon-setting" style="color: #000; font-size: 12px; font-weight: bold"> 设置</i>
            </li>
        </ul>
        <el-dialog title="条件设置" :visible.sync="edgeDialogVisible" width="750px">
            <el-form ref="linkForm" :model="linkForm" label-width="0px" :rules="rules">
                <el-form-item prop="label">
                    <el-input v-model="linkForm.label" placeholder="请输入文本"></el-input>
                </el-form-item>
                <el-form-item>
                    <formula
                        :key="formulaKey"
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
import dagre from 'dagre'
import personnel from '@/views/flow/personnel'
import formula from '@/views/components/codemirror/formula'
export default {
    components: {
        personnel,
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
                Endpoint: ['Blank', { radius: 2 }],
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
                anchor: ['Left', 'Right']
            },
            nodes: [],
            edges: [],
            form: {},
            variable: [],
            currentId: '',
            currentNodeType: 'userTask',
            x: 0,
            y: 0,
            connVisible: false,
            contextConn: {},
            edgeDialogVisible: false,
            linkForm: {
                label: '',
                condition: ''
            },
            rules: {
                label: [{ required: true, message: '请输入文本', trigger: 'blur' }]
            },
            formulaKey: 0
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
        async queryById() {
            let params = {
                dataSource: this.$route.query.dataSource
            }
            let res = await this.$axios.get('flow/queryById/' + this.$route.query.id, { params })
            if (res.data.code == 200) {
                this.form = res.data.data
                let variable = []
                let fieldOptions = this.form.operationAuthority || []
                for (let i = 0; i < fieldOptions.length; i++) {
                    let field = fieldOptions[i]
                    variable.push({ value: field.field, label: field.comment })
                }
                this.variable = variable
                if (res.data.data.resources) {
                    var resource = JSON.parse(res.data.data.resources)
                    this.nodes = resource.nodes
                    this.edges = resource.edges
                    this.handleAlign(resource.nodes, resource.edges)
                }
            }
        },
        handleAlign(nodesMap, edges) {
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
            for (let i = 0; i < nodesMap.length; i++) {
                let item = nodesMap[i]
                item.width = 100
                item.height = 60
                g.setNode(item.id, item)
            }
            for (let i = 0; i < edges.length; i++) {
                g.setEdge(edges[i].source, edges[i].target)
            }
            dagre.layout(g)
            let nodes = []
            g.nodes().forEach(function (v) {
                nodes.push(g.node(v))
            })
            this.nodes = nodes
            this.drawLines()
        },
        drawLines() {
            this.$nextTick().then(() => {
                jsPlumb.ready(() => {
                    if (this.jsPlumbInstance) {
                        this.jsPlumbInstance.reset()
                    }
                    this.jsPlumbInstance = jsPlumb.getInstance()

                    this.jsPlumbInstance.importDefaults(this.jsPlumbSetting)
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
                    this.jsPlumbInstance.bind('contextmenu', (conn, event) => {
                        let node = this.nodes.filter(item => {
                            return item.id === conn.sourceId
                        })[0]
                        if (!node || node.type !== 'exclusiveGateway') {
                            return
                        }
                        if (event) {
                            event.preventDefault()
                            event.stopPropagation()
                            this.x = event.pageX
                            this.y = event.pageY
                        }
                        this.contextConn = conn
                        this.connVisible = true
                    })
                })
            })
        },
        handleClose() {
            window.close()
        },
        handlePublish() {
            let edgesObj = {}
            for (let i = 0; i < this.edges.length; i++) {
                let edge = this.edges[i]
                if (edgesObj.hasOwnProperty(edge.source)) {
                    let target = edgesObj[edge.source]
                    target.push(edge)
                    edgesObj[edge.source] = target
                } else {
                    let target = []
                    target.push(edge)
                    edgesObj[edge.source] = target
                }
            }
            for (let i = 0; i < this.nodes.length; i++) {
                let node = this.nodes[i]
                if (node.type === 'exclusiveGateway') {
                    let targetList = edgesObj[node.id] || []
                    if (targetList.length === 0) {
                        this.$message.error(node.label + '节点未连线')
                        return
                    }
                    for (let j = 0; j < targetList.length; j++) {
                        let edge = targetList[j]
                        if (!(edge.label && edge.condition)) {
                            this.$message.error('条件分支出口线未设置条件')
                            return
                        }
                    }
                }
            }

            var resource = {
                nodes: this.nodes,
                edges: this.edges
            }
            var params = {
                id: this.$route.query.id,
                dataSource: this.form.dataSource,
                resources: JSON.stringify(resource)
            }
            this.$axios.post('flow/update', params).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('发布成功')
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        handleNode(node, type) {
            this.currentId = node.id
            if (type === 'userTask') {
                this.currentNodeType = type
                if (
                    node.type === 'start' ||
                    node.type === 'parallelGateWay' ||
                    node.type === 'exclusiveGateway' ||
                    node.type === 'manualTask'
                ) {
                    this.$refs.member.showDialog([], false)
                } else {
                    this.$refs.member.showDialog([], true)
                }
            } else if (type === 'ccTask') {
                this.currentNodeType = type
                if (
                    node.type === 'start' ||
                    node.type === 'parallelGateWay' ||
                    node.type === 'exclusiveGateway' ||
                    node.type === 'manualTask'
                ) {
                    this.$refs.member.showDialog([], false)
                } else {
                    this.$refs.member.showDialog([], true)
                }
            } else if (type === 'delete') {
                let targetlist = []
                let source = {}
                this.edges.forEach(key => {
                    if (key.source == node.id) {
                        targetlist.push({ id: key.target })
                    }
                    if (key.target == node.id) {
                        source.id = key.source
                    }
                })
                this.nodes.forEach(key => {
                    if (source.id == key.id) {
                        source = JSON.parse(JSON.stringify(key))
                    }
                    targetlist.forEach((keys, index) => {
                        if (keys.id == key.id) {
                            targetlist[index] = key
                        }
                    })
                })
                //晒出改节点的源节点和目标节点
                if (targetlist.length > 1) {
                    //该情况下可以直接把节点置换成她的上一个目标节点
                    this.edges.forEach(key => {
                        if (key.source == node.id) {
                            key.source = source.id
                        }
                    })
                    this.edges = this.edges.filter(key => {
                        return key.target != node.id
                    })
                    this.nodes = this.nodes.filter(key => {
                        return key.id != node.id
                    })
                } else {
                    //剖析目标节点是否为汇合点
                    if (targetlist[0].type != 'parallelGateWay') {
                        // 不是汇合点，该情况下可以直接把节点置换成她的上一个目标节点
                        this.edges.forEach(key => {
                            if (key.source == node.id) {
                                key.source = source.id
                            }
                        })
                        this.edges = this.edges.filter(key => {
                            return key.target != node.id
                        })
                        this.nodes = this.nodes.filter(key => {
                            return key.id != node.id
                        })
                    } else {
                        //是汇合点。判断汇合点是否有多个source
                        let list = this.edges.filter(key => {
                            return key.target == targetlist[0].id
                        })
                        if (list.length > 2) {
                            //表明有多个并行，前面是并行节点可直接删除节点和连接线，前面是普通节点则增加一条线
                            //并行节点不止一个gate类型，普通节点也能成为分叉
                            if (
                                this.edges.filter(key => {
                                    return key.source == source.id
                                }).length == 1
                            ) {
                                this.edges.forEach(key => {
                                    if (key.source == node.id) {
                                        key.source = source.id
                                    }
                                })
                            }

                            this.edges = this.edges.filter(key => {
                                return !(key.target == node.id || key.source == node.id)
                            })
                            this.nodes = this.nodes.filter(key => {
                                return key.id != node.id
                            })
                        } else {
                            //当前只有2个可把节点连同她下一个汇合点一起删除,并行节点要变成当前唯一节点并连接下一节点
                            //找到当前节点唯一并行节点
                            let tempnode = list.filter(key => {
                                return key.source != node.id
                            })[0]
                            tempnode = this.nodes.filter(key => {
                                return key.id == tempnode.source
                            })[0]
                            //找出汇合点下一个节点
                            let nextnode = this.edges.filter(key => {
                                return key.source == targetlist[0].id
                            })[0]
                            nextnode = this.nodes.filter(key => {
                                return key.id == nextnode.target
                            })[0]
                            this.edges.forEach(key => {
                                if (key.source == targetlist[0].id) {
                                    key.source = tempnode.id
                                }
                            })
                            this.edges = this.edges.filter(key => {
                                return !(
                                    key.source == node.id ||
                                    key.target == node.id ||
                                    key.source == targetlist[0].id ||
                                    key.target == targetlist[0].id
                                )
                            })
                            this.nodes = this.nodes.filter(key => {
                                return !(key.id == node.id || key.id == targetlist[0].id)
                            })
                        }
                    }
                }
                this.handleAlign(this.nodes, this.edges)
            } else if (type === 'manualTask') {
                let edgesObj = {}
                for (let i = 0; i < this.edges.length; i++) {
                    let edge = this.edges[i]
                    if (edgesObj.hasOwnProperty(edge.source)) {
                        let target = edgesObj[edge.source]
                        target.push(edge)
                        edgesObj[edge.source] = target
                    } else {
                        let target = []
                        target.push(edge)
                        edgesObj[edge.source] = target
                    }
                }
                let target = edgesObj[this.currentId]
                let targetList = []
                for (let i = 0; i < target.length; i++) {
                    targetList.push(target[i].target)
                }
                let currentId = this.currentId
                let edges = this.edges.filter(item => {
                    return !(item.source === currentId && targetList.includes(item.target))
                })
                let nodeId = Math.random().toString(36).slice(-6)
                this.nodes.push({
                    id: nodeId,
                    type: 'manualTask',
                    label: '手动选择'
                })
                edges.push({
                    source: currentId,
                    target: nodeId
                })
                for (let j = 0; j < targetList.length; j++) {
                    edges.push({
                        source: nodeId,
                        target: targetList[j]
                    })
                }
                this.edges = edges
                this.handleAlign(this.nodes, this.edges)
            } else if (type === 'scriptTask') {
                let edgesObj = {}
                for (let i = 0; i < this.edges.length; i++) {
                    let edge = this.edges[i]
                    if (edgesObj.hasOwnProperty(edge.source)) {
                        let target = edgesObj[edge.source]
                        target.push(edge)
                        edgesObj[edge.source] = target
                    } else {
                        let target = []
                        target.push(edge)
                        edgesObj[edge.source] = target
                    }
                }
                let target = edgesObj[this.currentId]
                let targetList = []
                for (let i = 0; i < target.length; i++) {
                    targetList.push(target[i].target)
                }
                let currentId = this.currentId
                let edges = this.edges.filter(item => {
                    return !(item.source === currentId && targetList.includes(item.target))
                })
                let nodeId = Math.random().toString(36).slice(-6)
                this.nodes.push({
                    id: nodeId,
                    type: 'scriptTask',
                    label: '脚本任务'
                })
                edges.push({
                    source: currentId,
                    target: nodeId
                })
                for (let j = 0; j < targetList.length; j++) {
                    edges.push({
                        source: nodeId,
                        target: targetList[j]
                    })
                }
                this.edges = edges
                this.handleAlign(this.nodes, this.edges)
            } else if (type === 'exclusiveGateway') {
                let edgesObj = {}
                for (let i = 0; i < this.edges.length; i++) {
                    let edge = this.edges[i]
                    if (edgesObj.hasOwnProperty(edge.source)) {
                        let target = edgesObj[edge.source]
                        target.push(edge)
                        edgesObj[edge.source] = target
                    } else {
                        let target = []
                        target.push(edge)
                        edgesObj[edge.source] = target
                    }
                }
                let target = edgesObj[this.currentId]
                let targetList = []
                for (let i = 0; i < target.length; i++) {
                    targetList.push(target[i].target)
                }
                let currentId = this.currentId
                let edges = this.edges.filter(item => {
                    return !(item.source === currentId && targetList.includes(item.target))
                })
                let nodeId = Math.random().toString(36).slice(-6)
                this.nodes.push({
                    id: nodeId,
                    type: 'exclusiveGateway',
                    label: '排他网关'
                })
                edges.push({
                    source: currentId,
                    target: nodeId
                })
                for (let j = 0; j < targetList.length; j++) {
                    edges.push({
                        source: nodeId,
                        target: targetList[j]
                    })
                }
                this.edges = edges
                this.handleAlign(this.nodes, this.edges)
            }
        },
        personnelConfirm(flowType, memberList) {
            // flowType 0:串发;1:并发;2:会签;
            let nodeType = this.currentNodeType === 'ccTask' ? 'ccTask' : 'userTask'
            let edgesObj = {}
            for (let i = 0; i < this.edges.length; i++) {
                let edge = this.edges[i]
                if (edgesObj.hasOwnProperty(edge.source)) {
                    let target = edgesObj[edge.source]
                    target.push(edge)
                    edgesObj[edge.source] = target
                } else {
                    let target = []
                    target.push(edge)
                    edgesObj[edge.source] = target
                }
            }
            let nodeObj = {}
            for (let i = 0; i < this.nodes.length; i++) {
                let node = this.nodes[i]
                nodeObj[node.id] = node
            }
            if (flowType == 0) {
                // 串发
                let target = edgesObj[this.currentId]
                let targetList = []
                for (let i = 0; i < target.length; i++) {
                    targetList.push(target[i].target)
                }
                let currentId = this.currentId
                let edges = this.edges.filter(item => {
                    return !(item.source === currentId && targetList.includes(item.target))
                })
                for (let i = 0; i < memberList.length; i++) {
                    let nodeId = Math.random().toString(36).slice(-6)
                    this.nodes.push({
                        id: nodeId,
                        type: nodeType,
                        label: memberList[i].name,
                        value: [memberList[i]]
                    })
                    edges.push({
                        source: currentId,
                        target: nodeId
                    })
                    if (i === memberList.length - 1) {
                        for (let j = 0; j < targetList.length; j++) {
                            edges.push({
                                source: nodeId,
                                target: targetList[j]
                            })
                        }
                    }
                    currentId = nodeId
                }
                this.edges = edges
                this.handleAlign(this.nodes, this.edges)
            } else if (flowType == 1) {
                // 并发
                let target = edgesObj[this.currentId]
                let targetList = []
                for (let i = 0; i < target.length; i++) {
                    targetList.push(target[i].target)
                }
                let currentId = this.currentId
                let edges = this.edges.filter(item => {
                    return !(item.source === currentId && targetList.includes(item.target))
                })
                if (memberList.length === 1) {
                    for (let i = 0; i < memberList.length; i++) {
                        let nodeId = Math.random().toString(36).slice(-6)
                        this.nodes.push({
                            id: nodeId,
                            type: nodeType,
                            label: memberList[i].name,
                            value: [memberList[i]]
                        })
                        edges.push({
                            source: currentId,
                            target: nodeId
                        })
                        if (i === memberList.length - 1) {
                            for (let j = 0; j < targetList.length; j++) {
                                edges.push({
                                    source: nodeId,
                                    target: targetList[j]
                                })
                            }
                        }
                    }
                } else {
                    let parallelNodeId = Math.random().toString(36).slice(-6)
                    this.nodes.push({
                        id: parallelNodeId,
                        type: 'parallelGateWay',
                        label: '并行网关'
                    })
                    for (let i = 0; i < targetList.length; i++) {
                        edges.push({
                            source: parallelNodeId,
                            target: targetList[i]
                        })
                    }
                    for (let i = 0; i < memberList.length; i++) {
                        let nodeId = Math.random().toString(36).slice(-6)
                        this.nodes.push({
                            id: nodeId,
                            type: nodeType,
                            label: memberList[i].name,
                            value: [memberList[i]]
                        })
                        edges.push({
                            source: this.currentId,
                            target: nodeId
                        })
                        edges.push({
                            source: nodeId,
                            target: parallelNodeId
                        })
                    }
                }
                this.edges = edges
                this.handleAlign(this.nodes, this.edges)
            } else if (flowType == 2) {
                // 会签
                let sourceList = []
                let targetList = []
                let parallelGateWayFlag = false
                for (let i = 0; i < this.edges.length; i++) {
                    if (this.edges[i].source === this.currentId) {
                        targetList.push(this.edges[i].target)
                        if (nodeObj.hasOwnProperty(this.edges[i].target)) {
                            if (nodeObj[this.edges[i].target].type === 'parallelGateWay') {
                                parallelGateWayFlag = true
                            }
                        }
                    }
                    if (this.edges[i].target === this.currentId) {
                        sourceList.push(this.edges[i].source)
                    }
                }
                if (parallelGateWayFlag) {
                    for (let i = 0; i < memberList.length; i++) {
                        let nodeId = Math.random().toString(36).slice(-6)
                        this.nodes.push({
                            id: nodeId,
                            type: nodeType,
                            label: memberList[i].name,
                            value: [memberList[i]]
                        })
                        for (let j = 0; j < sourceList.length; j++) {
                            this.edges.push({
                                source: sourceList[j],
                                target: nodeId
                            })
                        }
                        this.edges.push({
                            source: nodeId,
                            target: targetList[0]
                        })
                    }
                } else {
                    for (let i = 0; i < this.edges.length; i++) {
                        if (this.edges[i].source === this.currentId && targetList.includes(this.edges[i].target)) {
                            this.edges.splice(i, 1)
                        }
                    }
                    let parallelNodeId = Math.random().toString(36).slice(-6)
                    this.nodes.push({
                        id: parallelNodeId,
                        type: 'parallelGateWay',
                        label: '并行网关'
                    })
                    for (let i = 0; i < targetList.length; i++) {
                        this.edges.push({
                            source: parallelNodeId,
                            target: targetList[i]
                        })
                    }
                    this.edges.push({
                        source: this.currentId,
                        target: parallelNodeId
                    })
                    for (let i = 0; i < memberList.length; i++) {
                        let nodeId = Math.random().toString(36).slice(-6)
                        this.nodes.push({
                            id: nodeId,
                            type: nodeType,
                            label: memberList[i].name,
                            value: [memberList[i]]
                        })
                        this.edges.push({
                            source: nodeId,
                            target: parallelNodeId
                        })
                        for (let j = 0; j < sourceList.length; j++) {
                            this.edges.push({
                                source: sourceList[j],
                                target: nodeId
                            })
                        }
                    }
                }
                this.handleAlign(this.nodes, this.edges)
            }
        },
        handleSwitch() {
            this.$router.replace({
                path: '/flowDesignerSenior',
                query: this.$route.query
            })
        },
        rightClickClose() {
            this.connVisible = false
        },
        connMenu(command) {
            if (command === 'setText') {
                this.edgeDialogVisible = true
                for (let i = 0; i < this.edges.length; i++) {
                    if (
                        this.edges[i].source === this.contextConn.sourceId &&
                        this.edges[i].target === this.contextConn.targetId
                    ) {
                        this.linkForm = {
                            label: this.edges[i].label || '',
                            condition: this.edges[i].condition || ''
                        }
                        break
                    }
                }
                this.formulaKey++
            }
            this.connVisible = false
        },
        handleEdgeText() {
            this.$refs.linkForm.validate(valid => {
                if (valid) {
                    if (!this.linkForm.condition) {
                        this.$message.error('请输入公式')
                        return
                    }
                    for (let i = 0; i < this.edges.length; i++) {
                        if (
                            this.edges[i].source === this.contextConn.sourceId &&
                            this.edges[i].target === this.contextConn.targetId
                        ) {
                            this.$set(this.edges[i], 'label', this.linkForm.label)
                            this.$set(this.edges[i], 'condition', this.linkForm.condition)
                            break
                        }
                    }
                    this.drawLines()
                    this.edgeDialogVisible = false
                }
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
    background-color: #fff;
    cursor: pointer;
    transform: rotate(45deg) scale(0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 40px;
}
.exclusiveGateway i,
.parallelGateWay i,
.manualTask i {
    transform: rotate(-45deg) scale(3);
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
.contextMenu {
    font-size: 12px;
    color: #333;
    text-align: center;
}
.contextMenu div:hover {
    background-color: #eee;
}
</style>
