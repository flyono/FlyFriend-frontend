<template>
  <template v-if="user">
    <van-cell title="当前用户" :value="user?.username" />
    <van-cell title="个人信息" is-link to="/user/update" />
    <van-cell title="我创建的队伍" is-link to="/user/team/create" />
    <van-cell title="我加入的队伍" is-link to="/user/team/join" />
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
const router = useRouter();

onMounted(async () => {
  user.value = await getCurrentUser();
})


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