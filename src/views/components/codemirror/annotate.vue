<template>
    <div class="code-edit" :style="styleObject">
        <textarea id="codeMirror" :placeholder="placeholder"></textarea>
    </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/groovy/groovy.js'
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
                border: '1px solid #3a6cfa'
            },
            hintList: [
                '@NotNull(message = "必须不为空")',
                '@Length(min = 7, max = 11, message = "长度必须大于等于7或小于等于11")',
                '@Range(min = 18, max = 80, message = "必须大于等于18或小于等于80")',
                '@Replace(value = "字典名称")',
                '@Min(value = 18, message = "不能小于18")',
                '@Max(value = 100, message = "不能大于100")',
                '@Ignore()',
                '@Company()',
                '@Department()',
                '@User()',
                '@DateFormat()',
                '@Pattern(regexp = "d{11}", message = "必须为数字，并且长度为11")',
                '@ReplaceSql(value = "select id from company where name = #{name}", message = "值替换")',
                '@IsExist(value = "select count(*) from company where name = #{name}", message = "是否存在")'
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
                lineNumbers: false,
                line: true,
                tabSize: 4,
                indentUnit: 4,
                mode: 'groovy',
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
            if (cursorLine === '@') {
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
}
::v-deep .CodeMirror-gutters {
    background-color: #fff;
    border-right: 1px solid rgb(240, 242, 245);
}
</style>
