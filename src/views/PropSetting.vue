<template>
    <div class="setting">
        <el-tabs stretch v-model="currentTab" class="center-tabs">
            <el-tab-pane label="组件属性" name="field" />
            <el-tab-pane label="表单属性" name="form" />
        </el-tabs>
        <div class="setting-container">
            <el-scrollbar class="right-scrollbar">
                <el-form v-show="currentTab === 'field' && showField" size="small" label-width="90px">
                    <el-form-item v-if="activeData.__vModel__!==undefined" label="字段名">
                        <el-input v-model="activeData.__vModel__" placeholder="请输入字段名（v-model）" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.componentName!==undefined" label="组件名">
                        {{ activeData.__config__.componentName }}
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.label!==undefined" label="标题">
                        <el-input v-model="activeData.__config__.label" placeholder="请输入标题" @input="changeRenderKey" />
                    </el-form-item>
                    <el-form-item v-if="activeData.placeholder!==undefined" label="占位提示">
                        <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" @input="changeRenderKey" />
                    </el-form-item>
                    <el-form-item v-if="activeData['start-placeholder']!==undefined" label="开始占位">
                        <el-input v-model="activeData['start-placeholder']" placeholder="请输入占位提示" />
                    </el-form-item>
                    <el-form-item v-if="activeData['end-placeholder']!==undefined" label="结束占位">
                        <el-input v-model="activeData['end-placeholder']" placeholder="请输入占位提示" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.span!==undefined" label="表单栅格">
                        <el-slider v-model="activeData.__config__.span" :max="24" :min="1" :marks="{12:''}" @change="spanChange" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.layout==='rowFormItem'&&activeData.gutter!==undefined" label="栅格间隔">
                        <el-input-number v-model="activeData.gutter" :min="0" placeholder="栅格间隔" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.layout==='rowFormItem'&&activeData.type!==undefined" label="布局模式">
                        <el-radio-group v-model="activeData.type">
                            <el-radio-button label="default" />
                            <el-radio-button label="flex" />
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="activeData.justify!==undefined&&activeData.type==='flex'" label="水平排列">
                        <el-select v-model="activeData.justify" placeholder="请选择水平排列" :style="{width: '100%'}">
                            <el-option
                                v-for="(item, index) in justifyOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="activeData.align!==undefined&&activeData.type==='flex'" label="垂直排列">
                        <el-radio-group v-model="activeData.align">
                            <el-radio-button label="top" />
                            <el-radio-button label="middle" />
                            <el-radio-button label="bottom" />
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.labelWidth!==undefined" label="标签宽度">
                        <el-input v-model.number="activeData.__config__.labelWidth" type="number" placeholder="请输入标签宽度" />
                    </el-form-item>
                    <el-form-item v-if="activeData.style&&activeData.style.width!==undefined" label="组件宽度">
                        <el-input v-model="activeData.style.width" placeholder="请输入组件宽度" clearable />
                    </el-form-item>
                    <el-form-item v-if="activeData.__vModel__!==undefined" label="默认值">
                        <el-input
                            :value="setDefaultValue(activeData.__config__.defaultValue)"
                            placeholder="请输入默认值"
                            @input="onDefaultValueInput"
                        />
                    </el-form-item>
                    <el-form-item v-if="activeData.__slot__&&activeData.__slot__.prepend!==undefined" label="前缀">
                        <el-input v-model="activeData.__slot__.prepend" placeholder="请输入前缀" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__slot__&&activeData.__slot__.append!==undefined" label="后缀">
                        <el-input v-model="activeData.__slot__.append" placeholder="请输入后缀" />
                    </el-form-item>
                    <el-form-item v-if="activeData['prefix-icon']!==undefined" label="前图标">
                        <el-input v-model="activeData['prefix-icon']" placeholder="请输入前图标名称">
                            <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('prefix-icon')">
                                选择
                            </el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="activeData['suffix-icon'] !== undefined" label="后图标">
                        <el-input v-model="activeData['suffix-icon']" placeholder="请输入后图标名称">
                            <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('suffix-icon')">
                                选择
                            </el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        v-if="activeData['icon']!==undefined && activeData.__config__.tag === 'el-button'"
                        label="按钮图标"
                    >
                        <el-input v-model="activeData['icon']" placeholder="请输入按钮图标名称">
                            <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('icon')">
                                选择
                            </el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="选项分隔符">
                        <el-input v-model="activeData.separator" placeholder="请输入选项分隔符" />
                    </el-form-item>
                    <el-form-item v-if="activeData.autosize !== undefined" label="最小行数">
                        <el-input-number v-model="activeData.autosize.minRows" :min="1" placeholder="最小行数" />
                    </el-form-item>
                    <el-form-item v-if="activeData.autosize !== undefined" label="最大行数">
                        <el-input-number v-model="activeData.autosize.maxRows" :min="1" placeholder="最大行数" />
                    </el-form-item>
                    <el-form-item v-if="isShowMin" label="最小值">
                        <el-input-number v-model="activeData.min" placeholder="最小值" />
                    </el-form-item>
                    <el-form-item v-if="isShowMax" label="最大值">
                        <el-input-number v-model="activeData.max" placeholder="最大值" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="精度">
                        <el-input-number v-model="activeData.precision" :min="0" placeholder="精度" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="按钮位置">
                        <el-radio-group v-model="activeData['controls-position']">
                            <el-radio-button label="">
                                默认
                            </el-radio-button>
                            <el-radio-button label="right">
                                右侧
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="activeData.maxlength !== undefined" label="最多输入">
                        <el-input v-model="activeData.maxlength" placeholder="请输入字符长度">
                            <template slot="append">
                                个字符
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="activeData['active-value'] !== undefined" label="开启值">
                        <el-input
                            :value="setDefaultValue(activeData['active-value'])"
                            placeholder="请输入开启值"
                            @input="onSwitchValueInput($event, 'active-value')"
                        />
                    </el-form-item>
                    <el-form-item v-if="activeData['inactive-value'] !== undefined" label="关闭值">
                        <el-input
                            :value="setDefaultValue(activeData['inactive-value'])"
                            placeholder="请输入关闭值"
                            @input="onSwitchValueInput($event, 'inactive-value')"
                        />
                    </el-form-item>
                    <el-form-item
                        v-if="activeData.type !== undefined && 'el-date-picker' === activeData.__config__.tag"
                        label="时间类型"
                    >
                        <el-select
                            v-model="activeData.type"
                            placeholder="请选择时间类型"
                            :style="{ width: '100%' }"
                            @change="dateTypeChange"
                        >
                            <el-option
                                v-for="(item, index) in dateOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="activeData.name !== undefined" label="文件字段名">
                        <el-input v-model="activeData.name" placeholder="请输入上传文件字段名" />
                    </el-form-item>
                    <el-form-item v-if="activeData.accept !== undefined" label="文件类型">
                        <el-select
                            v-model="activeData.accept"
                            placeholder="请选择文件类型"
                            :style="{ width: '100%' }"
                            clearable
                        >
                            <el-option label="图片" value="image/*" />
                            <el-option label="视频" value="video/*" />
                            <el-option label="音频" value="audio/*" />
                            <el-option label="excel" value=".xls,.xlsx" />
                            <el-option label="word" value=".doc,.docx" />
                            <el-option label="pdf" value=".pdf" />
                            <el-option label="txt" value=".txt" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.fileSize !== undefined" label="文件大小">
                        <el-input v-model.number="activeData.__config__.fileSize" placeholder="请输入文件大小">
                            <el-select slot="append" v-model="activeData.__config__.sizeUnit" :style="{ width: '66px' }">
                                <el-option label="KB" value="KB" />
                                <el-option label="MB" value="MB" />
                                <el-option label="GB" value="GB" />
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="activeData.action !== undefined" label="上传地址">
                        <el-input v-model="activeData.action" placeholder="请输入上传地址" clearable />
                    </el-form-item>
                    <el-form-item v-if="activeData['list-type'] !== undefined" label="列表类型">
                        <el-radio-group v-model="activeData['list-type']" size="small">
                            <el-radio-button label="text">
                                text
                            </el-radio-button>
                            <el-radio-button label="picture">
                                picture
                            </el-radio-button>
                            <el-radio-button label="picture-card">
                                picture-card
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        v-if="activeData.type !== undefined && activeData.__config__.tag === 'el-button'"
                        label="按钮类型"
                    >
                        <el-select v-model="activeData.type" :style="{ width: '100%' }">
                            <el-option label="primary" value="primary" />
                            <el-option label="success" value="success" />
                            <el-option label="warning" value="warning" />
                            <el-option label="danger" value="danger" />
                            <el-option label="info" value="info" />
                            <el-option label="text" value="text" />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        v-if="activeData.__config__.buttonText !== undefined"
                        v-show="'picture-card' !== activeData['list-type']"
                        label="按钮文字"
                    >
                        <el-input v-model="activeData.__config__.buttonText" placeholder="请输入按钮文字" />
                    </el-form-item>
                    <el-form-item
                        v-if="activeData.__config__.tag === 'el-button'"
                        label="按钮文字"
                    >
                        <el-input v-model="activeData.__slot__.default" placeholder="请输入按钮文字" />
                    </el-form-item>
                    <el-form-item v-if="activeData['range-separator'] !== undefined" label="分隔符">
                        <el-input v-model="activeData['range-separator']" placeholder="请输入分隔符" />
                    </el-form-item>
                    <el-form-item v-if="activeData['picker-options'] !== undefined" label="时间段">
                        <el-input
                            v-model="activeData['picker-options'].selectableRange"
                            placeholder="请输入时间段"
                        />
                    </el-form-item>
                    <el-form-item v-if="activeData.format !== undefined" label="时间格式">
                        <el-input
                            :value="activeData.format"
                            placeholder="请输入时间格式"
                            @input="setTimeValue($event)"
                        />
                    </el-form-item>
                    <template v-if="['el-checkbox-group', 'el-radio-group', 'el-select'].indexOf(activeData.__config__.tag) > -1">
                        <el-divider>选项</el-divider>
                        <draggable
                            :list="activeData.__slot__.options"
                            :animation="340"
                            group="selectItem"
                            handle=".option-drag"
                        >
                            <div v-for="(item, index) in activeData.__slot__.options" :key="index" class="select-item">
                                <div class="select-line-icon option-drag">
                                    <i class="el-icon-s-operation" />
                                </div>
                                <el-input v-model="item.label" placeholder="选项名" size="small" />
                                <el-input
                                    placeholder="选项值"
                                    size="small"
                                    :value="item.value"
                                    @input="setOptionValue(item, $event)"
                                />
                                <div class="close-btn select-line-icon" @click="activeData.__slot__.options.splice(index, 1)">
                                    <i class="el-icon-remove-outline" />
                                </div>
                            </div>
                        </draggable>
                        <div style="margin-left: 20px;">
                            <el-button
                                style="padding-bottom: 0"
                                icon="el-icon-circle-plus-outline"
                                type="text"
                                @click="addSelectItem"
                            >
                                添加选项
                            </el-button>
                        </div>
                        <el-divider />
                    </template>

                    <el-form-item v-if="activeData['active-color'] !== undefined" label="开启颜色">
                        <el-color-picker v-model="activeData['active-color']" />
                    </el-form-item>
                    <el-form-item v-if="activeData['inactive-color'] !== undefined" label="关闭颜色">
                        <el-color-picker v-model="activeData['inactive-color']" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.showLabel !== undefined
                        && activeData.__config__.labelWidth !== undefined" label="显示标签"
                    >
                        <el-switch v-model="activeData.__config__.showLabel" />
                    </el-form-item>
                    <el-form-item v-if="activeData['show-text'] !== undefined" label="辅助文字">
                        <el-switch v-model="activeData['show-text']" @change="rateTextChange" />
                    </el-form-item>
                    <el-form-item v-if="activeData['show-score'] !== undefined" label="显示分数">
                        <el-switch v-model="activeData['show-score']" @change="rateScoreChange" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tag === 'el-color-picker'" label="颜色格式">
                        <el-select
                            v-model="activeData['color-format']"
                            placeholder="请选择颜色格式"
                            :style="{ width: '100%' }"
                            clearable
                            @change="colorFormatChange"
                        >
                            <el-option
                                v-for="(item, index) in colorFormatOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        v-if="activeData.size !== undefined &&
                            (activeData.__config__.optionType === 'button' ||
                                activeData.__config__.border ||
                                activeData.__config__.tag === 'el-color-picker' ||
                                activeData.__config__.tag === 'el-button')"
                        label="组件尺寸"
                    >
                        <el-radio-group v-model="activeData.size">
                            <el-radio-button label="medium">
                                中等
                            </el-radio-button>
                            <el-radio-button label="small">
                                较小
                            </el-radio-button>
                            <el-radio-button label="mini">
                                迷你
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="activeData['show-word-limit'] !== undefined" label="输入统计">
                        <el-switch v-model="activeData['show-word-limit']" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="严格步数">
                        <el-switch v-model="activeData['step-strictly']" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="任选层级">
                        <el-switch v-model="activeData.props.props.checkStrictly" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="是否多选">
                        <el-switch v-model="activeData.props.props.multiple" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="展示全路径">
                        <el-switch v-model="activeData['show-all-levels']" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="可否筛选">
                        <el-switch v-model="activeData.filterable" />
                    </el-form-item>
                    <el-form-item v-if="activeData.clearable !== undefined" label="能否清空">
                        <el-switch v-model="activeData.clearable" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.showTip !== undefined" label="显示提示">
                        <el-switch v-model="activeData.__config__.showTip" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tag === 'el-upload'" label="多选文件">
                        <el-switch v-model="activeData.multiple" />
                    </el-form-item>
                    <el-form-item v-if="activeData['auto-upload'] !== undefined" label="自动上传">
                        <el-switch v-model="activeData['auto-upload']" />
                    </el-form-item>
                    <el-form-item v-if="activeData.readonly !== undefined" label="是否只读">
                        <el-switch v-model="activeData.readonly" />
                    </el-form-item>
                    <el-form-item v-if="activeData.disabled !== undefined" label="是否禁用">
                        <el-switch v-model="activeData.disabled" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tag === 'el-select'" label="能否搜索">
                        <el-switch v-model="activeData.filterable" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tag === 'el-select'" label="是否多选">
                        <el-switch v-model="activeData.multiple" @change="multipleChange" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.required !== undefined" label="是否必填">
                        <el-switch v-model="activeData.__config__.required" />
                    </el-form-item>
                    <template v-if="Array.isArray(activeData.__config__.regList)">
                        <el-divider>正则校验</el-divider>
                        <div
                            v-for="(item, index) in activeData.__config__.regList"
                            :key="index"
                            class="reg-item"
                        >
                            <span class="close-btn" @click="activeData.__config__.regList.splice(index, 1)">
                                <i class="el-icon-close" />
                            </span>
                            <el-form-item label="表达式">
                                <el-input v-model="item.pattern" placeholder="请输入正则" />
                            </el-form-item>
                            <el-form-item label="错误提示" style="margin-bottom:0">
                                <el-input v-model="item.message" placeholder="请输入错误提示" />
                            </el-form-item>
                        </div>
                        <div style="margin-left: 20px">
                            <el-button icon="el-icon-circle-plus-outline" type="text" @click="addReg">
                                添加规则
                            </el-button>
                        </div>
                    </template>
                </el-form>

                <!-- 表单属性 -->
                <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
                    <el-form-item label="表单名">
                        <el-input v-model="formConf.formRef" placeholder="请输入表单名（ref）" />
                    </el-form-item>
                    <el-form-item label="表单模型">
                        <el-input v-model="formConf.formModel" placeholder="请输入数据模型" />
                    </el-form-item>
                    <el-form-item label="校验模型">
                        <el-input v-model="formConf.formRules" placeholder="请输入校验模型" />
                    </el-form-item>
                    <el-form-item label="表单尺寸">
                        <el-radio-group v-model="formConf.size">
                            <el-radio-button label="medium">
                                中等
                            </el-radio-button>
                            <el-radio-button label="small">
                                较小
                            </el-radio-button>
                            <el-radio-button label="mini">
                                迷你
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="标签对齐">
                        <el-radio-group v-model="formConf.labelPosition">
                            <el-radio-button label="left">
                                左对齐
                            </el-radio-button>
                            <el-radio-button label="right">
                                右对齐
                            </el-radio-button>
                            <el-radio-button label="top">
                                顶部对齐
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="标签宽度">
                        <el-input v-model.number="formConf.labelWidth" type="number" placeholder="请输入标签宽度" />
                    </el-form-item>
                    <el-form-item label="栅格间隔">
                        <el-input-number v-model="formConf.gutter" :min="0" placeholder="栅格间隔" />
                    </el-form-item>
                    <el-form-item label="禁用表单">
                        <el-switch v-model="formConf.disabled" />
                    </el-form-item>
                    <el-form-item label="表单按钮">
                        <el-switch v-model="formConf.formBtns" />
                    </el-form-item>
                    <el-form-item label="显示未选中组件边框">
                        <el-switch v-model="formConf.unFocusedComponentBorder" />
                    </el-form-item>
                </el-form>
            </el-scrollbar>
        </div>
        <icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon" />
    </div>
