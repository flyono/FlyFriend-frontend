<template>
  <template v-if="user">

    <user-card :user="user" />

    <van-cell title="昵称" is-link to="/user/edit" :value="user.username"
              @click="toEdit('username','昵称',user.username,'string')"/>

    <van-cell title="用户账号" :value="user.userAccount"/>

    <van-cell title="性别" is-link :value="user.gender === null ? ' ' : user.gender === 0 ? '男' : '女'"
              @click="toEdit('gender','性别',user.gender,'gender')"/>
    <van-cell title="电话" is-link to="/user/edit" :value="user.phone"
              @click="toEdit('phone','电话',user.phone,'string')"/>
    <van-cell title="邮箱" is-link to="/user/edit" :value="user.email"
              @click="toEdit('email','邮箱',user.email,'string')"/>
    <van-cell title="学号" :value="user.studyCode"/>


    <van-cell title="我创建的队伍" is-link to="/myCreateTeam"/>
    <van-cell title="我加入的队伍" is-link to="/myJoinTeam"/>

    <van-cell title="注册时间" :value="user.createTime"/>
    <van-cell/>
    <van-cell/>

    <van-button type="danger" plain block @click="userLogout">退出登录</van-button>
  </template>
</template>
<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user";
import {Dialog, Toast} from "vant";
import myAxios, {imageUrl} from "../plugins/myAxios";
import UserCard from "../components/UserCard.vue";

const user = ref()

let time = '';
let img = '';

onMounted(async () => {
  user.value = await getCurrentUser();
  /**
   * 处理时间
   */
  time = user.value.createTime;
  user.value.createTime = time.split('T')[0];
  img = user.value.avatarUrl;
  /**
   * 标签序列化
   */
  if(user.value.tags){
    user.value.tags = JSON.parse(user.value.tags)
  }
})


const router = useRouter();

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
 * 退出登录
 */
const userLogout = () => {
  Dialog.confirm({
    title: '确认退出？',
  })
      .then(async () => {
        const res = await myAxios.post('/user/logout');
        if (res.code === 0 && res.data > 0) {
          Toast.success('已退出');
          await router.replace("/user/login");
        }
      })
      .catch()
}


</script>

<style scoped>

</style>