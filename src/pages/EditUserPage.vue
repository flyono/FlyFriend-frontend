<template>
  <van-form @submit="onSubmit">
    <van-field v-if="editUser.type === 'string'"
               v-model="editUser.currentValue"
               :name="editUser.editKey"
               :label="editUser.editName"
               :placeholder="`请输入${editUser.editName}`"
    />
    <van-field v-if="editUser.type === 'gender'"
               v-model="gender"
               is-link
               readonly
               label="性别"
               placeholder="请选择您的性别"
               @click="show = true"
    />
    <van-popup v-model:show="show" round position="bottom">
      <van-cascader
          v-model="genderValue"
          title="请选择您的性别"
          :options="options"
          @close="show = false"
          @finish="onFinish"
      />
    </van-popup>

    <div v-if="editUser.type === 'image'" class="imgPosition">
      <van-uploader v-model="imageList" max-count="1" :after-read="afterRead"/>
      <van-button size="mini" disabled plain type="primary">更换头像</van-button>
    </div>

    <div style="margin: 16px;">
      <van-button v-if="editUser.type !== 'image'" round block type="primary" native-type="submit">
        提交
      </van-button>
      <van-button v-if="editUser.type === 'image'" round block type="primary" native-type="submit">
        确认更改
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import myAxios, {imageUrl} from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";

const route = useRoute();
const router = useRouter();

/**
 * 基础信息修改
 */
const editUser = ref({
  editKey: route.query.editKey,
  currentValue: route.query.currentValue,
  editName: route.query.editName,
  type: route.query.type
})
// 不可以写在外面，否则页面不显示内容，还没有报错信息，原因未知
// const currentUser = await getCurrentUser();

/**
 * 性别信息修改
 */
const gender = ref(route.query.currentValue === null ? '' : route.query.currentValue === '0' ? '男' : '女');
const show = ref(false);
const genderValue = ref('');

const options = [
  {
    text: '男',
    value: 0,
  },
  {
    text: '女',
    value: 1,
  },
];
const onFinish = ({selectedOptions}) => {
  show.value = false;
  gender.value = selectedOptions.map((option) => option.text);
  // genderValue.value = selectedOptions.map((option) => option.value);
  editUser.value.currentValue = selectedOptions.map((option) => option.value)[0];

};

/**
 * 头像信息修改
 */

const imageList = ref([
  {
    url: imageUrl + editUser.value.currentValue,
    deletable: true,
  }
]);
const afterRead = (file) => {
  let formData = new FormData();
  console.log('文件|');
  console.log(file.file);
  formData.append('file', file.file);
  let config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  myAxios.post('/user/uploadImage', formData, config)
      .then(res => {
        console.log('响应|');
        console.log(res);
        if (res.code === 0) {
          editUser.value.currentValue = res.data;
        } else {
          Toast.fail(res.message);
        }
      })
}

/**
 * 修改信息提交
 */
const onSubmit = async () => {
  // 异步方法必须添加 await 才可以拿到数据, 否则拿到的是 promise 对象
  const currentUser = await getCurrentUser();
  const res = await myAxios.post("/user/update", {
    "id": currentUser.id,
    [editUser.value.editKey as string]: editUser.value.currentValue // 动态取值
  })
  if (res.code === 0 && res.data > 0) {
    Toast.success("修改成功");
    await router.replace("/user");
  } else {
    Toast.fail("修改失败");
  }
};

</script>

<style scoped>

</style>
