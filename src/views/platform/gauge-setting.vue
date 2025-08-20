<template>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <div class="header-back" @click="toReturn"><i class="el-icon-arrow-left"></i></div>
                <div class="header-title">{{ title }}</div>
            </div>
            <div class="header-right">
                <el-button class="button-publish" @click="handleScript">脚 本</el-button>
                <el-button class="button-publish" @click="saveSubmit">保 存</el-button>
            </div>
        </div>
        <div class="main" :style="{ height: clientHeight - 60 + 'px' }">
            <div class="function">
                <el-tabs type="border-card" stretch>
                    <el-tab-pane label="组件">
                        <div class="widgets">
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'container')">
                                <img class="icon" src="@/assets/layout/container.svg" />
                                <span>容器</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'card')">
                                <img class="icon" src="@/assets/layout/card.svg" />
                                <span>卡片</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'text')">
                                <img class="icon" src="@/assets/layout/text.svg" />
                                <span>文本</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'tabs')">
                                <img class="icon" src="@/assets/layout/tabs.svg" />
                                <span>标签页</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'image')">
                                <img class="icon" src="@/assets/layout/image.svg" />
                                <span>图片</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'chart')">
                                <img class="icon" src="@/assets/layout/chart.svg" />
                                <span>图表</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'button')">
                                <img class="icon" src="@/assets/layout/button.svg" />
                                <span>按钮</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'input')">
                                <img class="icon" src="@/assets/layout/input.svg" />
                                <span>输入框</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'select')">
                                <img class="icon" src="@/assets/layout/select.svg" />
                                <span>单选选择器</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'multiSelect')">
                                <img class="icon" src="@/assets/layout/multiSelect.svg" />
                                <span>多选选择器</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'datePicker')">
                                <img class="icon" src="@/assets/layout/datePicker.svg" />
                                <span>日期选择器</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'timePicker')">
                                <img class="icon" src="@/assets/layout/timePicker.svg" />
                                <span>时间选择器</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'cascader')">
                                <img class="icon" src="@/assets/layout/cascader.svg" />
                                <span>单选级联</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'multiCascader')">
                                <img class="icon" src="@/assets/layout/multiCascader.svg" />
                                <span>多选级联</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'radio')">
                                <img class="icon" src="@/assets/layout/radio.svg" />
                                <span>单选框</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'checkbox')">
                                <img class="icon" src="@/assets/layout/checkbox.svg" />
                                <span>多选框</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'switch')">
                                <img class="icon" src="@/assets/layout/switch.svg" />
                                <span>开关</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'richText')">
                                <img class="icon" src="@/assets/layout/richText.svg" />
                                <span>富文本</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'upload')">
                                <img class="icon" src="@/assets/layout/upload.svg" />
                                <span>文件上传</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'divider')">
                                <img class="icon" src="@/assets/layout/divider.svg" />
                                <span>分割线</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'rate')">
                                <img class="icon" src="@/assets/layout/rate.svg" />
                                <span>评分</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'slider')">
                                <img class="icon" src="@/assets/layout/slider.svg" />
                                <span>滑块</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'table')">
                                <img class="icon" src="@/assets/layout/table.svg" />
                                <span>表格</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'modal')">
                                <img class="icon" src="@/assets/layout/modal.svg" />
                                <span>对话框</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'link')">
                                <img class="icon" src="@/assets/layout/link.svg" />
                                <span>链接</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'progress')">
                                <img class="icon" src="@/assets/layout/progress.svg" />
                                <span>进度条</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'tree')">
                                <img class="icon" src="@/assets/layout/tree.svg" />
                                <span>树</span>
                            </div>
                            <!-- <div class="tools" @drag="drag" @dragend="dragend($event, 'dropdown')">
								<img class="icon" src="@/assets/layout/dropdown.svg" />
								<span>下拉菜单</span>
							</div> -->
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'listView')">
                                <img class="icon" src="@/assets/layout/listView.svg" />
                                <span>列表</span>
                            </div>
                            <div class="tools" @drag="drag" @dragend="dragend($event, 'signature')">
                                <img class="icon" src="@/assets/layout/signature.svg" />
                                <span>签名</span>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="控件">
                        <div class="widgets">
                            <div
                                class="tools"
                                @drag="drag"
                                @dragend="dragend($event, 'custom', item.name)"
                                v-for="(item, index) in widgets"
                                :key="index"
                            >
                                <img class="icon" :src="item.icon" />
                                <span>{{ item.label }}</span>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div
                id="content"
                class="drag-container"
                @click="changeFocus('click', { i: '-1', styles: config.styles })"
                :class="[currentIndex === '-1' ? 'grid-item-checked' : 'grid-item-unchecked']"
                :style="[config.styles]"
            >
                <el-empty
                    description="从左侧面板拖入组件或区块"
                    v-if="config.layout.length === 0"
                    :image-size="200"
                    style="height: 100%; background: #fff; color: #5e6d82"
                ></el-empty>
                <gaugeComponent
                    :layout="config.layout"
                    :currentIndex="currentIndex"
                    @changeFocus="changeFocus"
                    @move="move"
                    @resize="resize"
                    v-else
                />
            </div>
            <div class="setting">
                <el-tabs type="border-card" stretch>
                    <el-tab-pane label="属性">
                        <el-form :model="attribute" ref="attribute" size="medium" style="width: 215px; padding: 10px">
                            <div v-if="attribute.i && attribute.i != -1">
                                <span id="copycode">{{ attribute.i }}</span>
                                <i
                                    class="el-icon-copy-document"
                                    style="float: right; cursor: pointer"
                                    @click="handleCopy"
                                ></i>
                            </div>
                            <el-form-item label=" 打开值" v-if="attribute.type === 'switch'">
                                <el-input v-model="attribute.activeValue" placeholder="请输入打开值"></el-input>
                            </el-form-item>
                            <el-form-item label=" 多选" v-if="attribute.type === 'upload'">
                                <el-switch v-model="attribute.multiple"></el-switch>
                            </el-form-item>
                            <el-form-item label=" 关闭值" v-if="attribute.type === 'switch'">
                                <el-input v-model="attribute.inactiveValue" placeholder="请输入关闭值"></el-input>
                            </el-form-item>
                            <el-form-item label="日期格式" v-if="attribute.type === 'datePicker'">
                                <el-select
                                    v-model="attribute.dateFormat"
                                    placeholder="请选择日期格式"
                                    @change="handleDateFormat"
                                >
                                    <el-option label="年" value="year"></el-option>
                                    <el-option label="年-月" value="month"></el-option>
                                    <el-option label="年-月-日" value="date"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="数值类型" v-if="attribute.type === 'input'">
                                <el-select
                                    v-model="attribute.dataType"
                                    placeholder="请选择值类型"
                                    @change="handleDataTypeChange"
                                >
                                    <el-option label="文本" value="text"></el-option>
                                    <el-option label="数字" value="number"></el-option>
                                    <el-option label="密码" value="password"></el-option>
                                    <el-option label="多行文本" value="textarea"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="标签文本"
                                v-if="
                                    attribute.type === 'input' ||
                                    attribute.type === 'select' ||
                                    attribute.type === 'multiSelect' ||
                                    attribute.type === 'datePicker' ||
                                    attribute.type === 'timePicker' ||
                                    attribute.type === 'cascader' ||
                                    attribute.type === 'multiCascader' ||
                                    attribute.type === 'radio' ||
                                    attribute.type === 'checkbox' ||
                                    attribute.type === 'switch' ||
                                    attribute.type === 'rate' ||
                                    attribute.type === 'slider'
                                "
                            >
                                <el-input v-model="attribute.label" placeholder="请输入标签文本"></el-input>
                            </el-form-item>
                            <el-form-item
                                label="占位符"
                                v-if="
                                    attribute.type === 'input' ||
                                    attribute.type === 'select' ||
                                    attribute.type === 'multiSelect' ||
                                    attribute.type === 'datePicker' ||
                                    attribute.type === 'timePicker' ||
                                    attribute.type === 'cascader' ||
                                    attribute.type === 'multiCascader' ||
                                    attribute.type === 'richText'
                                "
                            >
                                <el-input v-model="attribute.placeholder" placeholder="请输入占位符"></el-input>
                            </el-form-item>
                            <el-form-item
                                label="对齐方式"
                                v-if="
                                    attribute.type === 'input' ||
                                    attribute.type === 'select' ||
                                    attribute.type === 'multiSelect' ||
                                    attribute.type === 'datePicker' ||
                                    attribute.type === 'timePicker' ||
                                    attribute.type === 'cascader' ||
                                    attribute.type === 'multiCascader' ||
                                    attribute.type === 'radio' ||
                                    attribute.type === 'checkbox' ||
                                    attribute.type === 'switch' ||
                                    attribute.type === 'rate' ||
                                    attribute.type === 'slider'
                                "
                            >
                                <el-select
                                    v-model="attribute.labelPosition"
                                    placeholder="请选择对齐方式"
                                    @change="handleLabelPosition"
                                >
                                    <el-option label="左对齐" value="left"></el-option>
                                    <el-option label="右对齐" value="right"></el-option>
                                    <el-option label="顶部对齐" value="top"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="标签宽度"
                                v-if="
                                    (attribute.type === 'input' ||
                                        attribute.type === 'select' ||
                                        attribute.type === 'multiSelect' ||
                                        attribute.type === 'datePicker' ||
                                        attribute.type === 'timePicker' ||
                                        attribute.type === 'cascader' ||
                                        attribute.type === 'multiCascader' ||
                                        attribute.type === 'radio' ||
                                        attribute.type === 'checkbox' ||
                                        attribute.type === 'switch' ||
                                        attribute.type === 'rate' ||
                                        attribute.type === 'slider') &&
                                    attribute.labelPosition != 'top'
                                "
                            >
                                <el-input v-model="attribute.labelWidth" placeholder="请输入标签宽度"></el-input>
                            </el-form-item>
                            <el-form-item
                                label="必填"
                                v-if="
                                    attribute.type === 'input' ||
                                    attribute.type === 'select' ||
                                    attribute.type === 'multiSelect' ||
                                    attribute.type === 'datePicker' ||
                                    attribute.type === 'timePicker' ||
                                    attribute.type === 'cascader' ||
                                    attribute.type === 'multiCascader' ||
                                    attribute.type === 'radio' ||
                                    attribute.type === 'checkbox' ||
                                    attribute.type === 'switch' ||
                                    attribute.type === 'rate' ||
                                    attribute.type === 'slider'
                                "
                            >
                                <el-switch v-model="attribute.required"></el-switch>
                            </el-form-item>
                            <el-form-item label="标题" v-if="attribute.type === 'card' || attribute.type === 'chart'">
                                <el-input
                                    v-model="attribute.title"
                                    placeholder="请输入标题"
                                    @blur="handleDataChange"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="类型" v-if="attribute.type === 'chart'">
                                <el-select
                                    v-model="attribute.chartType"
                                    placeholder="请选择类型"
                                    @change="handleDataChange"
                                >
                                    <el-option label="柱状图" value="bar"></el-option>
                                    <el-option label="折线图" value="line"></el-option>
                                    <el-option label="饼状图" value="pie"></el-option>
                                    <el-option label="漏斗图" value="funnel"></el-option>
                                    <el-option label="仪表盘" value="gauge"></el-option>
                                    <el-option label="折柱混合" value="mix-line-bar"></el-option>
                                    <el-option label="条形图" value="bar-y-category"></el-option>
                                    <el-option label="环形图" value="pie-doughnut"></el-option>
                                    <el-option label="地图" value="map"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="标题对齐" v-if="attribute.type === 'chart'">
                                <el-select
                                    v-model="attribute.titleAlign"
                                    placeholder="请选择标题对齐"
                                    @change="handleDataChange"
                                >
                                    <el-option label="左" value="left"></el-option>
                                    <el-option label="居中" value="center"></el-option>
                                    <el-option label="右" value="right"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="数据源" v-if="attribute.type === 'chart'">
                                <el-select v-model="attribute.dataSourceType" placeholder="请选择数据源" clearable>
                                    <el-option label="表" value="dataModel"></el-option>
                                    <el-option label="视图" value="view"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="数据源"
                                v-if="
                                    attribute.type === 'radio' ||
                                    attribute.type === 'checkbox' ||
                                    attribute.type === 'select' ||
                                    attribute.type === 'multiSelect'
                                "
                            >
                                <el-select
                                    v-model="attribute.dataModel"
                                    placeholder="请选择数据源"
                                    filterable
                                    @change="queryDicDetail(attribute)"
                                >
                                    <el-option
                                        :label="item.name"
                                        :value="item.id"
                                        v-for="(item, index) in dicClassifyOptions"
                                        :key="index"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="数据模型"
                                v-if="attribute.type === 'chart' && attribute.dataSourceType === 'dataModel'"
                            >
                                <el-select
                                    v-model="attribute.dataModel"
                                    placeholder="请选择数据模型"
                                    clearable
                                    filterable
                                    @change="handleTableChange"
                                >
                                    <el-option
                                        :label="item.remark + '(' + item.name + ')'"
                                        :value="item.name"
                                        v-for="(item, index) in tableOptions"
                                        :key="index"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="数据模型"
                                v-if="attribute.type === 'chart' && attribute.dataSourceType === 'view'"
                            >
                                <el-select
                                    v-model="attribute.dataModel"
                                    placeholder="请选择数据模型"
                                    clearable
                                    filterable
                                    @change="handleViewChange"
                                >
                                    <el-option
                                        :label="item.remark + '(' + item.name + ')'"
                                        :value="item.name"
                                        v-for="(item, index) in viewOptions"
                                        :key="index"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="维度(X轴)"
                                v-if="
                                    attribute.type === 'chart' &&
                                    (attribute.dataSourceType === 'dataModel' || attribute.dataSourceType === 'view')
                                "
                            >
                                <el-select
                                    v-model="attribute.dimension"
                                    placeholder="请选择维度(X轴)"
                                    clearable
                                    filterable
                                    multiple
                                >
                                    <el-option
                                        :label="item.remark + '(' + item.name + ')'"
                                        :value="item.remark + '|' + item.name"
                                        v-for="(item, index) in fieldOptions"
                                        :key="index"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="数值(Y轴)"
                                v-if="
                                    attribute.type === 'chart' &&
                                    (attribute.dataSourceType === 'dataModel' || attribute.dataSourceType === 'view')
                                "
                            >
                                <el-select
                                    v-model="attribute.metrics"
                                    placeholder="请选择数值(Y轴)"
                                    clearable
                                    filterable
                                    multiple
                                    @change="handleDataChange"
                                >
                                    <el-option
                                        :label="item.remark + '(' + item.name + ')'"
                                        :value="item.remark + '|' + item.name"
                                        v-for="(item, index) in fieldOptions"
                                        :key="index"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                v-if="
                                    attribute.type === 'chart' &&
                                    (attribute.dataSourceType === 'dataModel' || attribute.dataSourceType === 'view')
                                "
                            >
                                <el-button icon="el-icon-circle-plus" style="width: 100%" @click="handleFilterData"
                                    >设置筛选条件</el-button
                                >
                            </el-form-item>
                            <el-form-item label="文本" v-if="attribute.type === 'text'">
                                <el-input
                                    type="textarea"
                                    v-model="attribute.value"
                                    placeholder="请输入文本"
                                    @blur="handleDataChange"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="文本" v-if="attribute.type === 'button' || attribute.type === 'link'">
                                <el-input v-model="attribute.text" placeholder="请输入文本"></el-input>
                            </el-form-item>
                            <el-form-item
                                label="字体颜色"
                                v-if="attribute.type === 'text' || attribute.type === 'button'"
                            >
                                <el-color-picker v-model="attribute.styles.color"></el-color-picker>
                            </el-form-item>
                            <el-form-item label="标签组" v-if="attribute.type === 'tabs'">
                                <el-input
                                    v-model="tab.name"
                                    placeholder="请输入标签"
                                    v-for="(tab, index) in attribute.tabs"
                                    :key="index"
                                    style="margin-bottom: 15px"
                                >
                                    <i
                                        slot="suffix"
                                        class="el-input__icon el-icon-delete"
                                        @click="deleteTab(index)"
                                    ></i>
                                </el-input>
                            </el-form-item>
                            <el-form-item
                                label=""
                                v-if="attribute.type === 'tabs'"
                                style="margin-top: -15px; float: right"
                            >
                                <el-button
                                    @click="addTab"
                                    v-if="attribute.type === 'tabs'"
                                    icon="el-icon-plus"
                                    size="medium"
                                    >添加</el-button
                                >
                            </el-form-item>
                            <el-form-item label="对齐方式" v-if="attribute.type === 'text'">
                                <el-select v-model="attribute.styles['justify-content']" placeholder="请选择对齐方式">
                                    <el-option label="左" value="left"></el-option>
                                    <el-option label="居中" value="center"></el-option>
                                    <el-option label="右" value="right"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="垂直对齐" v-if="attribute.type === 'text'">
                                <el-select v-model="attribute.styles['align-items']" placeholder="请选择垂直对齐">
                                    <el-option label="上" value="flex-start"></el-option>
                                    <el-option label="中" value="center"></el-option>
                                    <el-option label="下" value="flex-end"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="分割线方向" v-if="attribute.type === 'divider'">
                                <el-select v-model="attribute.direction" placeholder="请选择分割线方向">
                                    <el-option label="水平" value="horizontal"></el-option>
                                    <el-option label="垂直" value="vertical"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="层次码"
                                v-if="
                                    attribute.type === 'cascader' ||
                                    attribute.type === 'multiCascader' ||
                                    attribute.type === 'tree'
                                "
                            >
                                <el-input v-model="attribute.levelCode" placeholder="请输入层次码"></el-input>
                            </el-form-item>
                            <div v-if="attribute.type === 'table'" style="font-size: 14px; margin-top: 15px">
                                表格列
                                <i
                                    class="el-icon-plus"
                                    style="float: right; cursor: pointer; color: #3296fa"
                                    @click="addColumnHandle"
                                >
                                    增加列</i
                                >
                            </div>
                            <el-form-item v-if="attribute.type === 'table'">
                                <el-tree :data="attribute.columns" node-key="prop" draggable>
                                    <div class="tree-node" slot-scope="{ node, data }">
                                        <span>{{ node.label }}</span>
                                        <el-popover placement="left" width="320" trigger="click" :visible-arrow="false">
                                            <el-form
                                                label-position="left"
                                                label-width="80px"
                                                size="medium"
                                                style="margin: 10px 0px"
                                            >
                                                <el-form-item label="字段名">
                                                    <el-input v-model="data.prop"></el-input>
                                                </el-form-item>
                                                <el-form-item label="标题">
                                                    <el-input v-model="data.label"></el-input>
                                                </el-form-item>
                                                <el-form-item label="类型">
                                                    <el-select v-model="data.type">
                                                        <el-option label="纯文本" value="text"></el-option>
                                                        <el-option label="链接" value="link"></el-option>
                                                        <el-option label="标签" value="tag"></el-option>
                                                        <el-option label="状态点" value="status"></el-option>
                                                        <el-option label="图片" value="image"></el-option>
                                                        <el-option label="html" value="html"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item label="对齐方式">
                                                    <el-select v-model="data.align">
                                                        <el-option label="左" value="left"></el-option>
                                                        <el-option label="居中" value="center"></el-option>
                                                        <el-option label="右" value="right"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item label="排序">
                                                    <el-switch v-model="data.sortable"></el-switch>
                                                </el-form-item>
                                            </el-form>
                                            <i class="el-icon-setting" slot="reference" style="margin-left: 15px"></i>
                                        </el-popover>
                                        <i
                                            class="el-icon-delete"
                                            @click="() => removeNode(node, data)"
                                            style="color: red; margin-left: 15px"
                                        ></i>
                                    </div>
                                </el-tree>
                            </el-form-item>
                            <el-form-item label="多选" v-if="attribute.type === 'table'">
                                <el-switch v-model="attribute.allowMultiRowSelect"></el-switch>
                            </el-form-item>
                            <el-form-item label="分页" v-if="attribute.type === 'table'">
                                <el-switch v-model="attribute.showPagination"></el-switch>
                            </el-form-item>
                            <el-form-item label="表头" v-if="attribute.type === 'table'">
                                <el-switch v-model="attribute.showHeader"></el-switch>
                            </el-form-item>
                            <el-form-item label="模式" v-if="attribute.type === 'image'">
                                <el-select v-model="attribute.fit" placeholder="请选择模式" filterable>
                                    <el-option label="fill" value="fill"></el-option>
                                    <el-option label="contain" value="contain"></el-option>
                                    <el-option label="cover" value="cover"></el-option>
                                    <el-option label="none" value="none"></el-option>
                                    <el-option label="scale-down" value="scale-down"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="文件" v-if="attribute.type === 'image'">
                                <el-upload
                                    :limit="1"
                                    :action="action"
                                    :headers="headers"
                                    :file-list="attribute.fileList"
                                    list-type="picture-card"
                                    :before-upload="beforeUpload"
                                    :class="attribute.src ? 'upload-disabled' : ''"
                                    :on-success="handleFileSuccess"
                                >
                                    <i class="el-icon-plus"></i>
                                    <div slot="file" slot-scope="{ file }">
                                        <img class="el-upload-list__item-thumbnail" :src="attribute.src" />
                                        <span class="el-upload-list__item-actions">
                                            <span class="el-upload-list__item-delete" @click="handleFileRemove(file)">
                                                <i class="el-icon-delete"></i>
                                            </span>
                                        </span>
                                    </div>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="名称" v-if="attribute.type === 'custom'">
                                <el-input v-model="attribute.name" disabled></el-input>
                            </el-form-item>
                            <div v-if="attribute.type === 'button'">事件</div>
                            <el-form-item
                                label="On Click"
                                v-if="
                                    attribute.type === 'button' ||
                                    attribute.type === 'link' ||
                                    attribute.type === 'image'
                                "
                            >
                                <el-select v-model="attribute.click" placeholder="Select action" filterable clearable>
                                    <el-option
                                        :label="index"
                                        :value="index"
                                        v-for="(query, index) in jsApi"
                                        :key="index"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="On Change"
                                v-if="
                                    attribute.type === 'select' ||
                                    attribute.type === 'multiSelect' ||
                                    attribute.type === 'datePicker' ||
                                    attribute.type === 'timePicker' ||
                                    attribute.type === 'cascader' ||
                                    attribute.type === 'multiCascader' ||
                                    attribute.type === 'radio' ||
                                    attribute.type === 'checkbox' ||
                                    attribute.type === 'switch' ||
                                    attribute.type === 'rate' ||
                                    attribute.type === 'slider'
                                "
                            >
                                <el-select v-model="attribute.change" placeholder="Select action" filterable clearable>
                                    <el-option
                                        :label="index"
                                        :value="index"
                                        v-for="(query, index) in jsApi"
                                        :key="index"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Row Dblclick" v-if="attribute.type === 'table'">
                                <el-select
                                    v-model="attribute.rowDblclick"
                                    placeholder="Select action"
                                    filterable
                                    clearable
                                >
                                    <el-option
                                        :label="index"
                                        :value="index"
                                        v-for="(query, index) in jsApi"
                                        :key="index"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="On PageChange"
                                v-if="attribute.type === 'table' || attribute.showPagination"
                            >
                                <el-select
                                    v-model="attribute.pageChange"
                                    placeholder="Select action"
                                    filterable
                                    clearable
                                >
                                    <el-option
                                        :label="index"
                                        :value="index"
                                        v-for="(query, index) in jsApi"
                                        :key="index"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="attribute.i && attribute.i != -1">
                                <el-button type="danger" icon="el-icon-delete" @click="deleteHandle" style="width: 100%"
                                    >删除</el-button
                                >
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="样式">
                        <el-form :model="attribute" ref="attribute" size="medium" style="width: 215px; padding: 10px">
                            <el-form-item label="样式编辑" v-if="attribute.i">
                                <el-button size="small" icon="el-icon-edit" @click="showCustomStyles">CSS</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <el-dialog title="设置" width="900px" :visible.sync="scriptVisible" :close-on-click-modal="false">
            <el-form :model="selectedRow" label-width="80px" ref="selectedRowForm">
                <el-form label-width="15px" v-if="selectedRow.type === 'style'">
                    <el-form-item>
                        <codemirrorJavascript
                            ref="codemirrorStyle"
                            v-model="selectedRow.script"
                            v-if="selectedRow.type === 'style'"
                            placeholder="请输入样式"
                        />
                    </el-form-item>
                </el-form>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="scriptVisible = false">取消</el-button>
                <el-button type="primary" @click="scriptSubmit">保存</el-button>
            </div>
        </el-dialog>
        <el-drawer title="设置" :visible.sync="jsVisible" direction="ltr" size="900px" :before-close="handleClose">
            <div style="height: 100%">
                <codemirrorJavascript
                    ref="codemirrorJavascript"
                    v-model="javascript"
                    placeholder="请输入脚本"
                    v-if="jsVisible && drawerType === 'js'"
                    :style="{ height: clientHeight - 56 + 'px' }"
                />
            </div>
        </el-drawer>
        <el-dialog title="数据筛选" width="900px" :visible.sync="filterDataVisible" :close-on-click-modal="false">
            <div>
                <el-button icon="el-icon-circle-plus-outline" size="small" type="text" @click="addFilterData"
                    >添加条件</el-button
                >
            </div>
            <el-table :data="attribute.filterData" :show-header="false" style="width: 100%; margin-top: 15px">
                <el-table-column align="center">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.field" clearable filterable placeholder="请选择">
                            <el-option
                                :label="item.remark + '(' + item.name + ')'"
                                :value="item.name + '|' + item.type"
                                v-for="(item, index) in fieldOptions"
                                :key="index"
                            ></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="110px">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.decider">
                            <el-option label="等于" value="="></el-option>
                            <el-option label="不等于" value="!="></el-option>
                            <el-option label="大于" value=">"></el-option>
                            <el-option label="大于等于" value=">="></el-option>
                            <el-option label="小于" value="<"></el-option>
                            <el-option label="小于等于" value="<="></el-option>
                            <el-option label="不为空" value=" is not null"></el-option>
                            <el-option label="包含" value="in"></el-option>
                            <el-option label="长度" value="length"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="110px">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.type">
                            <el-option label="变量" value="variable"></el-option>
                            <el-option label="表达式" value="expression"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.value" placeholder="请输入"></el-input>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="50px">
                    <template slot-scope="scope">
                        <i
                            class="el-icon-remove-outline"
                            @click="deleteFilteData(scope.$index)"
                            style="font-size: 20px"
                        ></i>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="filterDataVisible = false">取消</el-button>
                <el-button type="primary" @click="filterDataSubmit">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import md5 from 'md5'
