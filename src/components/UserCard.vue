<template>
  <van-config-provider :theme-vars="themeVars">
    <van-card
        :title="`${user.username}`"
        :desc="`学号：${user.studyCode}`"
        :thumb="imageUrl+user.avatarUrl"
        @click-thumb="toEdit('avatarUrl','头像',user.avatarUrl,'image')"
    >
      <template #tags>
        <p/>
        <div class="tagInfo">
          <p class="tagInfo">我的标签:</p>
          <van-space wrap>
            <van-tag plain type="primary" closeable v-for="tag in user.tags" @close="doClose(tag)" style="margin-top: 6px">
              {{ tag }}
            </van-tag>
          </van-space>
          <van-button style="margin-left: 10px;height: 16px;margin-bottom: 8px" icon="plus" size="mini" type="primary"
                      @click="show = true"/>
        </div>
      </template>
      <template #origin-price>

      </template>
      <template #footer>

      </template>
    </van-card>
  </van-config-provider>
  <van-dialog v-model:show="show" title="标签选择" show-cancel-button @open="onOpen" @confirm="onConfirm">
      <van-tree-select
          v-model:active-id="activeIds"
          v-model:main-active-index="activeIndex"
          :items="tagList"
          max="10"
      />
  </van-dialog>

</template>

<script setup lang="ts">
import {UserType} from "../models/user";
import {useRouter} from "vue-router";
import {ref} from "vue";
import {Dialog, Toast} from "vant";
import myAxios from "../plugins/myAxios";

const router = useRouter();
const VanDialog = Dialog.Component;

const imageUrl =
    process.env.NODE_ENV
    === 'development' ?
        'http://localhost:8080/api/images/' : 'https://backend.flyone.space/api/images/'

interface UserCardProp {
  user: UserType[];
}

const prop = withDefaults(defineProps<UserCardProp>(), {
  // @ts-ignore
  user: [] as UserType[],
});

/**
 * 跳转至编辑页面
 * @param editKey
 * @param editName
 * @param currentValue
 * @param type
 */
const toEdit = (editKey: string, editName: string, currentValue: string, type: string) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      editName,
      currentValue,
      type,
    }
  })
}


/**
 * 添加Tag
 */
const onOpen = () => {
  Toast.success('选择符合的标签吧！')
}
const show = ref(false);

// 默认已选中的标签
const activeIds = ref(prop.user.tags);
const activeIndex = ref(0);
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
    ],
  },
  {
    text: '方向',
    children: [
      {text: 'Java', id: 'Java'},
      {text: 'Python', id: 'Python'},
      {text: 'C++', id: 'C++'},
      {text: 'C', id: 'C'},
      {text: 'Go', id: 'Go'},
      {text: 'Rust', id: 'Rust'},
      {text: '前端', id: '前端'},
      {text: 'UI设计', id: '大四'},
    ],
  },
];
const tagList = ref(originTagList);
const onConfirm = async () => {
  prop.user.tags = activeIds;
  await myAxios.post("/user/update",{
    "id": prop.user.id,
    "tags": JSON.stringify(prop.user.tags)
  })
}
//移除标签
const doClose = async (tag) => {
  activeIds.value = Array.from(activeIds.value).filter(item => {
    return item !== tag  //结果为true保留，false过滤
  })
  prop.user.tags = activeIds;
  await myAxios.post("/user/update",{
    "id": prop.user.id,
    "tags": JSON.stringify(prop.user.tags),
  })
}
/**
 * 卡片样式设置
 */
const themeVars = {
  cardDescLineHeight: '18px',
  cardFontSize: 'normal',
  buttonPrimaryBorderColor: '#07c160',
  buttonPrimaryBackgroundColor: '#07c160',
};
/**
 * 个人信息 todo
 */

</script>

<style scoped>

</style>