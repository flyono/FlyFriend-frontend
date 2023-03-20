<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="userAccount"
          name="userAccount"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请填写账号' }]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
      <br>
      <van-button block round type="primary" plain size="normal" @click="doRegister">
        没有账号？ 点击注册
      </van-button>
    </div>
  </van-form>
</template>
<script setup lang="ts">
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {useRoute, useRouter} from "vue-router";
import {Toast} from "vant";

const router = useRouter();
const route = useRoute()

const userAccount = ref('');
const userPassword = ref('');
/**
 * 登录接口
 */
const onSubmit = async () => {
  const res = await myAxios.post('/user/login',{
    userAccount: userAccount.value,
    userPassword: userPassword.value
  })
  console.log(res,'用户登录');
  if (res.code === 0 && res.data){
    Toast.success('登录成功')
    const redirectUrl = route.query?.redirect as string ?? '/';
    window.location.href = redirectUrl;
  }else {
    Toast.fail('账号或密码错误！')
  }
};
/**
 * 注册跳转
 */
const doRegister = () => {
  router.push({
    path: "/user/register"
  })
}
</script>

<style scoped>

</style>