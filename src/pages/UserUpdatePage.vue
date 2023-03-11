<template>
  <template v-if="user">
    <van-cell title="昵称" is-link to="/user/edit" :value="user.username"
              @click="toEdit('username','昵称',user.username)"/>
    <van-cell title="用户账号" :value="user.userAccount"/>
    <van-cell title="头像" is-link to="/user/edit">
      <img style="height: 48px" :src="user.avatarUrl">
    </van-cell>
    <van-cell title="性别" is-link :value="user.gender" @click="toEdit('gender','性别',user.gender)"/>
    <van-cell title="电话" is-link to="/user/edit" :value="user.phone" @click="toEdit('phone','电话',user.phone)"/>
    <van-cell title="邮箱" is-link to="/user/edit" :value="user.email"/>
    <van-cell title="学号" :value="user.studyCode"/>
    <van-cell title="注册时间" :value="user.createTime.toLocaleString()"/>
  </template>
</template>
<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user";

// const user = {
//   id: 1,
//   username: 'Flyone',
//   userAccount: 'admin',
//   avatarUrl: 'https://cdn.pixabay.com/photo/2022/08/08/20/23/cardinal-7373562__480.jpg',
//   gender: '男',
//   phone: '12312414131',
//   email: '12314112431',
//   userStatus: 1,
//   userRole: 1,
//   studyCode: 2021211592,
//   createTime: new Date(),
// };

const user = ref()

onMounted(async () => {
  user.value = await getCurrentUser();
  // if (res.data === 0) {
  //   user.value = res.data;
  //   Toast.success('获取用户信息成功');
  // } else {
  //   Toast.fail('获取用户信息失败');
  // }
})

const router = useRouter();

const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      editName,
      currentValue,
    }
  })
}
</script>

<style scoped>

</style>