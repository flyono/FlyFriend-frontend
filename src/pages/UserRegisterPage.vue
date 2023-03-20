<template>
  <van-form @submit="onRegister">
    <van-cell-group inset>
      <van-field
          v-model="userAccount"
          name="账户"
          label="账号"
          placeholder="账号,只能由字母和数字组成"
          :rules="[{ required: true, message: '请填写账号' }]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="密码"
          label="密码"
          placeholder="请输入不少于8位的密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
          v-model="checkPassword"
          type="password"
          name="密码"
          label="确认密码"
          placeholder="确认密码"
          :rules="[{ required: true, message: '请填写确认密码' }]"
      />
      <van-field
          v-model="studyCode"
          name="学号"
          label="学号"
          placeholder="输入学号"
          :rules="[{ required: true, message: '请填写确认密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        注册
      </van-button>
    </div>
  </van-form>

</template>

<script setup lang="ts">
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {useRoute} from "vue-router";

const route = useRoute();

const userAccount = ref('')
const userPassword = ref('')
const checkPassword = ref('')
const studyCode = ref('');
const isDev = process.env.NODE_ENV === 'development';

const onRegister = async () => {
  const res = await myAxios.post('/user/register',{
    userAccount: userAccount.value,
    userPassword: userPassword.value,
    checkPassword: checkPassword.value,
    studyCode: studyCode.value
  })
  console.log(res, '用户注册');
  if (res.code === 0 && res.data){
    Toast.success('注册成功');
    window.location.href = isDev ? 'http://localhost:5173/user' : 'https://friends.flyone.space/user';;
  }else {
    if(res.code === 40000){
      Toast.fail(res.description)
    }
  }

}

</script>

<style scoped>

</style>