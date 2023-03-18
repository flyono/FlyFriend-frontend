<template>
  <form action="/">
    <!--搜索组件-->
    <van-search
        v-model="searchText"
        show-action
        placeholder="请输入要搜索的标签"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>
  <!--分割线组件-->
  <van-divider content-position="left">已选标签</van-divider>
  <div v-if="activeIds.length===0">暂无，请选择标签</div>
  <!--Space 间距组件-->
  <van-space wrap>
    <!--标签组件-->
    <van-tag v-for="tag in activeIds" closeable size="medium" type="primary" @close="doClose(tag)">
      {{ tag }}
    </van-tag>
  </van-space>
  <!--分割线组件-->
  <van-divider content-position="left">选择标签</van-divider>
  <!--TreeSelect 分类选择-->
  <van-tree-select
      v-model:active-id="activeIds"
      v-model:main-active-index="activeIndex"
      :items="tagList"
  />
  <div style="padding: 12px">
    <van-button block type="primary" @click="doSearchResult()">搜索</van-button>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from "vue-router";

const router = useRouter();

const searchText = ref('');
// 标签列表-原数据 TODO 采用数据库Tag标签
const originTagList = [
  {
    text: '性别',
    children: [
      {text: '男', id: '男'},
      {text: '女', id: '女'},
    ],
  },
  {
    text: '年级',
    children: [
      {text: '大一', id: '大一'},
      {text: '大二', id: '大二'},
      {text: '大三', id: '大三'},
      {text: '大四', id: '大四'},
      {text: '大四', id: '大5aaaaaa'},
      {text: '大四', id: '大6bbbbbb'},
      {text: '大四', id: '大7bbbbbbb'},
      {text: '大四', id: '大8'},
      {text: '大四', id: '大9'},
    ],
  },
];
const tagList = ref(originTagList);

/**
 * 搜索过滤
 * @param val
 */
const onSearch = (val) => {
  tagList.value = originTagList.map(parentTag => {
    const tempChildren = [...parentTag.children];
    const tempParentTag = {...parentTag};
    tempParentTag.children = tempChildren.filter(item => item.text.includes(searchText.value))
    return tempParentTag;
  })
};
//取消按钮效果
const onCancel = () => {
  searchText.value = '';
  tagList.value = originTagList;
};
// 默认已选中的标签
const activeIds = ref([]);
const activeIndex = ref(0);

//移除标签
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter(item => {
    return item !== tag  //结果为true保留，false过滤
  })
}
/**
 * 执行搜索
 */
const doSearchResult = () => {
  router.push({
    path: '/user/list',
    query: {
      tags: activeIds.value
    }
  })
}
</script>

<style scoped>

</style>