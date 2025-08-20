<template>
    <div class="code-edit" :style="styleObject">
        <textarea id="codeMirror" :placeholder="placeholder"></textarea>
    </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/display/placeholder.js'

export default {
    props: {
        value: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        height: {
            type: Number,
            default: 360
        }
    },
    data() {
        return {
            editor: null,
            styleObject: {
                height: this.height + 'px',
                'border-top': '1px solid #e5e9f2'
            },
            hintList: [
                {
                    displayText: '初始化(mounted)',
                    text: 'export function mounted() {\n	\n}'
                },
                {
                    displayText: '行样式(rowStyle)',
                    text: 'export function rowStyle(row, rowIndex) {\n	\n}'
                },
                {
                    displayText: '列单击(cellClick)',
                    text: 'export function cellClick(row, column) {\n	\n}'
                },
                {
                    displayText: '行双击(rowDblclick)',
                    text: 'export function rowDblclick(row, column, event) {\n	\n}'
                },
                {
                    displayText: '列样式(cellStyle)',
                    text: 'export function cellStyle(column, value) {\n	\n}'
                },
                {
                    displayText: '字段事件(modelEvent)',
                    text: 'export function modelEvent(event, field, value) {\n	\n}'
                },
                {
                    displayText: '额外参数(extraParameter)',
                    text: 'export function extraParameter() {\n	\n}'
                },
                {
                    displayText: '验证规则(validateRule)',
                    text: 'export function validateRule() {\n	\n}'
                },
                {
                    displayText: '展开改变(expandChange)',
                    text: 'export const expandChange = true'
                },
                {
                    displayText: '基础地址(baseUrl)',
                    text: 'export function baseUrl() {\n	\n}'
                },
                {
                    displayText: '业务参数(businessParameter)',
                    text: 'export function businessParameter() {\n	\n}'
                }
            ]
        }
    },
    mounted() {
        this.codeMirrorInit()
    },
    methods: {
        codeMirrorInit() {
            const codeMirror = document.getElementById('codeMirror')
            this.editor = CodeMirror.fromTextArea(codeMirror, {
                lineNumbers: true,
                line: true,
                tabSize: 4,
                indentUnit: 4,
                mode: 'javascript',
                lineWrapping: true,
                autofocus: true,
                hintOptions: { hint: this.handleShowHint, completeSingle: false }
            })

            if (this.value) {
                this.editor.setValue(this.value)
            }

            this.editor.on('change', instance => {
                this.$emit('input', this.editor.getValue())
                instance.focus()
            })

            this.editor.on('inputRead', instance => {
                instance.showHint()
            })
        },
        handleShowHint(instance) {
            // 得到光标
            let cursor = instance.getCursor()
            // 得到行内容
            let cursorLine = instance.getLine(cursor.line)
            // 得到光标位置
            // let end = cursor.ch
            let hintList = []
            if (cursorLine === 'export') {
                hintList = this.hintList
            }
            // 得到光标标识
            let token = instance.getTokenAt(cursor)
            return {
                list: hintList, // 自定义提示内容
                // ch:选择提示内容替换的开始位置，line: 光标所在行
                from: { ch: token.start, line: cursor.line },
                to: { ch: token.end, line: cursor.line }
            }
        }
    }
}
</script>

<style scoped>
.code-edit {
    border-radius: 4px;
    overflow: hidden;
}
::v-deep .CodeMirror {
    height: 100% !important;
    text-align: start !important;
}
::v-deep span.cm-field {
    color: #fff;
    background-image: linear-gradient(-117deg, #90dcd4, #7cdfc2) !important;
    padding: 4px !important;
    border-radius: 4px;
    margin-right: 4px !important;
}
::v-deep .cm-keyword {
    font-size: 19px;
}
::v-deep .CodeMirror pre.CodeMirror-placeholder {
    color: #999;
}
::v-deep .CodeMirror-linenumber {
    text-align: center;
    font-size: 17px;
}
::v-deep .CodeMirror-gutters {
    background-color: #fff;
    border-right: 1px solid rgb(240, 242, 245);
}
::v-deep .CodeMirror pre.CodeMirror-line {
    font-size: 17px;
}
</style>
