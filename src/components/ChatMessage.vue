<script setup lang="ts">
import {Pronoun, pronounToColourMap} from "../utils/pronouns.ts";

defineProps<{
  avatarUrl: string | null
  username: string
  message: string
  color: string
  pronouns: Pronoun | null
  subBadge: string | null
  bitsBadge: string | null
  giftBadge: string | null
  vip: boolean
  mod: boolean
  broadcaster: boolean
}>()

/*
const fadeClass = ref<'fadeIn' | 'fadeOut' | null>('fadeIn')

onMounted(() => {
  setTimeout(() => {
    fadeClass.value = null
  }, 1500)

  setTimeout(() => {
    fadeClass.value = 'fadeOut'
  }, messageVisibilityMilliseconds() - 1000)
})
*/
</script>


<template>

<!--  <div class="chat-message" :class="[fadeClass]">-->
  <div class="chat-message">
    <!-- Retain the right height even when something's missing -->
    <div data-avatar="empty" class="empty"></div>
    <img v-if="avatarUrl" class="avatar" :src="avatarUrl" />
    <img v-if="broadcaster" src="../assets/badges/ic_twitch_broadcaster.png" alt="" data-badge="broadcaster" class="badge">
    <img v-if="mod" src="../assets/badges/ic_twitch_moderator.png" alt="" data-badge="mod" class="badge">
    <img v-if="vip" src="../assets/badges/ic_twitch_vip.png" data-badge="vip" alt="" class="badge">
    <img v-if="giftBadge" :src="giftBadge" alt="" data-badge="gift" class="badge">
    <img v-if="subBadge" :src="subBadge" alt="" data-badge="sub" class="badge">
    <img v-if="bitsBadge" :src="bitsBadge" alt="" data-badge="bits" class="badge">
    <span :style="{ color: color }" class="username">{{ username }}</span>
    <span
        v-if="pronouns"
        class="pronouns"
        :style="{ color: pronounToColourMap[pronouns.name] }"
    >
      ({{ pronouns.display.toLowerCase() }})
    </span>
    <span class="message" v-html="message"></span>
  </div>

</template>


<style lang="scss">
.chat-message {
  line-height: 1.5;
  display: flex;
  align-items: center;

  // todo: configure
  text-shadow: 1px 1px 2px rgba(#000, 0.8);
  //filter: drop-shadow(1px 1px 1px #000);

  // with background
  background: rgba(#000, 0.8);
  padding: 4px 2px;
  border-radius: 4px;
}

.badge {
  height: 16px;
  margin-left: 4px;
}

.avatar {
  height: 26px;
  margin-left: 4px;
  border-radius: 100%;
}

.empty {
  height: 30px;
  width: 1px;
  position: relative;
  left: -1px;
}

.username {
  font-weight: 700;
  margin: 0 0.2em;
}

.pronouns {
  font-size: 0.7rem;
  //font-size: 0.85rem;
  margin: 0 0.2em;
}

.message {
  margin: 0 0.2em;
  word-break: keep-all;
}

.emote-wrapper {
  display: inline-flex;
  width: 1.4rem;
  height: 1.4rem;
  vertical-align: middle;
  align-items: center;
  flex-wrap: nowrap;
}

.emote {
  max-height: 100%;
  max-width: 100%;
}

@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fadeIn {
  animation-duration: 1s;
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
}

@-webkit-keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.fadeOut {
  animation-duration: 1s;
  -webkit-animation-name: fadeOut;
  animation-name: fadeOut;
}
</style>
