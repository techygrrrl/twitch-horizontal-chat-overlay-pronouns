<script setup lang="ts">
import { onMounted, ref } from "vue";
import ChatMessage from "./components/ChatMessage.vue";
import Alert from "./components/Alert.vue";
import { portFromURL, tokenFromURL } from "./utils/url-utils.ts";
import { connectToChat } from "./utils/networking-utils.ts";

const token = tokenFromURL()
const port = portFromURL()

const noTokenError = ref<boolean>(!token)

const abstractrrrConnectionError = ref<boolean>(false)

onMounted(() => {
  if (!port) return
  if (!token) return

  connectToChat({
    port,
    token,
    onChat(data) {
      console.log('onChat', data)
    },
    onError(e) {
      console.error('onError', e)
    },
    onClose(e) {
      console.error('onClose', e)
    },
  })
})
</script>

<template>
  <!-- region Alerts / Errors -->

  <Alert v-if="noTokenError" message="No abstractrrr token" type="error" />
  <Alert v-if="abstractrrrConnectionError" message="Cannot connect to Abstractrrr" type="error" />

  <!-- endregion Alerts / Errors -->

  <ChatMessage
    :pronouns="null"
    :sub-badge="null"
    :broadcaster="false"
    :color="'#8B39FF'"
    :message="'hey how is it going'"
    :mod="false"
    :vip="false"
    :username="'SomeRandomChatter'"
  />

  <ChatMessage
    :pronouns="'She/Her'"
    :sub-badge="null"
    :broadcaster="true"
    :color="'#EF15BF'"
    :message="'The options passed to defineProps and defineEmits will be hoisted out of setup into module scope. Therefore, the options cannot reference local variables declared in setup scope. Doing so will result in a compile error. However, it can reference imported bindings since they are in the module scope as well.'"
    :mod="false"
    :vip="false"
    :username="'techygrrrl'"
  />

  <ChatMessage
    :pronouns="'It/Its'"
    :sub-badge="null"
    :broadcaster="false"
    :color="'#15EFAE'"
    :message="'Thanks for hanging out and lurking!'"
    :mod="true"
    :vip="false"
    :username="'techydrrroid'"
  />
</template>

<style scoped>

</style>
