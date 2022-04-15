export default {
    options (h, conf, key) {
        const list = []
        conf.__slot__.options.forEach(item => {
            console.log(5, 'item', item)
            list.push(<el-option label={item.label} value={item.value} disabled={item.disabled}></el-option>)
        })
        return list
    }
}

/**
 <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
 */
