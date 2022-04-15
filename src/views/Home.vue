<template>
    <div class="container">
        <HeaderBar />
        <div class="content">
            <div class="components-list">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="物料区" name="first">
                        <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
                            <div class="components-title">
                                <!-- <svg-icon icon-class="component" /> -->
                                {{ item.title }}
                            </div>
                            <draggable
                                class="components-draggable"
                                :list="item.list"
                                :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                                :clone="cloneComponent"
                                draggable=".components-item"
                                :sort="false"
                                @end="onEnd"
                            >
                                <div
                                    v-for="(element, index) in item.list"
                                    :key="index"
                                    class="components-item"
                                    @click="addComponent(element)"
                                >
                                    <div class="components-body">
                                        <!-- <svg-icon :icon-class="element.__config__.tagIcon" /> -->
                                        {{ element.__config__.label }}
                                    </div>
                                </div>
                            </draggable>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="常用模板" name="second">
                        常用模板
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="center-board">
                <el-row class="center-board-row" :gutter="formConf.gutter">
                    <el-form
                        :size="formConf.size"
                        :label-position="formConf.labelPosition"
                        :disabled="formConf.disabled"
                        :label-width="formConf.labelWidth + 'px'"
                    >
                        <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
                            <draggable-item
                                v-for="(item, index) in drawingList"
                                :key="item.renderKey"
                                :current-item="item"
                                :index="index"
                                :activeId="activeId"
                                :form-conf="formConf"
                                :drawingList="drawingList"
                                @activeItem="activeFormItem"
                                @copyItem="drawingItemCopy"
                                @deleteItem="drawingItemDelete"
                            ></draggable-item>
                        </draggable>
                    </el-form>
                </el-row>
            </div>
            <PropSetting />
        </div>
    </div>
</template>

<script>
import HeaderBar from './HeaderBar.vue'
import PropSetting from './PropSetting.vue'
import DraggableItem from './DraggableItem.vue'
import draggable from 'vuedraggable'
import {
    inputComponents, selectComponents, layoutComponents, formConf
} from '@/components/generator/config'
import drawingDefalut from '@/components/generator/drawingDefalut'
import { deepClone } from '@/utils'

let tempActiveData

export default {
    components: {
        draggable,
        HeaderBar,
        DraggableItem,
        PropSetting
    },
    data () {
        return {
            activeName: 'first',
            leftComponents: [
                {
                    title: '输入型组件',
                    list: inputComponents
                },
                {
                    title: '选择型组件',
                    list: selectComponents
                },
                {
                    title: '布局型组件',
                    list: layoutComponents
                }
            ],
            formConf,
            drawingList: drawingDefalut,
            activeId: drawingDefalut[0].formId,
            activeData: {}, // 当前活动的表单项，用于右侧属性设置
            idGlobal: 100
        }
    },
    methods: {
        // 复制表单项
        drawingItemCopy (item, list) {
            let clone = deepClone(item)
            clone = this.createIdAndKey(clone)
            list.push(clone)
            this.activeFormItem(clone)
        },
        // 删除表单项
        drawingItemDelete (item, list) {
            list.splice(item, 1)
            // 删除后如果列表还有值，则将活跃项置为第一项 TODO：优化为置为删除项的后一项(如果有)
            const len = this.drawingList.length
            if (len) {
                this.activeFormItem(this.drawingList[0])
            }
        },
        handleClick (tab) {
            console.log(tab)
        },
        // 设置当前活跃的表单项
        activeFormItem (currentItem) {
            this.activeData = currentItem
            this.activeId = currentItem.__config__.formId
            console.log(this.activeId)
        },
        // 单击某个组件时
        addComponent (item) {
            const clone = this.cloneComponent(item)
            this.drawingList.push(clone)
            this.activeFormItem(clone)
        },
        // 克隆数据方法 ele当前元素的值
        cloneComponent (ele) {
            const clone = deepClone(ele)
            const config = clone.__config__
            // config.span = this.formConf.span // 生成代码时，会根据span做精简判断
            this.createIdAndKey(clone)
            clone.placeholder !== undefined && (clone.placeholder += config.label)
            tempActiveData = clone
            return tempActiveData
        },
        // 给每个表单项创建唯一的id和renderKey
        createIdAndKey (item) {
            const config = item.__config__
            config.formId = ++this.idGlobal
            config.renderKey = `${config.formId}${+new Date()}` // 确保每个表单项的唯一性
            console.log('createIdAndKey', item)
            // 给表单项加入v-model的绑定
            if (config.layout === 'colFormItem') {
                item.__vModel__ = `Field${this.idGlobal}`
            } else if (config.layout === 'rowFormItem') {
                config.componentName = `row${this.idGlobal}`
                !Array.isArray(config.children) && (config.children = [])
                delete config.label // rowFormItem 不需要配置label属性
            }
            // 目前只需要对表格组件拓展是使用到TODO
            if (Array.isArray(config.children)) {
                config.children = config.children.map(childItem => this.createIdAndKey(childItem))
            }
            return item
        },
        // 拖拽结束时的回调，e当前拖拽的元素
        onEnd (e) {
            // 针对动态添加的数据可以这里做处理
            // TODO
            this.activeData = tempActiveData
            this.activeId = this.idGlobal
        }
    },
    computed: {

    },
    mounted () {
        this.activeFormItem(this.drawingList[0])
    }
}
</script>
<style lang='scss' scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #edf2f7;
  padding: 20px;
  .content {
    display: flex;
    height: calc(100% - 50px);
    overflow: hidden;
    .components-list {
        width: 300px;
        background-color: #fff;
        height: 100%;
        padding: 0 15px;
        overflow: auto;
        .components-title {
            color: #000;
            font-size: 16px;
            margin: 15px 0;
        }
        .components-draggable {
            display: flex;
            flex-wrap: wrap;
            .components-item {
                width: 50%;
                .components-body {
                    margin: 5px;
                    border: 1px solid #DCDFE6;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-size: 14px;
                    color: #909399;
                    cursor: move;
                }
            }
        }
    }
    .center-board {
        border: 1px solid #ddd;
        flex: 1;
        margin: 0 10px;
        overflow-x: auto;
        background-color: #fff;
        padding: 10px;
        .center-board-row {
            margin: 0 !important;
            height: 100%;
            .el-form {
                height: 100%;
                .drawing-board {
                    height: 100%;
                }
            }
        }
    }
  }
}
</style>