import codemirrorXml from '@/views/components/codemirror/xml'
import codemirrorJavascript from '@/views/components/codemirror/javascript'
import gaugeComponent from '@/views/components/gauge/gauge-component'
import china from '@/utils/china.json'
export default {
    components: {
        codemirrorXml,
        codemirrorJavascript,
        gaugeComponent
    },
    data() {
        return {
            clientHeight: 0,
            action: this.$axios.defaults.baseURL + '/upload/putObject/oss',
            headers: {
                Authorization: window.localStorage.getItem('Authorization')
            },
            currentIndex: '-1',
            config: {
                styles: {},
                layout: [],
                queries: []
            },
            attribute: {},
            scriptVisible: false,
            selectedRow: {},
            queryData: {},
            mouseInWidget: false,
            key: '',
            jsVisible: false,
            javascript: '',
            jsApi: {},
            drawerType: '',
            dicClassifyOptions: [],
            tableOptions: [],
            viewOptions: [],
            fieldOptions: [],
            filterDataVisible: false,
            widgets: [
                {
                    name: 'work',
                    label: '我的工作',
                    icon: require('@/assets/layout/work.svg')
                },
                {
                    name: 'quick',
                    label: '快捷入口',
                    icon: require('@/assets/layout/quick.svg')
                }
            ]
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
    created() {
        let timestamp = Date.now()
        this.headers.Sign = md5(
            'upload/putObject/oss?timestamp=' + timestamp + '&key=yVwlsbIrY3q22EnoYYM4nR5zqTmqed05'
        ).toUpperCase()
        this.headers.Timestamp = timestamp
    },
    mounted() {
        this.queryById()
        this.querydicClassify()
        this.queryTable()
        // this.queryView()
    },
    methods: {
        async querydicClassify() {
            let res = await this.$axios.get('dicClassify/queryDisplay')
            if (res.data.code === 200) {
                this.dicClassifyOptions = res.data.data
            }
        },
        async queryTable() {
            let res = await this.$axios.get('businessTable/queryAll')
            if (res.data.code == 200) {
                this.tableOptions = res.data.data
            }
        },
        async queryView() {
            let res = await this.$axios.get('view/queryAll')
            if (res.data.code == 200) {
                this.viewOptions = res.data.data
            }
        },
        listToTreeByRule(arr, rule) {
            let ruleArray = rule.split('')
            let ruleList = []
            let ruleMap = {}
            for (let i = 0; i < ruleArray.length; i++) {
                if (i == 0) {
                    ruleList.push(parseInt(ruleArray[i]))
                    ruleMap[ruleArray[i]] = i
                } else {
                    ruleList.push(ruleList[i - 1] + parseInt(ruleArray[i]))
                    ruleMap[String(ruleList[i - 1] + parseInt(ruleArray[i]))] = i
                }
            }

            let r = []
            let hash = {}
            // 将数组转为Object的形式，value为数组中的id
            for (let i = 0; i < arr.length; i++) {
                let json = arr[i]
                hash[json.value] = json
            }
            // 遍历结果集
            for (let j = 0; j < arr.length; j++) {
                // 单条记录
                let aVal = arr[j]
                // 在hash中取出value为单条记录中pid的值
                let curCode = String(aVal.value)

                let index = ruleMap[curCode.length]

                let curKey = null
                if (index != 0) {
                    curKey = curCode.substring(0, ruleList[index - 1])
                }
                let hashVP = hash[curKey]
                // 如果记录的pid存在，则说明它有父节点，将她添加到孩子节点的集合中
                if (hashVP) {
                    // 检查是否有children属性
                    if (hashVP.hasOwnProperty('children')) {
                        let ch = hashVP.children
                        ch.push(aVal)
                        hashVP.children = ch
                    } else {
                        let ch = []
                        ch.push(aVal)
                        hashVP.children = ch
                    }
                } else {
                    r.push(aVal)
                }
            }
            return r
        },
        toReturn() {
            this.$router.go(-1)
        },
        resolveScript() {
            let result = {}
            if (this.javascript) {
                let splitArray = this.javascript.split('export function')
                for (let i = 0; i < splitArray.length; i++) {
                    if (splitArray[i]) {
                        let startParams = splitArray[i].indexOf('(')
                        let endParams = splitArray[i].indexOf(')')
                        let params = []
                        let paramsSlit = splitArray[i].substring(startParams + 1, endParams).split(',')
                        for (let j = 0; j < paramsSlit.length; j++) {
                            if (paramsSlit[j]) {
                                params.push(paramsSlit[j].trim())
                            }
                        }
                        let startBody = splitArray[i].indexOf('{')
                        let endBody = splitArray[i].lastIndexOf('}')
                        result[splitArray[i].substring(0, startParams).trim()] = {
                            params: params,
                            body: splitArray[i].substring(startBody + 1, endBody)
                        }
                    }
                }
            }
            this.jsApi = result
        },
        addFunc(name, params, body) {
            this[name] = function () {
                let func = null
                if (params.length === 0) {
                    func = new Function(body).bind(this)
                } else if (params.length === 1) {
                    func = new Function(params[0], body).bind(this)
                } else if (params.length === 2) {
                    func = new Function(params[0], params[1], body).bind(this)
                } else if (params.length === 3) {
                    func = new Function(params[0], params[1], params[2], body).bind(this)
                } else if (params.length === 4) {
                    func = new Function(params[0], params[1], params[2], params[3], body).bind(this)
                } else if (params.length === 5) {
                    func = new Function(params[0], params[1], params[2], params[3], params[4], body).bind(this)
                }
                let argLength = arguments.length
                if (argLength === 0) {
                    func()
                } else if (argLength === 1) {
                    func(arguments[0])
                } else if (argLength === 2) {
                    func(arguments[0], arguments[1])
                } else if (argLength === 3) {
                    func(arguments[0], arguments[1], arguments[2])
                } else if (argLength === 4) {
                    func(arguments[0], arguments[1], arguments[2], arguments[3])
                } else if (argLength === 5) {
                    func(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4])
                }
            }
        },
        execMounted() {
            if (this.jsApi.hasOwnProperty('mounted')) {
                this.mounted()
            }
        },
        async queryById() {
            let res = await this.$axios.get('gauge/queryById/' + this.$route.query.id)
            if (res.data.code == 200) {
                this.javascript = res.data.data.script
                if (res.data.data.config) {
                    this.config = JSON.parse(res.data.data.config)
                    this.attribute = {
                        i: '-1',
                        styles: this.config.styles
                    }
                    this.recursionAttribute(this.config.layout)
                }
                this.resolveScript()
                for (let key in this.jsApi) {
                    this.addFunc(key, this.jsApi[key].params, this.jsApi[key].body)
                }
                this.execMounted()
            }
        },
        recursionAttribute(layout) {
            for (let i = 0; i < layout.length; i++) {
                let item = layout[i]
                this[item.i] = item
                if (item.type === 'tabs') {
                    for (let j = 0; j < item.tabs.length; j++) {
                        let tab = item.tabs[j]
                        if (tab.children) {
                            this.recursionAttribute(tab.children)
                        }
                    }
                } else if (item.type === 'chart') {
                    if (item.dataSourceType === 'dataModel' || item.dataSourceType === 'view') {
                        this.$nextTick(() => {
                            var filterDataSql = ''
                            if (item.filterData) {
                                for (let i = 0; i < item.filterData.length; i++) {
                                    let filterDataItem = item.filterData[i]
                                    if (filterDataItem['field'] && filterDataItem['decider'] === ' is not null') {
                                        let field = filterDataItem['field'].split('|')[0]
                                        if (i != 0) {
                                            filterDataSql = filterDataSql + ' ' + filterDataItem['condition'] + ' '
                                        }
                                        filterDataSql = filterDataSql + field + filterDataItem['decider']
                                    } else if (filterDataItem['field'] && filterDataItem['decider'] === 'length') {
                                        let field = filterDataItem['field'].split('|')[0]
                                        if (i != 0) {
                                            filterDataSql = filterDataSql + ' ' + filterDataItem['condition'] + ' '
                                        }
                                        filterDataSql =
                                            filterDataSql +
                                            filterDataItem['decider'] +
                                            '(' +
                                            field +
                                            ')=' +
                                            filterDataItem['value']
                                    } else if (filterDataItem['field'] && filterDataItem['value']) {
                                        let field = filterDataItem['field'].split('|')[0]
                                        let type = filterDataItem['field'].split('|')[1]
                                        if (i != 0) {
                                            filterDataSql = filterDataSql + ' ' + filterDataItem['condition'] + ' '
                                        }
                                        filterDataSql = filterDataSql + field + ' ' + filterDataItem['decider'] + ' '
                                        if (filterDataItem['type'] == 'variable') {
                                            if (filterDataItem['decider'] === 'in') {
                                                filterDataSql =
                                                    filterDataSql + '(' + filterDataItem['value'] + ')' + ' '
                                            } else {
                                                if (type === 'varchar') {
                                                    filterDataSql = filterDataSql + "'" + filterDataItem['value'] + "'"
                                                } else {
                                                    filterDataSql = filterDataSql + filterDataItem['value']
                                                }
                                            }
                                        } else if (filterDataItem['type'] == 'expression') {
                                            if (type === 'varchar') {
                                                filterDataSql =
                                                    filterDataSql + "'" + eval(filterDataItem['value']) + "'"
                                            } else {
                                                filterDataSql = filterDataSql + eval(filterDataItem['value'])
                                            }
                                        }
                                    }
                                }
                            }
                            let params = {
                                tableName: item.dataModel,
                                dimension: item.dimension ? item.dimension.toString() : '',
                                metrics: item.metrics.toString(),
                                filterData: filterDataSql
                            }
                            this.$axios.post('gauge/chartSql', params).then(res => {
                                if (res.data.code == 200) {
                                    item.data = res.data.data
                                    this.reloadChart(item)
                                }
                            })
                        })
                    }
                    if (item.children) {
                        this.recursionAttribute(item.children)
                    }
                } else if (
                    item.type === 'radio' ||
                    item.type === 'checkbox' ||
                    item.type === 'select' ||
                    item.type === 'multiSelect'
                ) {
                    if (item.dataModel) {
                        this.queryDicDetail(item)
                    }
                } else if (item.type === 'table') {
                    item.data = []
                } else if (item.type === 'custom') {
                    try {
                        item.component = require(`@/views/templates/${item.name}`).default
                    } catch (error) {}
                } else {
                    if (item.children) {
                        this.recursionAttribute(item.children)
                    }
                }
            }
        },
        async queryDicDetail(item) {
            let res = await this.$axios.get('dicDetail/queryDisplay?classifyId=' + item.dataModel)
            if (res.data.code === 200) {
                let result = []
                for (let i = 0; i < res.data.data.length; i++) {
                    result.push({
                        label: res.data.data[i].name,
                        value: res.data.data[i].code
                    })
                }
                item.data = result
            }
        },
        recursionData(layout, appointName) {
            for (let i = 0; i < layout.length; i++) {
                let item = layout[i]
                if (item.type === 'chart') {
                    if (item.data && item.data.indexOf(appointName) != -1) {
                        this.reloadChart(item)
                    }
                } else if (item.type === 'text') {
                    if (item.value && item.value.indexOf(appointName) != -1) {
                        try {
                            let pattern = /\{\{(.*?)\}\}/g
                            var matches = item.value.match(pattern)
                            let text = item.value
                            if (matches) {
                                for (let i = 0; i < matches.length; i++) {
                                    let matche = matches[i]
                                    let key = matche.replace(/{{/g, '').replace(/}}/g, '')
                                    text = text.replace(matche, eval(`this.queryData.${key}`))
                                }
                            }
                            this.$set(item, 'text', text.replace(/undefined/g, ''))
                        } catch (e) {
                            console.log(e)
                            this.$set(item, 'text', item.value)
                        }
                    }
                }
                if (item.type === 'tabs') {
                    for (let j = 0; j < item.tabs.length; j++) {
                        let tab = item.tabs[j]
                        if (tab.children) {
                            this.recursionData(tab.children, appointName)
                        }
                    }
                } else {
                    if (item.children) {
                        this.recursionData(item.children, appointName)
                    }
                }
            }
        },
        changeFocus(type, item) {
            this.currentIndex = item.i
            this.attribute = item
            if (item.type === 'chart') {
                if (item.dataSourceType === 'dataModel') {
                    this.handleTableChange(item.dataModel)
                } else if (item.dataSourceType === 'view') {
                    this.handleViewChange(item.dataModel)
                }
            }
        },
        saveSubmit() {
            let params = {
                id: this.$route.query.id,
                config: JSON.stringify(this.config),
                script: this.javascript
            }
            this.$axios.post('gauge/update', params).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('保存成功')
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        scriptSubmit() {
            try {
                if (this.selectedRow.i === '-1') {
                    this.config.styles = JSON.parse(this.selectedRow.script)
                }
                this.attribute.styles = JSON.parse(this.selectedRow.script)
                this.scriptVisible = false
            } catch (error) {
                this.$message.error('json语法错误')
            }
        },
        drag(e) {
            let parentRect = document.getElementById('content').getBoundingClientRect()
            let mouseInGrid = false
            if (
                e.clientX > parentRect.left &&
                e.clientX < parentRect.right &&
                e.clientY > parentRect.top &&
                e.clientY < parentRect.bottom
            ) {
                mouseInGrid = true
            }
            if (mouseInGrid) {
                // 判断是否在组件上
                this.recursionDrag(this.config.layout, e, parentRect)
            }
        },
        recursionDrag(layout, e, parentRect) {
            for (let i = 0; i < layout.length; i++) {
                let item = layout[i]
                if (
                    item.type === 'container' ||
                    item.type === 'card' ||
                    item.type === 'tabs' ||
                    item.type === 'listView'
                ) {
                    let minY = 0
                    let maxY = 0
                    if (item.type === 'container') {
                        minY = e.clientY - parentRect.top > item.y * 18
                        maxY = e.clientY - parentRect.top < item.y * 18 + item.h * 18
                    } else if (item.type === 'card') {
                        minY = e.clientY - parentRect.top > item.y * 18 + 58
                        maxY = e.clientY - parentRect.top < item.y * 18 + item.h * 18
                    } else if (item.type === 'tabs') {
                        minY = e.clientY - parentRect.top > item.y * 18 + 39
                        maxY = e.clientY - parentRect.top < item.y * 18 + item.h * 18
                    } else if (item.type === 'listView') {
                        minY = e.clientY - parentRect.top > item.y * 18
                        maxY = e.clientY - parentRect.top < item.y * 18 + item.h * 18
                    }
                    if (
                        e.clientX - parentRect.left > (item.x * parentRect.width) / 24 &&
                        e.clientX - parentRect.left <
                            (item.x * parentRect.width) / 24 + (item.w * parentRect.width) / 24 &&
                        minY &&
                        maxY
                    ) {
                        document.getElementById(item.i).style.border = '2px solid #3296fa'
                    } else {
                        document.getElementById(item.i).style.border = 'none'
                    }
                }
                if (item.type === 'tabs') {
                    for (let j = 0; j < item.tabs.length; j++) {
                        let tab = item.tabs[j]
                        if (tab.children && item.selectedTab === tab.name) {
                            this.recursionDrag(tab.children, e, parentRect)
                            break
                        }
                    }
                } else {
                    if (item.children) {
                        this.recursionDrag(item.children, e, parentRect)
                    }
                }
            }
        },
        dragend(e, type, name) {
            let parentRect = document.getElementById('content').getBoundingClientRect()
            let item = {
                type: type,
                x: parseInt((e.clientX - parentRect.left) / (parentRect.width / 24)),
                y: parseInt((e.clientY - parentRect.top) / 18)
            }
            if (type === 'container') {
                item.i = 'container' + '_' + Math.random().toString(36).slice(-2)
                item.w = 8
                item.h = 40
                item.minH = 2
                item.isVisible = true
                item.styles = {
                    'background-color': '#fff',
                    'border-radius': '8px',
                    border: '1px solid #D7D9E0'
                }
            } else if (type === 'listView') {
                item.i = 'listView' + '_' + Math.random().toString(36).slice(-2)
                item.w = 8
                item.h = 40
                item.minH = 2
                item.isVisible = true
                item.styles = {
                    'background-color': '#fff',
                    'border-radius': '8px',
                    border: '1px solid #D7D9E0'
                }
            } else if (type === 'card') {
                item.i = 'card' + '_' + Math.random().toString(36).slice(-2)
                item.w = 8
                item.h = 40
                item.minH = 2
                item.isVisible = true
                item.title = '标题'
                item.styles = {
                    'border-radius': '8px'
                }
            } else if (type === 'tabs') {
                item.i = 'tabs' + '_' + Math.random().toString(36).slice(-2)
                item.w = 8
                item.h = 40
                item.minH = 2
                item.isVisible = true
                item.tabs = [
                    {
                        name: '标签1'
                    },
                    {
                        name: '标签2'
                    }
                ]
                item.defaultTab = '标签1'
                item.selectedTab = '标签1'
                item.styles = {
                    'border-radius': '8px'
                }
            } else if (type === 'text') {
                item.i = 'text' + '_' + Math.random().toString(36).slice(-2)
                item.w = 4
                item.h = 6
                item.minH = 2
                item.isVisible = true
                item.value = '文本'
                item.text = '文本'
                item.styles = {
                    'font-size': '14px',
                    color: '#000',
                    'justify-content': 'left',
                    'align-items': 'center'
                }
            } else if (type === 'image') {
                item.i = 'image' + '_' + Math.random().toString(36).slice(-2)
                item.w = 3
                item.h = 10
                item.minH = 2
                item.isVisible = true
                item.src = ''
                item.fit = 'fill'
                item.fileList = []
                item.styles = {}
            } else if (type === 'chart') {
                item.i = 'chart' + '_' + Math.random().toString(36).slice(-2)
                item.w = 12
                item.h = 45
                item.minH = 2
                item.isVisible = true
                item.title = ''
                item.chartType = 'bar'
                item.titleAlign = 'center'
                item.script = ''
                item.styles = {
                    'background-color': '#fff',
                    'border-radius': '8px'
                }
            } else if (type === 'button') {
                item.i = 'button' + '_' + Math.random().toString(36).slice(-2)
                item.w = 3
                item.h = 8
                item.minH = 3
                item.isVisible = true
                item.text = '按钮'
                item.styles = {
                    'background-color': '#3296fa',
                    'border-radius': '4px',
                    color: '#fff'
                }
            } else if (type === 'link') {
                item.i = 'link' + '_' + Math.random().toString(36).slice(-2)
                item.w = 2
                item.h = 8
                item.minH = 2
                item.isVisible = true
                item.text = '链接'
                item.styles = {
                    color: '#3296fa'
                }
            } else if (type === 'input') {
                item.i = 'input' + '_' + Math.random().toString(36).slice(-2)
                item.w = 6
                item.h = 10
                item.minH = 4
                item.maxH = 4
                item.isVisible = true
                item.label = '标签'
                item.value = ''
                item.labelPosition = 'left'
                item.labelWidth = '60px'
                item.dataType = 'text'
                item.styles = {}
            } else if (type === 'select') {
                item.i = 'select' + '_' + Math.random().toString(36).slice(-2)
                item.w = 6
                item.h = 10
                item.minH = 4
                item.maxH = 4
                item.isVisible = true
                item.label = '标签'
                item.value = ''
                item.labelPosition = 'left'
                item.labelWidth = '60px'
                item.styles = {}
            } else if (type === 'multiSelect') {
                item.i = 'multiSelect' + '_' + Math.random().toString(36).slice(-2)
                item.w = 6
                item.h = 4
                item.minH = 10
                item.maxH = 4
                item.isVisible = true
                item.label = '标签'
                item.value = []
                item.labelPosition = 'left'
                item.labelWidth = '60px'
                item.styles = {}
            } else if (type === 'datePicker') {
                item.i = 'datePicker' + '_' + Math.random().toString(36).slice(-2)
                item.w = 6
                item.h = 10
                item.minH = 4
                item.maxH = 4
                item.isVisible = true
                item.label = '标签'
                item.value = ''
                item.labelPosition = 'left'
                item.labelWidth = '60px'
                item.dateFormat = 'date'
                item.valueFormat = 'yyyy-MM-dd'
                item.styles = {}
            } else if (type === 'timePicker') {
                item.i = 'timePicker' + '_' + Math.random().toString(36).slice(-2)
                item.w = 6
                item.h = 10
                item.minH = 4
                item.maxH = 4
                item.isVisible = true
                item.label = '标签'
                item.value = ''
                item.labelPosition = 'left'
                item.labelWidth = '60px'
                item.styles = {}
            } else if (type === 'cascader') {
                item.i = 'cascader' + '_' + Math.random().toString(36).slice(-2)
                item.w = 6
                item.h = 10
                item.minH = 4
                item.maxH = 4
                item.isVisible = true
                item.label = '标签'
                item.value = ''
                item.labelPosition = 'left'
                item.labelWidth = '60px'
                item.styles = {}
            } else if (type === 'multiCascader') {
                item.i = 'multiCascader' + '_' + Math.random().toString(36).slice(-2)
                item.w = 8
                item.h = 10
                item.minH = 4
                item.maxH = 4
                item.isVisible = true
                item.label = '标签'
                item.value = []
                item.labelPosition = 'left'
                item.labelWidth = '60px'
                item.styles = {}
            } else if (type === 'radio') {
                item.i = 'radio' + '_' + Math.random().toString(36).slice(-2)
                item.w = 8
                item.h = 10
                item.minH = 4
                item.maxH = 4
                item.isVisible = true
                item.label = '标签'
                item.value = ''
                item.labelPosition = 'left'
                item.labelWidth = '60px'
                item.styles = {}
            } else if (type === 'checkbox') {
                item.i = 'checkbox' + '_' + Math.random().toString(36).slice(-2)
                item.w = 8
                item.h = 10
                item.minH = 4
                item.maxH = 4
                item.isVisible = true
                item.label = '标签'
                item.value = []
                item.labelPosition = 'left'
                item.labelWidth = '60px'
                item.styles = {}
            } else if (type === 'switch') {
                item.i = 'switch' + '_' + Math.random().toString(36).slice(-2)
                item.w = 8
                item.h = 10
                item.minH = 4
                item.maxH = 4
                item.isVisible = true
                item.label = '标签'
                item.value = ''
                item.activeValue = 1
                item.inactiveValue = 0
                item.labelPosition = 'left'
                item.labelWidth = '60px'
                item.styles = {}
            } else if (type === 'rate') {
                item.i = 'rate' + '_' + Math.random().toString(36).slice(-2)
                item.w = 8
                item.h = 10
                item.minH = 4
                item.maxH = 4
                item.isVisible = true
                item.label = '标签'
                item.value = 0
                item.labelPosition = 'left'
                item.labelWidth = '60px'
                item.styles = {}
            } else if (type === 'slider') {
                item.i = 'slider' + '_' + Math.random().toString(36).slice(-2)
                item.w = 8
                item.h = 10
                item.minH = 4
                item.maxH = 4
                item.isVisible = true
                item.label = '标签'
                item.value = 0
                item.labelPosition = 'left'
                item.labelWidth = '60px'
                item.styles = {}
            } else if (type === 'progress') {
                item.i = 'progress' + '_' + Math.random().toString(36).slice(-2)
                item.w = 8
                item.h = 8
                item.minH = 3
                item.maxH = 3
                item.isVisible = true
                item.value = 0
                item.styles = {}
            } else if (type === 'divider') {
                item.i = 'divider' + '_' + Math.random().toString(36).slice(-2)
                item.w = 8
                item.h = 8
                item.isVisible = true
                item.direction = 'horizontal'
                item.styles = {}
            } else if (type === 'upload') {
                item.i = 'upload' + '_' + Math.random().toString(36).slice(-2)
                item.w = 24
                item.h = 50
                item.isVisible = true
                item.multiple = true
                item.value = []
                item.styles = {}
            } else if (type === 'richText') {
                item.i = 'richText' + '_' + Math.random().toString(36).slice(-2)
                item.w = 24
                item.h = 50
                item.isVisible = true
                item.value = {}
                item.styles = {}
            } else if (type === 'table') {
                item.i = 'table' + '_' + Math.random().toString(36).slice(-2)
                item.w = 24
                item.h = 72
                item.isVisible = true
                item.showPagination = true
                item.showHeader = true
                item.total = 0
                item.pageNo = 1
                item.pageSize = 10
                item.columns = [
                    {
                        prop: 'title',
                        label: '标题',
                        align: 'center',
                        type: 'text'
                    },
                    {
                        prop: 'name',
                        label: '名称',
                        align: 'center',
                        type: 'text'
                    }
                ]
                item.styles = {}
            } else if (type === 'modal') {
                item.i = 'modal' + '_' + Math.random().toString(36).slice(-2)
                item.w = 0
                item.h = 0
                item.isVisible = true
                item.styles = {}
            } else if (type === 'signature') {
                item.i = 'signature' + '_' + Math.random().toString(36).slice(-2)
                item.w = 8
                item.h = 40
                item.minH = 2
                item.isVisible = true
                item.styles = {
                    'background-color': '#fff',
                    'border-radius': '8px',
                    border: '1px solid #D7D9E0'
                }
            } else if (type === 'tree') {
                item.i = 'tree' + '_' + Math.random().toString(36).slice(-2)
                item.w = 6
                item.h = 40
                item.minH = 2
                item.isVisible = true
                item.styles = {}
            } else if (type === 'custom') {
                item.i = 'custom' + '_' + Math.random().toString(36).slice(-2)
                item.w = 12
                item.h = 60
                item.minH = 40
                item.name = name
                item.isVisible = true
                item.styles = {
                    height: '100%'
                }
                this.$nextTick(() => {
                    this.recursionAttribute(this.config.layout)
                })
            }

            let mouseInGrid = false
            if (
                e.clientX > parentRect.left &&
                e.clientX < parentRect.right &&
                e.clientY > parentRect.top &&
                e.clientY < parentRect.bottom
            ) {
                mouseInGrid = true
            }
            if (mouseInGrid) {
                this.currentIndex = item.i
                this.handleDragend(this.config.layout, e, parentRect, item)
            }
        },
        handleDragend(layout, e, parentRect, object) {
            this.mouseInWidget = false
            this.key = ''
            this.recursionDragend(this.config.layout, e, parentRect, object)
            if (this.mouseInWidget) {
                this.recursionLayout(this.config.layout, this.key, object)
            } else {
                layout.push(object)
                this.attribute = object
            }
        },
        recursionDragend(layout, e, parentRect, object) {
            for (let i = 0; i < layout.length; i++) {
                let item = layout[i]
                if (
                    item.type === 'container' ||
                    item.type === 'card' ||
                    item.type === 'tabs' ||
                    item.type === 'listView' ||
                    item.type === 'modal'
                ) {
                    let minY = 0
                    let maxY = 0
                    if (item.type === 'container') {
                        minY = e.clientY - parentRect.top > item.y * 18
                        maxY = e.clientY - parentRect.top < item.y * 18 + item.h * 18
                    } else if (item.type === 'card') {
                        minY = e.clientY - parentRect.top > item.y * 18 + 58
                        maxY = e.clientY - parentRect.top < item.y * 18 + item.h * 18
                    } else if (item.type === 'tabs') {
                        minY = e.clientY - parentRect.top > item.y * 18 + 39
                        maxY = e.clientY - parentRect.top < item.y * 18 + item.h * 18
                    } else if (item.type === 'modal') {
                        minY = e.clientY - parentRect.top > item.y * 18
                        maxY = e.clientY - parentRect.top < item.y * 18 + item.h * 18
                    } else if (item.type === 'listView') {
                        minY = e.clientY - parentRect.top > item.y * 18
                        maxY = e.clientY - parentRect.top < item.y * 18 + item.h * 18
                    }
                    if (
                        e.clientX - parentRect.left > (item.x * parentRect.width) / 24 &&
                        e.clientX - parentRect.left <
                            (item.x * parentRect.width) / 24 + (item.w * parentRect.width) / 24 &&
                        minY &&
                        maxY
                    ) {
                        // 在组件上
                        this.mouseInWidget = true
                        this.key = item.i
                    }
                }

                if (item.type === 'tabs') {
                    for (let j = 0; j < item.tabs.length; j++) {
                        let tab = item.tabs[j]
                        if (tab.children && item.selectedTab === tab.name) {
                            this.recursionDragend(tab.children, e, parentRect, object)
                            break
                        }
                    }
                } else {
                    if (item.children) {
                        this.recursionDragend(item.children, e, parentRect, object)
                    }
                }
            }
        },
        recursionLayout(layout, key, object) {
            for (let i = 0; i < layout.length; i++) {
                let item = layout[i]
                if (item.i === key) {
                    document.getElementById(item.i).style.border = 'none'
                    if (item.type === 'tabs') {
                        for (let j = 0; j < item.tabs.length; j++) {
                            let tab = item.tabs[j]
                            if (tab.name === item.selectedTab) {
                                if (!tab.children) {
                                    tab.children = []
                                }
                                object.x = parseInt((object.x - item.x) * (24 / item.w))
                                object.y = object.y - item.y - 2
                                object.w = parseInt((object.w * 24) / item.w)
                                tab.children.push(object)
                            }
                        }
                    } else {
                        if (!item.children) {
                            item.children = []
                        }
                        object.x = parseInt((object.x - item.x) * (24 / item.w))
                        if (item.type === 'container') {
                            object.y = object.y - item.y
                        } else if (item.type === 'card') {
                            object.y = object.y - item.y - 4
                        } else if (item.type === 'listView') {
                            object.y = object.y - item.y
                        }
                        object.w = (object.w * 24) / item.w
                        if (object.type != 'input') {
                            object.maxH = item.h
                        }
                        item.children.push(object)
                    }
                    this.attribute = object
                    return
                }
                if (item.type === 'tabs') {
                    for (let j = 0; j < item.tabs.length; j++) {
                        let tab = item.tabs[j]
                        if (tab.children && item.selectedTab === tab.name) {
                            this.recursionLayout(item.children, key, object)
                            break
                        }
                    }
                } else {
                    if (item.children) {
                        this.recursionLayout(item.children, key, object)
                    }
                }
            }
        },
        move(object) {
            this.recursionLayoutOnDragOrResize('move', this.config.layout, object)
        },
        recursionLayoutOnDragOrResize(type, layout, object) {
            for (let i = 0; i < layout.length; i++) {
                let item = layout[i]
                if (item.i === object.i) {
                    if (item.type === 'tabs') {
                        for (let j = 0; j < item.tabs.length; j++) {
                            let tab = item.tabs[j]
                            if (tab.children && item.selectedTab === tab.name) {
                                for (let k = 0; k < tab.children.length; k++) {
                                    if (tab.children[k].type != 'input') {
                                        tab.children[k].maxH = item.h
                                    }
                                }
                                break
                            }
                        }
                    } else if (item.type === 'custom') {
                        this.$bus.$emit('resize', item.name)
                    } else {
                        if (item.children) {
                            for (let j = 0; j < item.children.length; j++) {
                                if (item.children[j].type != 'input') {
                                    item.children[j].maxH = item.h
                                }
                            }
                        }
                    }
                    if (type === 'resize' && item.type === 'chart') {
                        this.reloadChart(item)
                    }
                    return
                }
                if (item.type === 'tabs') {
                    for (let j = 0; j < item.tabs.length; j++) {
                        let tab = item.tabs[j]
                        if (tab.children && item.selectedTab === tab.name) {
                            this.recursionLayoutOnDragOrResize(type, tab.children, object)
                            break
                        }
                    }
                } else {
                    if (item.children) {
                        this.recursionLayoutOnDragOrResize(type, item.children, object)
                    }
                }
            }
        },
        resize(object) {
            this.recursionLayoutOnDragOrResize('resize', this.config.layout, object)
        },
        reloadChart(item) {
            let chartData = item.data
            if (chartData.length === 0) {
                this.$set(item, 'hasData', false)
            } else {
                this.$set(item, 'hasData', true)
            }
            this.$nextTick(() => {
                if (item.data) {
                    this.$echarts.registerMap('china', china, {})
                    if (!document.getElementById(item.i)) {
                        return
                    }
                    var chart = this.$echarts.init(document.getElementById(item.i))
                    chart.resize()
                    chart.clear()

                    var option = {
                        title: {
                            left: item.titleAlign || 'center',
                            text: item.title
                        }
                    }
                    if (item.chartType === 'bar' || item.chartType === 'line') {
                        // 柱状图、折线图
                        let xAxisData = []
                        let seriesMap = {}
                        for (let j = 0; j < chartData.length; j++) {
                            let type = chartData[j].type || 'direct'
                            if (!seriesMap.hasOwnProperty(type)) {
                                seriesMap[type] = []
                            }
                            if (!xAxisData.includes(chartData[j].name)) {
                                xAxisData.push(chartData[j].name)
                            }
                            seriesMap[type].push(chartData[j].value)
                        }
                        let series = []
                        for (let key in seriesMap) {
                            series.push({
                                name: key === 'direct' ? '' : key,
                                type: item.chartType,
                                label: {
                                    show: true
                                },
                                data: seriesMap[key]
                            })
                        }

                        option.tooltip = {
                            trigger: 'axis'
                        }
                        option.legend = {
                            bottom: 10
                        }
                        option.xAxis = {
                            data: xAxisData
                        }
                        option.yAxis = {}

                        option.series = series
                    } else if (item.chartType === 'bar-y-category') {
                        // 条形图
                        let xAxisData = []
                        let seriesMap = {}
                        for (let j = 0; j < chartData.length; j++) {
                            let type = chartData[j].type || 'direct'
                            if (!seriesMap.hasOwnProperty(type)) {
                                seriesMap[type] = []
                            }
                            if (!xAxisData.includes(chartData[j].name)) {
                                xAxisData.push(chartData[j].name)
                            }
                            seriesMap[type].push(chartData[j].value)
                        }
                        let series = []
                        for (let key in seriesMap) {
                            series.push({
                                name: key === 'direct' ? '' : key,
                                type: 'bar',
                                label: {
                                    show: true
                                },
                                data: seriesMap[key]
                            })
                        }

                        option.tooltip = {
                            trigger: 'axis'
                        }
                        option.legend = {}
                        option.xAxis = {}
                        option.yAxis = {
                            data: xAxisData
                        }
                        option.series = series
                    } else if (item.chartType === 'pie') {
                        // 饼状图
                        option.tooltip = {
                            trigger: 'item',
                            formatter: '{b} : {c} ({d}%)'
                        }
                        option.series = [
                            {
                                type: 'pie',
                                radius: '65%',
                                label: {
                                    formatter: '{b} : {c} ({d}%)'
                                },
                                data: chartData
                            }
                        ]
                    } else if (item.chartType === 'pie-doughnut') {
                        // 环形图
                        option.tooltip = {
                            trigger: 'item',
                            formatter: '{b} : {c} ({d}%)'
                        }
                        option.series = [
                            {
                                type: 'pie',
                                radius: ['40%', '70%'],
                                label: {
                                    formatter: '{b} : {c} ({d}%)'
                                },
                                data: chartData
                            }
                        ]
                    } else if (item.chartType === 'funnel' || item.chartType === 'gauge') {
                        // 漏斗图、仪表盘
                        option.tooltip = {
                            trigger: 'item'
                        }
                        option.series = [
                            {
                                type: item.chartType,
                                mapType: 'china',
                                data: chartData
                            }
                        ]
                    } else if (item.chartType === 'mix-line-bar') {
                        // 折柱混合
                        let xAxisData = []
                        let seriesData = []
                        for (let j = 0; j < chartData.length; j++) {
                            xAxisData.push(chartData[j].name)
                            seriesData.push(chartData[j].value)
                        }

                        option.tooltip = {
                            trigger: 'axis'
                        }
                        option.xAxis = {
                            data: xAxisData
                        }
                        option.yAxis = {}
                        option.series = [
                            {
                                type: 'bar',
                                label: {
                                    show: true
                                },
                                data: seriesData
                            },
                            {
                                type: 'line',
                                label: {
                                    show: true
                                },
                                data: seriesData
                            }
                        ]
                    } else if (item.chartType === 'map') {
                        // 地图
                        option.tooltip = {
                            trigger: 'item'
                        }
                        option.geo = {
                            map: 'china',
                            label: {
                                show: true,
                                color: 'rgba(0,0,0,0.7)'
                            }
                        }

                        option.series = [
                            {
                                type: 'map',
                                geoIndex: 0,
                                data: chartData
                            }
                        ]
                    }
                    chart.setOption(option)
                }
            })
        },
        deleteHandle() {
            this.deleteWidget(this.config.layout)
        },
        deleteWidget(layout) {
            for (let i = 0; i < layout.length; i++) {
                let item = layout[i]
                if (item.i === this.currentIndex) {
                    layout.splice(i, 1)
                    this.attribute = {}
                    return
                }
                if (item.type === 'tabs') {
                    for (let j = 0; j < item.tabs.length; j++) {
                        let tab = item.tabs[j]
                        if (tab.children && item.selectedTab === tab.name) {
                            this.deleteWidget(tab.children)
                            break
                        }
                    }
                } else {
                    if (item.children) {
                        this.deleteWidget(item.children)
                    }
                }
            }
        },
        beforeUpload(file) {
            let pattern = /.(png|jpg|gif|webp|svg)$/g
            if (!pattern.test(file.name)) {
                this.$message.error('只能上传图片文件')
                return false
            }
            const fileSize = file.size / 1024 / 1024 < 10
            if (!fileSize) {
                this.$message.error('上传文件大小不能超过 10MB')
                return false
            }
            return true
        },
        handleFileSuccess(res, file) {
            if (res.code === 200) {
                this.attribute.fileList = [
                    {
                        name: file.name,
                        size: file.size,
                        url: res.data
                    }
                ]

                this.attribute.src = res.data
            } else {
                this.$message.error(res.message)
            }
        },
        handleFileRemove(file) {
            this.attribute.fileList = []
            this.attribute.src = ''
        },
        addTab() {
            this.attribute.tabs.push({
                name: '标签' + (this.attribute.tabs.length + 1)
            })
        },
        deleteTab(index) {
            this.attribute.tabs.splice(index, 1)
        },
        handleLabelPosition(value) {
            if (value === 'top') {
                if (this.attribute.type === 'input') {
                    if (this.attribute.dataType === 'textarea') {
                        this.attribute.h = 18
                        this.attribute.minH = 18
                        this.attribute.maxH = 18
                    } else {
                        this.attribute.h = 15
                        this.attribute.minH = 15
                        this.attribute.maxH = 15
                    }
                } else {
                    this.attribute.h = 15
                    this.attribute.minH = 15
                    this.attribute.maxH = 15
                }
            } else {
                if (this.attribute.type === 'input') {
                    if (this.attribute.dataType === 'textarea') {
                        this.attribute.h = 12
                        this.attribute.minH = 12
                        this.attribute.maxH = 12
                    } else {
                        this.attribute.h = 10
                        this.attribute.minH = 10
                        this.attribute.maxH = 10
                    }
                } else {
                    this.attribute.h = 10
                    this.attribute.minH = 10
                    this.attribute.maxH = 10
                }
            }
        },
        handleDataTypeChange(value) {
            if (this.attribute.labelPosition === 'top') {
                if (value === 'textarea') {
                    this.attribute.h = 18
                    this.attribute.minH = 18
                    this.attribute.maxH = 18
                } else {
                    this.attribute.h = 15
                    this.attribute.minH = 15
                    this.attribute.maxH = 15
                }
            } else {
                if (value === 'textarea') {
                    this.attribute.h = 12
                    this.attribute.minH = 12
                    this.attribute.maxH = 12
                } else {
                    this.attribute.h = 10
                    this.attribute.minH = 10
                    this.attribute.maxH = 10
                }
            }
        },
        handleDateFormat(value) {
            if (value === 'year') {
                this.attribute.valueFormat = 'yyyy'
            } else if (value === 'month') {
                this.attribute.valueFormat = 'yyyy-MM'
            } else if (value === 'date') {
                this.attribute.valueFormat = 'yyyy-MM-dd'
            }
        },
        tableRowClassName({ row, rowIndex }) {
            row.index = rowIndex
        },
        showCustomStyles() {
            this.scriptVisible = true
            this.selectedRow = {
                i: this.attribute.i,
                type: 'style',
                script: JSON.stringify(this.attribute.styles, null, 2)
            }
            this.$nextTick(() => {
                this.$refs.codemirrorStyle.editor.setValue(this.selectedRow.script)
            })
        },
        handleDataChange() {
            if (this.attribute.type === 'chart') {
                if (this.attribute.dataSourceType === 'dataModel' || this.attribute.dataSourceType === 'view') {
                    var filterDataSql = ''
                    if (this.attribute.filterData) {
                        for (let i = 0; i < this.attribute.filterData.length; i++) {
                            let filterDataItem = this.attribute.filterData[i]
                            if (filterDataItem['field'] && filterDataItem['decider'] === ' is not null') {
                                let field = filterDataItem['field'].split('|')[0]
                                if (i != 0) {
                                    filterDataSql = filterDataSql + ' ' + filterDataItem['condition'] + ' '
                                }
                                filterDataSql = filterDataSql + field + filterDataItem['decider']
                            } else if (filterDataItem['field'] && filterDataItem['decider'] === 'length') {
                                let field = filterDataItem['field'].split('|')[0]
                                if (i != 0) {
                                    filterDataSql = filterDataSql + ' ' + filterDataItem['condition'] + ' '
                                }
                                filterDataSql =
                                    filterDataSql +
                                    filterDataItem['decider'] +
                                    '(' +
                                    field +
                                    ')=' +
                                    filterDataItem['value']
                            } else if (filterDataItem['field'] && filterDataItem['value']) {
                                let field = filterDataItem['field'].split('|')[0]
                                let type = filterDataItem['field'].split('|')[1]
                                if (i != 0) {
                                    filterDataSql = filterDataSql + ' ' + filterDataItem['condition'] + ' '
                                }
                                filterDataSql = filterDataSql + field + ' ' + filterDataItem['decider'] + ' '
                                if (filterDataItem['type'] == 'variable') {
                                    if (filterDataItem['decider'] === 'in') {
                                        filterDataSql = filterDataSql + '(' + filterDataItem['value'] + ')' + ' '
                                    } else {
                                        if (type === 'varchar') {
                                            filterDataSql = filterDataSql + "'" + filterDataItem['value'] + "'"
                                        } else {
                                            filterDataSql = filterDataSql + filterDataItem['value']
                                        }
                                    }
                                } else if (filterDataItem['type'] == 'expression') {
                                    if (type === 'varchar') {
                                        filterDataSql = filterDataSql + "'" + eval(filterDataItem['value']) + "'"
                                    } else {
                                        filterDataSql = filterDataSql + eval(filterDataItem['value'])
                                    }
                                }
                            }
                        }
                    }
                    let params = {
                        tableName: this.attribute.dataModel,
                        dimension: this.attribute.dimension ? this.attribute.dimension.toString() : '',
                        metrics: this.attribute.metrics.toString(),
                        filterData: filterDataSql
                    }
                    this.$axios.post('gauge/chartSql', params).then(res => {
                        if (res.data.code == 200) {
                            this.attribute.data = res.data.data
                            this.reloadChart(this.attribute)
                        }
                    })
                } else {
                    this.reloadChart(this.attribute)
                }
            } else if (this.attribute.type === 'text') {
                try {
                    let pattern = /\{\{(.*?)\}\}/g
                    var matches = this.attribute.value.match(pattern)
                    let text = this.attribute.value
                    if (matches) {
                        for (let i = 0; i < matches.length; i++) {
                            let matche = matches[i]
                            let key = matche.replace(/{{/g, '').replace(/}}/g, '')
                            text = text.replace(matche, eval(`this.queryData.${key}`))
                        }
                    }
                    this.$set(this.attribute, 'text', text.replace(/undefined/g, ''))
                } catch (e) {
                    console.log(e)
                    this.$set(this.attribute, 'text', this.attribute.value)
                }
            }
        },
        addColumnHandle() {
            this.attribute.columns.push({
                prop: '',
                label: '自定义列',
                align: 'center',
                type: 'text'
            })
        },
        removeNode(node, data) {
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
        },
        handleScript() {
            this.drawerType = 'js'
            this.jsVisible = true
        },
        handleClose(done) {
            if ((this.drawerType = 'js')) {
                try {
                    this.resolveScript()
                    for (let key in this.jsApi) {
                        this.addFunc(key, this.jsApi[key].params, this.jsApi[key].body)
                    }
                    done()
                } catch (e) {
                    this.$message.error('js脚本错误：' + e)
                }
            }
        },
        handleCopy() {
            const range = document.createRange()
            range.selectNode(document.getElementById('copycode'))
            const selection = window.getSelection()
            if (selection.rangeCount > 0) selection.removeAllRanges()
            selection.addRange(range)
            document.execCommand('copy')
            this.$message.success('复制成功')
            selection.removeRange(range)
        },
        async handleTableChange(value) {
            let res = await this.$axios.get('businessField/queryByTableName?tableName=' + value)
            if (res.data.code === 200) {
                this.fieldOptions = res.data.data
            }
        },
        async handleViewChange(value) {
            let res = await this.$axios.get('viewField/queryAll?viewName=' + value)
            if (res.data.code === 200) {
                this.fieldOptions = res.data.data
            }
        },
        handleFilterData() {
            this.filterDataVisible = true
            if (!this.attribute.filterData) {
                this.attribute.filterData = []
                this.attribute.filterData.push({
                    field: '',
                    type: 'variable',
                    condition: 'and',
                    decider: '=',
                    value: ''
                })
            }
        },
        addFilterData() {
            this.attribute.filterData.push({
                field: '',
                type: 'variable',
                condition: 'and',
                decider: '=',
                value: ''
            })
        },
        filterDataSubmit() {
            this.$nextTick(() => {
                var filterDataSql = ''
                for (let i = 0; i < this.attribute.filterData.length; i++) {
                    let filterDataItem = this.attribute.filterData[i]
                    if (filterDataItem['field'] && filterDataItem['decider'] === ' is not null') {
                        let field = filterDataItem['field'].split('|')[0]
                        if (i != 0) {
                            filterDataSql = filterDataSql + ' ' + filterDataItem['condition'] + ' '
                        }
                        filterDataSql = filterDataSql + field + filterDataItem['decider']
                    } else if (filterDataItem['field'] && filterDataItem['decider'] === 'length') {
                        let field = filterDataItem['field'].split('|')[0]
                        if (i != 0) {
                            filterDataSql = filterDataSql + ' ' + filterDataItem['condition'] + ' '
                        }
                        filterDataSql =
                            filterDataSql + filterDataItem['decider'] + '(' + field + ')=' + filterDataItem['value']
                    } else if (filterDataItem['field'] && filterDataItem['value']) {
                        let field = filterDataItem['field'].split('|')[0]
                        let type = filterDataItem['field'].split('|')[1]
                        if (i != 0) {
                            filterDataSql = filterDataSql + ' ' + filterDataItem['condition'] + ' '
                        }
                        filterDataSql = filterDataSql + field + ' ' + filterDataItem['decider'] + ' '
                        if (filterDataItem['type'] == 'variable') {
                            if (filterDataItem['decider'] === 'in') {
                                filterDataSql = filterDataSql + '(' + filterDataItem['value'] + ')' + ' '
                            } else {
                                if (type === 'varchar') {
                                    filterDataSql = filterDataSql + "'" + filterDataItem['value'] + "'"
                                } else {
                                    filterDataSql = filterDataSql + filterDataItem['value']
                                }
                            }
                        } else if (filterDataItem['type'] == 'expression') {
                            if (type === 'varchar') {
                                filterDataSql = filterDataSql + "'" + eval(filterDataItem['value']) + "'"
                            } else {
                                filterDataSql = filterDataSql + eval(filterDataItem['value'])
                            }
                        }
                    }
                }
                let params = {
                    tableName: this.attribute.dataModel,
                    dimension: this.attribute.dimension ? this.attribute.dimension.toString() : '',
                    metrics: this.attribute.metrics.toString(),
                    filterData: filterDataSql
                }
                this.$axios.post('gauge/chartSql', params).then(res => {
                    if (res.data.code == 200) {
                        this.attribute.data = res.data.data
                        this.reloadChart(this.attribute)
                        this.filterDataVisible = false
                    }
                })
            })
        },
        deleteFilteData(index) {
            if (this.attribute.filterData.length != 1) {
                this.attribute.filterData.splice(index, 1)
            }
        },
        createFilter(queryString) {
            return item => {
                return item.value.indexOf(queryString) > -1
            }
        }
    }
}
</script>

<style scoped>
::v-deep .el-drawer__header {
    margin-bottom: 0px;
    padding: 15px;
}
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
    padding: 15px;
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
.drag-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    border-radius: 8px;
    box-shadow: 0 8px 12px #ebedf0;
    background-color: rgb(245, 245, 246);
}
.grid-item-checked {
    border: 1px solid #1583f2;
    border-radius: 8px;
}
.grid-item-unchecked {
    border: 1px solid #ebeef5;
    border-radius: 8px;
}
.save {
    position: fixed;
    right: 15px;
    top: 100px;
    z-index: 2000;
}
.source {
    padding-bottom: 15px;
    padding-left: 15px;
}
.tag {
    margin-right: 15px;
}
.function {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 12px #ebedf0;
    margin-right: 15px;
    box-sizing: border-box;
}
.widgets {
    width: 240px;
    background-color: #fff;
    display: flex;
    flex-flow: wrap;
    justify-content: space-between;
    align-items: flex-start;
    place-content: flex-start;
    overflow: auto;
    padding-left: 6px;
    padding-bottom: 10px;
}
.tools {
    width: 74px;
    display: inline-flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    margin: 15px 6px 0px 0px;
    cursor: pointer;
    border: 1px solid rgb(215, 217, 224);
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 12px;
    padding: 6px;
}
.icon {
    width: 36px;
    height: 36px;
}
.tools span {
    margin-top: 5px;
}
.report {
    padding: 15px;
    overflow: auto;
}
.setting {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 12px #ebedf0;
    margin-left: 15px;
    box-sizing: border-box;
}
::v-deep .upload-disabled .el-upload--picture-card {
    display: none;
}
::v-deep .el-upload--picture-card {
    width: 90px;
    height: 90px;
    line-height: 90px;
}
::v-deep .function .el-tabs {
    height: 100%;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}
::v-deep .function .el-tabs__content {
    padding: 0px;
    height: calc(100% - 40px);
}
::v-deep .function .el-tab-pane {
    overflow: hidden auto;
    height: -webkit-fill-available;
}
::v-deep .setting .el-tabs {
    height: 100%;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}
::v-deep .setting .el-tabs__content {
    padding: 0px;
    height: calc(100% - 40px);
}
::v-deep .setting .el-tab-pane {
    overflow: hidden auto;
    height: -webkit-fill-available;
}
</style>
