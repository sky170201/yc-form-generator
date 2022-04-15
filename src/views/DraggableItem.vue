<script>
import draggable from 'vuedraggable'
import render from '@/components/render'

const components = {
    itemBtns (h, currentItem, index, list) {
        const { copyItem, deleteItem } = this.$listeners
        return [
            <span class="drawing-item-copy" title="复制" onClick={ e => {
                copyItem(currentItem, list)
                e.stopPropagation()
            }}>
                <i class="el-icon-copy-document"/>
            </span>,
            <span class="drawing-item-delete" title="删除" onClick={ e => {
                deleteItem(currentItem, list)
                e.stopPropagation()
            }}>
                <i class="el-icon-delete"/>
            </span>
        ]
    }
}

const layouts = {
    // 列布局
    colFormItem (h, currentItem, index, list) {
        const { activeItem } = this.$listeners // 父组件监听的事件
        const config = currentItem.__config__
        const child = renderChildren.apply(this, arguments)
        console.log(123, this.activeId, config.formId, config)
        // 如果当前表单项活跃的话，添加active样式
        const className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item'
        // if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
        let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
        if (config.showLabel === false) labelWidth = '0'
        console.log('currentItem', currentItem)
        return (
            <el-col
                span={config.span}
                class={className}
                nativeOnClick={e => {
                    activeItem(currentItem)
                    e.stopPropagation()
                }}
            >

                <el-form-item
                    label-width={labelWidth}
                    label={config.showLabel ? config.label : ''}
                    required={config.required}
                >
                    <render
                        key={config.renderKey}
                        conf={currentItem}
                        onInput={e => {
                            this.$set(config, 'defaultValue', e)
                        }}
                    >
                        { child }
                    </render>
                </el-form-item>
                {components.itemBtns.apply(this, arguments)}
            </el-col>
        )
    },
    // 行布局
    rowFormItem (h, currentItem, index, list) {
        const { activeItem } = this.$listeners
        const config = currentItem.__config__
        const className = this.activeId === config.formId
            ? 'drawing-row-item active-from-item'
            : 'drawing-row-item'
        let child = renderChildren.apply(this, arguments)
        if (currentItem.type === 'flex') {
            child = <el-row type={currentItem.type} justify={currentItem.justify} align={currentItem.align}>
                {child}
            </el-row>
        }
        return (
            <el-col span={config.span}>
                <el-row
                    gutter={config.gutter}
                    class={className}
                    nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}
                >
                    <span class="component-name">{config.componentName}</span>
                    <draggable list={config.children || []} animation={340}
                        group="componentsGroup" class="drag-wrapper">
                        {child}
                    </draggable>
                    {components.itemBtns.apply(this, arguments)}
                </el-row>
            </el-col>
        )
    }
}

function renderChildren (h, currentItem, index, list) {
    const config = currentItem.__config__
    if (!Array.isArray(config.children)) return null
    return config.children.map((el, i) => {
        const layout = layouts[el.__config__.layout]
        if (layout) {
            return layout.call(this, h, el, i, config.children)
        }
        return layoutIsNotFound.call(this)
    })
}

function layoutIsNotFound () {
    throw new Error(`没有与${this.currentItem.__config__.layout}匹配的layout`)
}

export default {
    props: {
        drawingList: {
            type: Array,
            default: () => ([])
        },
        currentItem: {
            type: Object,
            default: () => ({})
        },
        index: {
            type: Number
        },
        activeId: {
            type: Number
        },
        formConf: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        draggable,
        render
    },
    render (h) {
        const layout = layouts[this.currentItem.__config__.layout]
        // 有布局的表单项
        if (layout) {
            return layout.call(this, h, this.currentItem, this.index, this.drawingList)
        }
        return layoutIsNotFound.call(this)
    }
}
</script>
