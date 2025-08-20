<template>
    <div class="code-edit" :style="styleObject">
        <textarea id="codeMirror" :placeholder="placeholder"></textarea>
    </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/sql/sql.js'

export default {
    props: {
        value: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            editor: null,
            styleObject: {
                border: '1px solid #3a6cfa'
            }
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
                mode: 'sql',
                lineWrapping: true,
                autofocus: true
            })

            if (this.value) {
                this.editor.setValue(this.value)
            }

            this.editor.on('change', instance => {
                this.$emit('input', this.editor.getValue())
                instance.focus()
            })
        }
    }
}
</script>

<style scoped>
.code-edit {
    max-height: 600px;
    border-radius: 4px;
    overflow: hidden;
}
::v-deep .CodeMirror {
    text-align: start !important;
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
