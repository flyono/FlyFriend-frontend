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
<!--      <van-button size="mini" plain type="primary">当前头像</van-button>-->
<!--    <van-uploader v-model="imageList" :deletable="true" max-count="2" />-->
<!--      <van-button size="mini" plain type="primary">更换头像</van-button>-->
      <van-image :src="route.query.currentValue" fit="cover" />
      <van-uploader
          v-model="imageList"
          :after-read="afterRead"
          accept="image/*"
          capture="camera"
          :max-count="1"
          :preview-size="200"
          :preview-image="false"
          :preview-options="{ showIndicator: false }"
      >
        <template #upload>
          <div class="van-uploader__text">上传头像</div>
        </template>
      </van-uploader>
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
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";

const route = useRoute();
const router =useRouter();

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
const gender = ref(route.query.currentValue === '0' ? '男' : '女');
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
const onFinish = ( { selectedOptions } ) => {
  show.value = false;
  gender.value = selectedOptions.map((option: { text: any; }) => option.text).join('/');
  genderValue.value = selectedOptions.map((option: { value: any; }) => option.value).join('/');
};

/**
 * 头像信息修改
 */

const imageList =  ref([
  // Uploader 根据文件后缀来判断是否为图片文件
  // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
]);

console.log("头像列表");
console.log(imageList);

/**
 * 信息提交
 */
const onSubmit = async () => {
  // 异步方法必须添加 await 才可以拿到数据, 否则拿到的是 promise 对象
  const currentUser = await getCurrentUser();
  console.log("-------UserEditPage", currentUser);
  const res = await myAxios.post("/user/update", {
    "id": currentUser.id,
    [editUser.value.editKey as string]: editUser.value?.currentValue ?? genderValue.value // 动态取值
  })
  console.log("修改用户信息", res);
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
