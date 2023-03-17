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
        <van-button size="mini">
          联系我
        </van-button>
      </template>
    </van-card>
  </van-skeleton>
  <van-empty v-if="!userList || userList.length<1" description="搜索结果为空"/>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";

const imageUrl =
    process.env.NODE_ENV
    === 'development' ?
        'http://localhost:8080/api/images/' : 'https://backend.flyone.space/api/images/'

interface UserCardListProps {
  loading: boolean;
  userList: UserType[];
}

const props = withDefaults(defineProps<UserCardListProps>(), {
  loading: true,
  // @ts-ignore
  userList: [] as UserType[],
})

</script>

<style scoped>

</style>