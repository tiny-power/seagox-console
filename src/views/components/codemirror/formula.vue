<template>
    <div>
        <div class="code-edit" :style="styleObject">
            <textarea id="codeMirror" :placeholder="placeholder"></textarea>
        </div>
        <div class="content">
            <div class="variable">
                <el-input placeholder="请输入变量" prefix-icon="el-icon-search" v-model="variableStr" size="small">
                </el-input>
                <div style="overflow-y: auto; height: 215px; margin-top: 10px">
                    <div
                        v-for="(item, index) in variable"
                        :key="index"
                        style="
                            height: 30px;
                            line-height: 30px;
                            padding-left: 8px;
                            cursor: pointer;
                            color: #333;
                            font-size: 14px;
                        "
                        @click="handleVariable(item.label)"
                    >
                        {{ item.label }}
                    </div>
                </div>
            </div>
            <div class="formula">
                <el-input placeholder="请输入公式" prefix-icon="el-icon-search" v-model="formulaStr" size="small">
                </el-input>
                <div style="overflow-y: auto; height: 215px; margin-top: 10px">
                    <div
                        v-for="(item, index) in formulaOptions"
                        :key="index"
                        style="
                            height: 30px;
                            line-height: 30px;
                            padding-left: 8px;
                            cursor: pointer;
                            color: #333;
                            font-size: 14px;
                        "
                        @click="handleFormula('single', item)"
                        @dblclick="handleFormula('double', item)"
                    >
                        {{ item.type }}
                    </div>
                </div>
            </div>
            <div class="prompt">
                <div v-if="title == ''">从左侧面板选择字段名和函数，或输入函数</div>
                <div class="cm-func" v-else>{{ title }}</div>
                <div style="margin-top: 10px">{{ desc }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
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
        },
        variable: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            editor: null,
            styleObject: {
                height: this.height + 'px',
                border: '1px solid #d7dae2',
                'border-radius': '8px'
            },
            options: {
                tabSize: 4,
                indentUnit: 4,
                mode: 'javascript',
                autofocus: true
            },
            variableStr: '',
            formulaStr: '',
            formulaOptions: [
                {
                    type: 'long',
                    title: 'long(v)',
                    desc: '将值转为 long 类型'
                },
                {
                    type: 'decimal',
                    title: 'decimal(v)',
                    desc: '将值转为 decimal 类型'
                },
                {
                    type: 'max',
                    title: 'max(x1, x2, x3, ...)',
                    desc: '取所有参数中的最大值，比较规则遵循逻辑运算符规则。'
                },
                {
                    type: 'min',
                    title: 'min(x1, x2, x3, ...)',
                    desc: '取所有参数中的最小值，比较规则遵循逻辑运算符规则。'
                }
            ],
            title: '',
            desc: ''
        }
    },
    mounted() {
        this.codeMirrorInit()
    },
    methods: {
        codeMirrorInit() {
            const codeMirror = document.getElementById('codeMirror')
            this.editor = CodeMirror.fromTextArea(codeMirror, this.options)
            this.editor.setValue(this.transLabel(this.value))
            this.editor.setCursor({
                line: 0,
                ch: this.value ? this.value.length : 0
            })
            this.editor.focus()
            this.editor.on('change', instance => {
                this.$emit('input', this.transValue(this.editor.getValue()))
            })
            this.autoMark()
        },
        transValue(value) {
            for (let index in this.variable) {
                value = value.replace(new RegExp(this.variable[index].label, 'gm'), this.variable[index].value)
            }
            return value
        },
        transLabel(value) {
            for (let index in this.variable) {
                value = value.replace(new RegExp(this.variable[index].value, 'gm'), this.variable[index].label)
            }
            return value
        },
        markText(from, to, label, className) {
            if (className === void 0) {
                className = 'cm-func'
            }
            let text = document.createElement('span')
            text.className = className
            text.innerText = label
            this.editor.markText(from, to, {
                atomic: true,
                replacedWith: text
            })
        },
        autoMark() {
            const editor = this.editor
            const lines = editor.lineCount()
            for (let line = 0; line < lines; line++) {
                const content = editor.getLine(line)
                content.replace(/([A-Z]+)\s*\(/g, (_, func, pos) => {
                    this.markText({ line: line, ch: pos }, { line: line, ch: pos + func.length }, func, 'cm-func')
                    return _
                })
                this.variable.forEach(v => {
                    let from = 0
                    let idx = -1
                    while (~(idx = content.indexOf(v.label, from))) {
                        this.markText(
                            { line: line, ch: idx },
                            { line: line, ch: idx + v.label.length },
                            v.label,
                            'cm-field'
                        )
                        from = idx + v.label.length
                    }
                })
            }
        },
        insertContent(value, type) {
            const from = this.editor.getCursor()
            if (type === 'variable') {
                this.editor.replaceSelection(value)
                const to = this.editor.getCursor()
                this.markText(from, to, value, 'cm-field')
            } else if (type === 'func') {
                this.editor.replaceSelection(`${value}()`)
                const to = this.editor.getCursor()
                this.markText(from, { line: to.line, ch: to.ch - 2 }, value, 'cm-func')
                this.editor.setCursor({ line: to.line, ch: to.ch - 1 })
            } else if (typeof value === 'string') {
                this.editor.replaceSelection(value)
            }
            this.editor.focus()
        },
        handleVariable(value) {
            this.insertContent(value, 'variable')
        },
        handleFormula(type, item) {
            this.title = item.title
            this.desc = item.desc
            if (type === 'double') {
                this.insertContent(item.type, 'func')
            }
        }
    }
}
</script>

<style scoped>
::v-deep .CodeMirror {
    height: 100% !important;
    text-align: start !important;
}
::v-deep .cm-field {
    background: #007bff;
    padding: 5px 10px;
    border-radius: 4px;
    color: #fff;
    margin: 0 1px;
    font-size: 12px !important;
}
::v-deep .cm-func {
    font-weight: bold;
    color: #ae4597;
    line-height: 14px;
    margin: 0 1px;
    padding: 0 2px;
    font-size: 18px;
}
::v-deep .cm-operator {
    font-size: 18px;
}
::v-deep .cm-string {
    font-size: 18px;
}
.code-edit {
    padding: 10px;
    margin-top: -10px;
    margin-bottom: 10px;
}
.content {
    display: flex;
    height: 270px;
    border: 1px solid #d7dae2;
    border-radius: 8px;
    box-sizing: border-box;
}
.variable {
    flex: 1;
    padding: 8px;
}
.formula {
    flex: 1;
    padding: 8px;
    border-left: 1px solid #d7dae2;
}
.prompt {
    flex: 1;
    padding: 15px 10px;
    border-left: 1px solid #d7dae2;
}
</style>
