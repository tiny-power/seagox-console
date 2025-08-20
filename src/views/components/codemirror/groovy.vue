<template>
    <div class="code-edit" :style="styleObject">
        <textarea :id="id" :placeholder="placeholder"></textarea>
    </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/groovy/groovy.js'

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
        id: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            editor: null,
            styleObject: {
                height: this.height + 'px',
                'border-top': '1px solid #e5e9f2'
            }
        }
    },
    mounted() {
        this.codeMirrorInit()
    },
    methods: {
        codeMirrorInit() {
            const codeMirror = document.getElementById(this.id)
            this.editor = CodeMirror.fromTextArea(codeMirror, {
                lineNumbers: true,
                line: true,
                tabSize: 4,
                indentUnit: 4,
                mode: 'groovy',
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