</template>

<script>
import IconsDialog from './IconsDialog.vue'
import { isNumberStr } from '@/utils/index'
const dateTimeFormat = {
    date: 'yyyy-MM-dd',
    week: 'yyyy 第 WW 周',
    month: 'yyyy-MM',
    year: 'yyyy',
    datetime: 'yyyy-MM-dd HH:mm:ss',
    daterange: 'yyyy-MM-dd',
    monthrange: 'yyyy-MM',
    datetimerange: 'yyyy-MM-dd HH:mm:ss'
}

export default {
    props: {
        activeData: {
            type: Object,
            default: () => ({})
        },
        formConf: {
            type: Object,
            default: () => ({})
        },
        showField: {
            type: Boolean,
            default: false
        }
    },
    components: {
        IconsDialog
    },
    data () {
        return {
            currentTab: 'field',
            iconsVisible: false,
            currentIconModel: '',
            colorFormatOptions: [
                {
                    label: 'hex',
                    value: 'hex'
                },
                {
                    label: 'rgb',
                    value: 'rgb'
                },
                {
                    label: 'rgba',
                    value: 'rgba'
                },
                {
                    label: 'hsv',
                    value: 'hsv'
                },
                {
                    label: 'hsl',
                    value: 'hsl'
                }
            ],
            justifyOptions: [
                {
                    label: 'start',
                    value: 'start'
                },
                {
                    label: 'end',
                    value: 'end'
                },
                {
                    label: 'center',
                    value: 'center'
                },
                {
                    label: 'space-around',
                    value: 'space-around'
                },
                {
                    label: 'space-between',
                    value: 'space-between'
                }
            ],
            dateTypeOptions: [
                {
                    label: '日(date)',
                    value: 'date'
                },
                {
                    label: '周(week)',
                    value: 'week'
                },
                {
                    label: '月(month)',
                    value: 'month'
                },
                {
                    label: '年(year)',
                    value: 'year'
                },
                {
                    label: '日期时间(datetime)',
                    value: 'datetime'
                }
            ],
            dateRangeTypeOptions: [
                {
                    label: '日期范围(daterange)',
                    value: 'daterange'
                },
                {
                    label: '月范围(monthrange)',
                    value: 'monthrange'
                },
                {
                    label: '日期时间范围(datetimerange)',
                    value: 'datetimerange'
                }
            ]
        }
    },
    methods: {
        // 多选框的change回调
        multipleChange (val) {
            console.log(val)
            this.$set(this.activeData.__config__, 'defaultValue', val ? [] : '')
        },
        // 输入框input事件
        changeRenderKey (e) {
            this.$emit('changeRenderKey', e.target.value)
        },
        spanChange (val) {
            console.log(val)
        },
        rateTextChange (val) {
            if (val) this.activeData['show-score'] = false
        },
        rateScoreChange (val) {
            if (val) this.activeData['show-text'] = false
        },
        setDefaultValue (val) {
            console.log('setDefaultValue', val)
            if (Array.isArray(val)) {
                return val.join(',')
            }
            // if (['string', 'number'].indexOf(typeof val) > -1) {
            //   return val
            // }
            if (typeof val === 'boolean') {
                return `${val}`
            }
            return val
        },
        onSwitchValueInput (val, name) {
            if (['true', 'false'].indexOf(val) > -1) {
                this.$set(this.activeData, name, JSON.parse(val))
            } else {
                this.$set(this.activeData, name, isNumberStr(val) ? +val : val)
            }
        },
        onDefaultValueInput (str) {
            console.log('onDefaultValueInput', str)
            if (Array.isArray(this.activeData.__config__.defaultValue)) {
                // 数组
                this.$set(
                    this.activeData.__config__,
                    'defaultValue',
                    str.split(',').map(val => (isNumberStr(val) ? +val : val))
                )
            } else if (['true', 'false'].indexOf(str) > -1) {
                // 布尔
                this.$set(this.activeData.__config__, 'defaultValue', JSON.parse(str))
            } else {
                // 字符串和数字
                this.$set(
                    this.activeData.__config__,
                    'defaultValue',
                    isNumberStr(str) ? +str : str
                )
            }
        },
        // 打开图标选择弹窗
        openIconsDialog (model) {
            this.iconsVisible = true
            this.currentIconModel = model
        },
        // 设置图标
        setIcon (val) {
            this.activeData[this.currentIconModel] = val
        },
        // 选择颜色格式
        colorFormatChange (val) {
            this.activeData.__config__.defaultValue = null
            this.activeData['show-alpha'] = val.indexOf('a') > -1
            this.activeData.__config__.renderKey = +new Date() // 更新renderKey,重新渲染该组件
        },
        // 新增效验规则
        addReg () {
            this.activeData.__config__.regList.push({
                pattern: '',
                message: ''
            })
        },
        // 时间类型选择后的回调
        dateTypeChange (val) {
            this.setTimeValue(dateTimeFormat[val], val)
        },
        // 设置时间选择器时间格式
        setTimeValue (val, type) {
            const valueFormat = type === 'week' ? dateTimeFormat.date : val
            this.$set(this.activeData.__config__, 'defaultValue', null)
            this.$set(this.activeData, 'value-format', valueFormat)
            this.$set(this.activeData, 'format', val)
        },
        // 单选框组、多选框组、下拉选择器设置值
        setOptionValue (item, val) {
            item.value = isNumberStr(val) ? +val : val
        },
        // 单选框组、多选框组、下拉选择器添加新选项
        addSelectItem () {
            this.activeData.__slot__.options.push({
                label: '',
                value: ''
            })
        }
    },
    computed: {
        activeTag () {
            return this.activeData.__config__.tag
        },
        isShowMin () {
            return ['el-input-number', 'el-slider'].indexOf(this.activeTag) > -1
        },
        isShowMax () {
            return ['el-input-number', 'el-slider', 'el-rate'].indexOf(this.activeTag) > -1
        },
        dateOptions () {
            if (
                this.activeData.type !== undefined &&
        this.activeData.__config__.tag === 'el-date-picker'
            ) {
                if (this.activeData['start-placeholder'] === undefined) {
                    return this.dateTypeOptions
                }
                return this.dateRangeTypeOptions
            }
            return []
        }
    },
    created () {

    }
}
</script>
<style lang='scss' scoped>
.setting {
    width: 350px;
    background-color: #fff;
    overflow-y: auto;
    .field-box {
        position: relative;
        height: calc(100vh - 42px);
        box-sizing: border-box;
        overflow: hidden;
    }
    .el-scrollbar {
        height: 100%;
    }
    .el-form-item {
        padding-right: 15px;
    }
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}
.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
.node-label{
  font-size: 14px;
}
.node-icon{
  color: #bebfc3;
}

.reg-item {
    padding: 12px 6px;
    background: #f8f8f8;
    position: relative;
    border-radius: 4px;
    .close-btn {
        position: absolute;
        right: 0;
        top: -6px;
        display: block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        color: #fff;
        text-align: center;
        z-index: 1;
        cursor: pointer;
        font-size: 12px;
    }
}
.reg-item + .reg-item {
    margin-top: 15px;
}
</style>
