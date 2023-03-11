<template>
  <user-card-list :user-list="userList"/>
  <van-empty v-if="!userList || userList.length<1" description="数据为空"/>
</template>

<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {Toast} from "vant";
import qs from 'qs';

const route = useRoute();
const {tags} = route.query;

const userList = ref([]);//存放用户列表

onMounted(async () => {     //异步调用
  const userListData = await myAxios.get('/user/search/tags', {
    params: {
      tagNameList: tags
    },
    paramsSerializer: {
      serialize: function (params) {
        // return qs.stringify(params,{arrayFormat:'repeat'})
        return qs.stringify(params, {indices: false})
      }
    }
  })
      .then(function (response) {
        console.log('/user/search/tags succeed', response);
        return response?.data;  //返回数据  ?.可选链操作符，避免数据为null或undefined时报错
      })
      .catch(function (error) {
        console.error('/user/search/tags error', error);
        Toast.fail('请求失败!');
      })
  // console.log(userListData)
  if (userListData) {
    userListData.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
    })
    userList.value = userListData;
  }
})


// const mockUser = {
//   id: 12345,
//   username: 'Flyone',
//   userAccount: 'string',
//   avatarUrl: 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/2855/%E5%9B%BE%E6%A0%87.png',
//   gender: 0,
//   profile: '阿巴阿巴阿巴巴  阿巴阿巴阿巴巴 阿巴阿巴阿巴巴',
//   phone: '12312312312',
//   email: '1231212412@qq.com',
//   userStatus: 1,
//   userRole: 1,
//   studyCode: '2021211592',
//   tags: ['Java', 'emo', '打工中', 'Java', 'emo', '打工中', 'Java', 'emo', '打工中'],
//   createTime: new Date(),
// }

</script>

<style scoped>

</style>