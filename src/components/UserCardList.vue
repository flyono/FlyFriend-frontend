<template>
  <van-skeleton title avatar :row="3" :loading="props.loading" v-for="user in props.userList">
    <van-card
        :desc="user.profile"
        :title="`${user.username}  [${user.studyCode}]`"
        :thumb="imageUrl+user.avatarUrl"
    >
      <template #tags>
        <van-space wrap>
          <van-tag plain type="primary" v-for="tag in user.tags" style="margin-top: 6px">
            {{ tag }}
          </van-tag>
        </van-space>
      </template>
      <template #footer>
        <van-button size="mini" @click="doShowUserMessage(user.userAccount);show=true">
          联系我
        </van-button>
      </template>
    </van-card>
  </van-skeleton>
  <van-overlay :show="show" @click="show = false" duration="1">
    <div class="card">
      <div class="card-info">
        <van-image
            class="image"
            round
            width="5rem"
            height="5rem"
            :src="imageUrl+userInfo.avatarUrl"/>
        <span class="contact1">{{'电话：'+Contact.phone}}</span>
        <p class="contact2">{{'邮箱：'+Contact.email}}</p>

      </div>
    </div>
  </van-overlay>
  <van-empty v-if="!userList || userList.length<1" description="搜索结果为空"/>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";
import {useRouter} from "vue-router";
import {getCurrentUser} from "../services/user";
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";

const loginUser = ref();
const router = useRouter();

let show = ref(false);

const imageUrl = process.env.NODE_ENV === 'development' ?
    'http://localhost:8080/api/images/' : 'https://backend.flyone.space/api/images/'

interface UserCardListProps {
  loading: boolean;
  userList: UserType[];
}

const Contact = ref([])
const userInfo = ref({});

const props = withDefaults(defineProps<UserCardListProps>(), {
  loading: true,
  // @ts-ignore
  userList: [] as UserType[],
})

const doShowUserMessage = async (userAccount: string) => {
  //判断是否登录
  loginUser.value = await getCurrentUser();
  const res = await myAxios.get('/user/getInfo', {
    params: {
      userAccount,
    }
  })
  if (res.code === 0) {
    userInfo.value = res.data;
    Contact.value = res.data;
  } else {
    Toast.fail(res.description)
  }

}
console.log(userInfo.value)

</script>

<style scoped>
.card {
  --background: linear-gradient(to left, #f7ba2b 0%, #ea5358 100%);
  width: 300px;
  height: 250px;
  padding: 5px;
  border-radius: 1rem;
  overflow: visible;
  background: #f7ba2b;
  background: var(--background);
  position: relative;
  z-index: 1;
  margin: 180px auto auto;
}

.card::after {
  position: absolute;
  content: "";
  top: 30px;
  left: 0;
  right: 0;
  z-index: -1;
  height: 100%;
  width: 100%;
  transform: scale(0.8);
  filter: blur(25px);
  background: #f7ba2b;
  background: var(--background);
  transition: opacity .5s;
}

.card-info {
  --color: #181818;
  background: var(--color);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: .7rem;
  color: #f7ba2b;
  transition: color 1s;
}
span{
  font-weight: bold;
  letter-spacing: .1em;
}
.contact1{
  font-weight: bold;
  letter-spacing: .1em;
  display: inline-flex;
  margin-right: -166px;
  overflow-wrap: break-word;
}
.contact2{
  font-weight: bold;
  letter-spacing: .1em;
  display: inline-flex;
  overflow-wrap: break-word;
  margin-top: 0;
  margin-bottom: -150px;
  margin-right: 16px;
}
.image {
  position: absolute;
  top: 5%;
  left: 5%;
}

</style>