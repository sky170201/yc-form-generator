import { deepClone } from '@/utils'

/** {
    "el-button": {},
    "el-checkbox-group": {},
    "el-input": {},
    "el-radio-group": {},
    "el-select": {},
    "el-upload": {}
} */
const componentChild = {}

/**
 * './slots' -> 要搜索的目录
 * false     -> 是否继续搜索其子目录
 * /\.js$/   -> 匹配文件的正则表达式
 */
const slotsFiles = require.context('./slots', false, /\.js$/) // 返回的文件路径数组，可取文件名
const keys = slotsFiles.keys() || []
keys.forEach(key => {
    const tag = key.replace(/^\.\/(.+)\.\w+$/, '$1') // \w匹配任意字符
    const value = slotsFiles(key).default
    componentChild[tag] = value
})

// 加载插槽文件
function mountSlotFiles (h, confClone, children) {
    const childObjs = componentChild[confClone.__config__.tag]
    if (childObjs) {
        Object.keys(childObjs).forEach(key => {
            const childFunc = childObjs[key]
            if (confClone.__slot__ && confClone.__slot__[key]) {
                // 添加组件插槽
                // console.log(123, childFunc(h, confClone, key))
                children.push(childFunc(h, confClone, key))
            }
        })
    }
}

function makeDataObject () {
    return {
        class: {},
        style: {},
        attrs: {}, // 普通的HTML attribute {id: 'test'}
        props: {}, // 组件的prop
        domProps: {}, // dom的prop
        nativeOn: {}, // vm.$emit 触发的事件，仅用于监听原生事件，而不是组件内部使用
        on: {}, // 带on且不带.enter等修饰符的事件监听器
        directives: [], // 自定义指令。注意：你无法对'binding'中的'oldValue'赋值，因为Vue已经自动为你进行了同步
        scopedSlots: {}, // 作用域插槽的格式为：{ name: props => VNode | Array<VNode>}
        slot: null,
        key: null,
        ref: null,
        refInFor: null
    }
}

function emitEvents (confClone) {
    ['on', 'nativeOn'].forEach(attr => {
        const eventKeyList = Object.keys(confClone[attr] || {})
        eventKeyList.forEach(key => {
            const val = confClone[attr][key]
            if (typeof val === 'string') {
                // 如果有绑定事件且是字符串，则转化为函数，通过$emit发射事件
                confClone[attr][key] = event => this.$emit(val, event)
            }
        })
    })
}

function vModel (dataObject, defaultValue) {
    // 往组件的props添加value属性, on中添加input事件
    // <Child value="defaultValue" input= (val) => {this.$emit('input', val)}/>
    dataObject.props.value = defaultValue

    dataObject.on.input = val => {
        this.$emit('input', val)
    }
    // console.log('buildDataObject', dataObject)
}

function buildDataObject (confClone, dataObject) {
    Object.keys(confClone).forEach(key => {
        const val = confClone[key]
        if (key === '__vModel__') {
            // 处理事件双向绑定 input
            // console.log('key', key)
            vModel.call(this, dataObject, confClone.__config__.defaultValue)
        } else if (dataObject[key] !== undefined) { // 如果key是可用且有值
            // 如果currentItem里有跟render可识别数据对象一样的键值对，则赋值，例如:style
            if (
                dataObject[key] === null ||
                dataObject[key] instanceof RegExp ||
                ['boolean', 'string', 'number', 'function'].includes(typeof dataObject[key])
            ) {
                dataObject[key] = val
            } else if (Array.isArray(dataObject[key])) {
                //   如果数据结构是一项数组，则合并，例如：directives
                dataObject[key] = [...dataObject[key], ...val]
            } else {
                //   其他项则直接赋值
                dataObject[key] = {
                    ...dataObject[key],
                    ...val
                }
            }
        //   其他项则直接添加到attrs属性上
        } else {
            dataObject.attrs[key] = val
        }
    })
    // 清理非组件或标签属性，例如：属性 __config__/__slot__/__methods__
    clearAttrs(dataObject)
}

function clearAttrs (dataObject) {
    delete dataObject.attrs.__config__
    delete dataObject.attrs.__slot__
    delete dataObject.attrs.__methods__
}

export default {
    props: {
        conf: {
            type: Object,
            default: () => ({})
        }
    },
    render (h) {
        const dataObject = makeDataObject()
        const confClone = deepClone(this.conf)
        const children = this.$slots.default || []

        // 如果slots文件夹存在与当前tag同名的文件，则执行文件中的代码
        mountSlotFiles.call(this, h, confClone, children)

        // 将字符串类型的事件，发送为消息
        emitEvents.call(this, confClone)

        // 将json表单配置转化为vue render可以识别的“数据对象”(dataObject)
        buildDataObject.call(this, confClone, dataObject)

        // console.log(145, h(this.conf.__config__.tag, dataObject, children))
        // 标签 属性 子组件
        return h(this.conf.__config__.tag, dataObject, children)
    }
}
