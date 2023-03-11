<template>
  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch"/>
    <van-divider dashed>我创建的队伍</van-divider>
    <team-card-list :team-list="teamList"></team-card-list>
    <van-empty v-if="teamList?.length<1" description="搜索结果为空"/>
  </div>

</template>

<script setup>

import {useRouter} from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {Toast} from "vant";

const router = useRouter()
const searchText = ref('')

const doJoinTeam = () => {
  router.push({
    path: "team/add"
  })
}

const teamList = ref([])

const listTeam = async (val='') => {
  const res = await myAxios.get("/team/list/my/create", {
    params: {
      searchText: val,
    }
  })
  if (res?.code === 0) {
    teamList.value = res.data;
  } else {
    Toast.fail('加载队伍失败，请刷新重试')
  }
}

onMounted(() => {
  listTeam();
})

const onSearch =  (val) => {
  listTeam(val)
};
</script>

<style scoped>

</style>
