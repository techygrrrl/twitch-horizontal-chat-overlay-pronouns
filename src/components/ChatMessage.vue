<script setup lang="ts">
import {Pronoun, pronounToColourMap} from "../utils/pronouns.ts";

defineProps<{
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
    <img v-if="broadcaster" src="../assets/badges/ic_twitch_broadcaster.png" alt="" class="badge">
    <img v-if="mod" src="../assets/badges/ic_twitch_moderator.png" alt="" class="badge">
    <img v-if="vip" src="../assets/badges/ic_twitch_vip.png" alt="" class="badge">
    <img v-if="giftBadge" :src="giftBadge" alt="" class="badge">
    <img v-if="subBadge" :src="subBadge" alt="" class="badge">
    <img v-if="bitsBadge" :src="bitsBadge" alt="" class="badge">
    <div class="badge badge--empty"></div>
    <span :style="{ color: color }" class="username">{{ username }}</span>
    <span
        v-if="pronouns"
        class="pronouns"
        :style="{ color: pronounToColourMap[pronouns.name] }"
    >
      ({{ pronouns.display.toLowerCase() }})
    </span>
    <!-- todo: inject emote images (subs, twitch globals, smiley/monkeys) -->
    <span class="message">{{ message }}</span>
  </div>

</template>


<style lang="scss">
.chat-message {
  display: flex;
  align-items: center;
}

.badge {
  height: 22px;
  margin-left: 4px;
}

.badge--empty {
  width: 2px;
  position: relative;
  left: -2px;
}

.username {
  font-weight: 700;
  margin: 0 0.2em;
}

.pronouns {
  font-size: 0.85rem;
  margin: 0 0.2em;
  //padding: 0em 0.3em;
  //border: 1px solid #fff;
  // border-radius: 3px;
  //opacity: 0.8;
}

.message {
  margin: 0 0.2em;
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
