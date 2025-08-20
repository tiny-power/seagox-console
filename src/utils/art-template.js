const template = require('art-template/lib/template-web')

template.defaults.imports.toUpperCase = function(value) {
    return value.toUpperCase()
}

template.defaults.imports.text = function(value, format) {
    if(value && format) {
        try {
            if(format === '0.00%') {
                return (value * 100).toFixed(2) + '%'
            }
            if(format === '#,###') {
                return Number(value.toFixed(2)).toLocaleString()
                
            }
        } catch(err) {
            
        }
    }
    return value
}

// 导出
export default template
