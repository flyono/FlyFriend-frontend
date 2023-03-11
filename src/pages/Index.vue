<template>
  <van-cell center title="心动模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode" size="24"/>
    </template>
  </van-cell>
  <user-card-list :user-list="userList" :loading="loading"/>
  <van-skeleton title avatar :row="3" :loading="true">
    <div>实际内容</div>
  </van-skeleton>
  <van-empty v-if="!userList || userList.length<1" description="搜索结果为空"/>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {ref, watchEffect} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import UserCardList from "../components/UserCardList.vue";
import {UserType} from "../models/user";


const route = useRoute();
const isMatchMode = ref<boolean>(false)

const userList = ref([]);//存放用户列表
const loading = ref(true);

const loadData = async () => {
  let userListData = [];
  loading.value = true;
  // 心动模式,根据标签匹配用户
  if (isMatchMode.value) {
    const num = 10;
    userListData = await myAxios.get('/user/match', {
      params: {
        num,
      },
    })
        .then(function (response) {
          console.log('/user/match succeed', response);
          return response?.data;  //返回数据  ?.可选链操作符，避免数据为null或undefined时报错
        })
        .catch(function (error) {
          console.error('/user/match error', error);
          Toast.fail('请求失败!');
        })
    if (userListData) {
      userListData.forEach((user: UserType)=> {
        if (user.tags) {
          user.tags = JSON.parse(user.tags)
        }
      })
      userList.value = userListData;
    }
  }else {
    // 普通模式,用户
    userListData = await myAxios.get('/user/recommend', {
      params: {
        pageSize: 8,
        pageNum: 1,
      },
    })
        .then(function (response) {
          console.log('/user/recommend succeed', response);
          return response?.data.records;  //返回数据  ?.可选链操作符，避免数据为null或undefined时报错
        })
        .catch(function (error) {
          console.error('/user/recommend error', error);
          Toast.fail('请求失败!');
        })
// console.log(userListData)
    if (userListData) {
      userListData.forEach((user: UserType) => {
        if (user.tags) {
          user.tags = JSON.parse(user.tags)
        }
      })
      userList.value = userListData;
    }
  }
  loading.value = false;
}

watchEffect(() => {
  loadData();
})


</script>

<style scoped>

</style>yle>