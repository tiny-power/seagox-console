<template>
    <div class="code-edit" :style="styleObject">
        <textarea :id="id" :placeholder="placeholder"></textarea>
    </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/xml-hint.js'
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
            },
            hintList: [],
            tags: {
                mapper: {
                    text: '<mapper></mapper>',
                    displayText: '<> mapper',
                    children: ['select', 'insert', 'update', 'delete', 'sql']
                },
                select: {
                    text: '<select id=""></select>',
                    displayText: '<> select',
                    attrs: {
                        id: null,
                        resultType: ['int', 'map', 'list']
                    },
                    children: ['where', 'set', 'foreach', 'choose', 'if']
                },
                insert: {
                    text: '<insert id=""></insert>',
                    displayText: '<> insert',
                    attrs: { id: null },
                    children: ['where', 'set', 'foreach', 'choose', 'if']
                },
                update: {
                    text: '<update id=""></update>',
                    displayText: '<> update',
                    attrs: { id: null },
                    children: ['where', 'set', 'foreach', 'choose', 'if']
                },
                delete: {
                    text: '<delete id=""></delete>',
                    displayText: '<> delete',
                    attrs: { id: null },
                    children: ['where', 'set', 'foreach', 'choose', 'if']
                },
                sql: {
                    text: '<sql id=""></sql>',
                    displayText: '<> sql',
                    attrs: { id: null },
                    children: ['where', 'set', 'foreach', 'choose', 'if']
                },
                where: {
                    text: '<where></where>',
                    displayText: '<> where',
                    children: ['where', 'set', 'foreach', 'choose', 'if']
                },
                set: {
                    text: '<set></set>',
                    displayText: '<> set',
                    children: ['where', 'set', 'foreach', 'choose', 'if']
                },
                foreach: {
                    text: '<foreach collection="" item="" index="" open="" close="" separator=""></foreach>',
                    displayText: '<> foreach',
                    attrs: {
                        collection: null,
                        item: null,
                        index: null,
                        open: null,
                        close: null,
                        separator: null
                    },
                    children: ['trim', 'where', 'set', 'foreach', 'choose', 'if']
                },
                choose: {
                    text: '<choose></choose>',
                    displayText: '<> choose',
                    children: ['when', 'otherwise']
                },
                if: {
                    text: '<if test=""></if>',
                    displayText: '<> if',
                    attrs: {
                        test: null
                    },
                    children: ['trim', 'where', 'set', 'foreach', 'choose', 'if']
                },
                when: {
                    text: '<when test=""></when>',
                    displayText: '<> when',
                    attrs: {
                        test: null
                    },
                    children: ['trim', 'where', 'set', 'foreach', 'choose', 'if']
                },
                otherwise: {
                    text: '<otherwise></otherwise>',
                    displayText: '<> otherwise',
                    children: ['trim', 'where', 'set', 'foreach', 'choose', 'if']
                }
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
                mode: 'xml',
                lineWrapping: true,
                autofocus: true,
                hintOptions: { hint: this.handleShowHint, completeSingle: false }
            })

            if (this.value) {
                this.editor.setValue(this.value)
            }

            this.editor.on('change', (instance, changeObj) => {
                this.$emit('input', this.editor.getValue())
                instance.focus()
                if ((changeObj.origin = 'complete')) {
                    let text = changeObj.text
                    if (text.includes('<mapper></mapper>')) {
                        instance.setCursor({ line: changeObj.from.line, ch: changeObj.from.ch + 8 })
                    } else if (text.includes('<select id=""></select>')) {
                        instance.setCursor({ line: changeObj.from.line, ch: changeObj.from.ch + 12 })
                    } else if (text.includes('<insert id=""></insert>')) {
                        instance.setCursor({ line: changeObj.from.line, ch: changeObj.from.ch + 12 })
                    } else if (text.includes('<update id=""></update>')) {
                        instance.setCursor({ line: changeObj.from.line, ch: changeObj.from.ch + 12 })
                    } else if (text.includes('<delete id=""></delete>')) {
                        instance.setCursor({ line: changeObj.from.line, ch: changeObj.from.ch + 12 })
                    } else if (text.includes('<sql id=""></sql>')) {
                        instance.setCursor({ line: changeObj.from.line, ch: changeObj.from.ch + 9 })
                    } else if (text.includes('<where></where>')) {
                        instance.setCursor({ line: changeObj.from.line, ch: changeObj.from.ch + 7 })
                    } else if (text.includes('<set></set>')) {
                        instance.setCursor({ line: changeObj.from.line, ch: changeObj.from.ch + 5 })
                    } else if (
                        text.includes(
                            '<foreach collection="" item="" index="" open="" close="" separator=""></foreach>'
                        )
                    ) {
                        instance.setCursor({ line: changeObj.from.line, ch: changeObj.from.ch + 21 })
                    } else if (text.includes('<choose></choose>')) {
                        instance.setCursor({ line: changeObj.from.line, ch: changeObj.from.ch + 8 })
                    } else if (text.includes('<if test=""></if>')) {
                        instance.setCursor({ line: changeObj.from.line, ch: changeObj.from.ch + 10 })
                    } else if (text.includes('<when test=""></when>')) {
                        instance.setCursor({ line: changeObj.from.line, ch: changeObj.from.ch + 12 })
                    } else if (text.includes('<otherwise></otherwise>')) {
                        instance.setCursor({ line: changeObj.from.line, ch: changeObj.from.ch + 11 })
                    }
                }
            })

            this.editor.on('inputRead', instance => {
                instance.showHint()
            })
        },
        handleShowHint(instance) {
            // 得到光标
            let cursor = instance.getCursor()
            let inputValue = instance.getRange(CodeMirror.Pos(cursor.line, cursor.ch - 1), cursor)
            let hintList = []
            // 得到光标标识
            let token = instance.getTokenAt(instance.getCursor())
            if (token.state.context) {
                let curTagName = token.state.tagName
                let parentTagName = token.state.context.tagName
                if (inputValue == '<') {
                    let children = this.tags[parentTagName].children || []
                    for (let i = 0; i < children.length; i++) {
                        hintList.push({
                            displayText: this.tags[children[i]].displayText,
                            text: this.tags[children[i]].text
                        })
                    }
                }
                // 属性
                if (curTagName) {
                    if (inputValue == ' ') {
                        let attrs = this.tags[curTagName].attrs || {}
                        for (let attr in attrs) {
                            hintList.push({
                                displayText: '@' + attr,
                                text: ' ' + attr + '=""'
                            })
                        }
                    } else if (inputValue == '=') {
                        let attrs = this.tags[curTagName].attrs || {}
                        var before = instance.getRange(
                            CodeMirror.Pos(cursor.line, Math.max(0, cursor.ch - 60)),
                            CodeMirror.Pos(cursor.line, token.type == 'string' ? token.start : token.end)
                        )
                        var atName = before.match(/([^\s\u00a0=<>\"\']+)=$/)
                        if (atName && attrs.hasOwnProperty(atName[1])) {
                            let attrsArray = attrs[atName[1]] || []
                            for (let i = 0; i < attrsArray.length; i++) {
                                hintList.push({
                                    displayText: attrsArray[i],
                                    text: '="' + attrsArray[i] + '"'
                                })
                            }
                        }
                    }
                }
            } else {
                // 根目录
                if (inputValue == '<') {
                    hintList = [{ text: '<mapper></mapper>', displayText: '<> mapper' }]
                }
            }
            return {
                list: hintList,
                from: { ch: token.start, line: cursor.line },
                to: { ch: token.end, line: cursor.line }
            }
        }
    }
}
</script>

<style scoped>
.code-edit {
    /* border-radius: 8px; */
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
