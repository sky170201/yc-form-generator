<template>
    <!-- 外链的显示方式-->
    <div
        v-if="isExternal"
        :style="styleExternalIcon"
        class="svg-external-icon svg-icon"
        v-on="$listeners"
    >
    </div>
    <svg
        v-else
        :class="svgClass"
        aria-hidden="true"
        v-on="$listeners"
    >
        <use :xlink:href="iconName" /> <!-- #icon-password-->
    </svg>
</template>

<script>
function isExternal (path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

export default {
    name: 'SvgIcon',
    props: {
        iconClass: {
            type: String,
            required: true
        },
        className: {
            type: String,
            default: ''
        }
    },
    computed: {
        isExternal () {
            return isExternal(this.iconClass)
        },
        iconName () {
            return `#icon-${this.iconClass}` // #icon-password
        },
        svgClass () {
            if (this.className) {
                return `svg-icon ${this.className}`
            }
            return 'svg-icon'
        },
        styleExternalIcon () {
            return {
                mask: `url(${this.iconClass}) no-repeat 50% 50%`,
                '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
            }
        }
    }
}
</script>
<style lang='scss' scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
.svg-external-icon {
    background-color: currentColor;
    mask-size: cover!important;
    display: inline-block;
}
</style>
