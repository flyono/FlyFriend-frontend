<template>
  <div id="teamAddPage">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="addTeamData.name"
            name="name"
            label="队名"
            placeholder="请输入队伍名"
            :rules="[{ required: true, message: '请填写队伍名' }]"
        />
        <van-field
            v-model="addTeamData.description"
            rows="4"
            autosize
            label="队伍描述"
            type="textarea"
            placeholder="请输入队伍描述"
        />
        <van-field
            is-link
            readonly
            name="datetimePicker"
            label="过期时间"
            :placeholder="result ?? '点击选择过期时间'"
            @click="showPicker = true"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-datetime-picker
              v-model="addTeamData.expireTime"
              type="datetime"
              title="选择过期时间"
              :min-date="minDate"
              @confirm="onConfirm"
          />
        </van-popup>

        <van-field name="stepper" label="最大人数">
          <template #input>
            <van-stepper v-model="addTeamData.maxNum" max="10" min="2"/>
          </template>
        </van-field>

        <van-field name="radio" label="队伍状态">
          <template #input>
            <van-radio-group v-model="addTeamData.status" direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field
            v-if="addTeamData.status === '2'"
            v-model="addTeamData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入队伍密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>

      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          创建
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>

import {ref} from "vue";
import {useRouter} from "vue-router";
import myAxios from "../plugins/myAxios.ts";
import {Toast} from "vant";

const router = useRouter();

const initFormData = {
  "name": "",
  "description": "",
  "expireTime": "",
  "maxNum": 3,
  "password": "",
  "status": 0,
}
//用户填写的表单数据
const addTeamData = ref({...initFormData})

const result = ref('');
const showPicker = ref(false);
const minDate = new Date();

const onConfirm = (value) => {
  result.value = value;
  showPicker.value = false;
};

const onSubmit = async () => {
  const postData = {
    ...addTeamData.value,
    status: Number(addTeamData.value.status)
  }

  const res = await myAxios.post("/team/add", postData)
  if (res?.code === 0 && res.data){
    Toast.success('添加成功');
    router.push({
      path: '/team',
      replace: true
    });
  }else {
    Toast.fail('添加失败');
  }
}
</script>

<style scoped>

</style>