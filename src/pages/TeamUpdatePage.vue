<template>
  <div id="teamUpdatePage">
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
              type="date"
              title="选择过期时间"
              :min-date="minDate"
              @confirm="onConfirm"
          />
        </van-popup>

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
          更新
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>

import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios.ts";
import {Toast} from "vant";
import {formDate} from "../states/formatDate";

const router = useRouter();
const route = useRoute();

const id = route.query.id;

const result = ref('');
const showPicker = ref(false);
//最小过期时间
const minDate = new Date();
//最大过期时间

//用户填写的表单数据
const addTeamData = ref({})

//获取队伍信息回填表单
onMounted(async () => {
  if (id <= 0) {
    Toast.fail('加载队伍失败')
    return;
  }
  const res = await myAxios.get('/team/get', {
    params: {
      id,
    }
  });
  if (res?.code === 0) {
    addTeamData.value = res.data;
  } else {
    Toast.fail('无法获取数据')
  }
})

//取消时间选择
const onConfirm = (value) => {
  result.value = formDate({date: value});
  showPicker.value = false;
};

//提交表单数据
const onSubmit = async () => {
  const postData = {
    ...addTeamData.value,
    status: Number(addTeamData.value.status)
  }

  const res = await myAxios.post("/team/update", postData)
  if (res?.code === 0 && res.data) {
    Toast.success('更新成功');
    await router.push({
      path: '/team',
      replace: true
    });
  } else {
    Toast.fail('更新失败');
  }
}
</script>

<style scoped>

</style>