<template>
    <div class="header">
        <div class="back">返回</div>
        <div class="actions">
            <el-button type="danger" size="small">清除</el-button>
            <el-button size="small">预览</el-button>
            <el-button type="primary" size="small">发布</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HeaderBar',
    data () {
        return {

        }
    },
    methods: {

    },
    computed: {

    },
    created () {

    }
}
</script>
<style lang='scss' scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: #fff;
    line-height: 50px;
    border: 1px solid #eee;
    box-shadow: 0 0 2px 1px #ddd;
    margin-bottom: 10px;
    .actions {
        display: flex;
        align-items: center;
    }
}
</style>
