<script setup lang="ts">
import { ref } from 'vue'
import { kebabify } from "../utils/string-utils.ts";

defineProps<{
  username: string
  message: string
  color: string
  pronouns: string | null
  subBadge: string | null
  vip: boolean
  mod: boolean
  broadcaster: boolean
}>()

const count = ref(0)
</script>


<template>

  <div class="chat-message">
    <img src="./assets/badges/ic_twitch_broadcaster.png" alt="" class="badge">
    <img src="./assets/badges/ic_twitch_moderator.png" alt="" class="badge">
    <!-- TODO: sub badge -->
    <img src="./assets/badges/ic_twitch_vip.png" alt="" class="badge">
    <span :style="{ color: color }" class="username">{{ username }}</span>
    <span v-if="pronouns" class="pronouns" :class="[`pronouns__${kebabify(pronouns)}`]">({{ pronouns.toLowerCase() }})</span>
    <!-- todo: inject emote images (subs, twitch globals, smiley/monkeys) -->
    <span class="message">{{ message }}</span>
  </div>

</template>


<style scoped lang="scss">
.username {
  font-weight: 700;
  margin: 0 0.2em;
}

.pronouns {
  font-size: 0.85rem;
  margin: 0 0.2em;
  //font-style: italic;
  //padding: 0em 0.3em;
  //border: 1px solid #fff;
  border-radius: 3px;
  //opacity: 0.8;
}
.pronouns__she-her {
  //color: #DB3BBA;
  color: #E633C7;
}
.pronouns__he-him {
  color: #15AEEF;
}
.pronouns__they-them {
  color: #9B33E6;
}
.pronouns__it-its {
  //color: #54B989;
  color: #807694;
}

.message {
  margin: 0 0.2em;
}
</style>
