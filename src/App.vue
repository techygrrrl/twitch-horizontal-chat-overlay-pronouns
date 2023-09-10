<script setup lang="ts">
import { onMounted, ref } from "vue";
import ChatMessage from "./components/ChatMessage.vue";
import Alert from "./components/Alert.vue";
import { debugModeFromURL, messageVisibilityMilliseconds, portFromURL, tokenFromURL } from "./utils/url-utils.ts";
import { connectToChat } from "./utils/networking-utils.ts";
import { IRCData, ircDataToTwitchChatMessage, TwitchChatMessage } from "./utils/twitch-chat-utils.ts";

// Configuration
const token = tokenFromURL()
const port = portFromURL()
const debug = debugModeFromURL()
const messageVisibility = messageVisibilityMilliseconds()


// region State management

// region Error states

const noTokenError = ref<boolean>(!token)
const abstractrrrConnectionError = ref<boolean>(false)

// endregion Error states


// region Messages

// const visibleMessages = ref<TwitchChatMessage[]>([{
//   message: "this is a fake message",
//   vip: true,
//   username: "SomeUser",
//   color: "#8B39FF",
//   moderator: false,
//   broadcaster: false,
//   pronouns: null,
//   subBadgeUrl: null,
// }])
const visibleMessages = ref<TwitchChatMessage[]>([])
const enqueuedMessages = ref<IRCData[]>([])

const onNewMessage = () => {
  const nextMessage: IRCData = enqueuedMessages.value[0]

  if (!nextMessage) return

  const nextMessageForUI = ircDataToTwitchChatMessage(nextMessage)

  enqueuedMessages.value = enqueuedMessages.value.slice(1)

  visibleMessages.value = [
    ...visibleMessages.value,
    nextMessageForUI,
  ]

  setTimeout(() => {
    // Remove the first item
    visibleMessages.value = visibleMessages.value.slice(1)
  }, messageVisibility)
}

// endregion Messages


// endregion State management

onMounted(() => {
  if (!port) return
  if (!token) return

  connectToChat({
    port,
    token,
    onClearChat(data) {
      // Remove all messages from enqueued
      if (data.target_user_id) {
        enqueuedMessages.value = enqueuedMessages.value
            .filter(message => message.user.id !== data.target_user_id)

        // Remove all messages from the UI
      visibleMessages.value = visibleMessages.value
          .filter(message => message.username.toLowerCase() !== data.target_username.toLowerCase())
      } else {
        enqueuedMessages.value = []
        visibleMessages.value = []
      }
    },
    onChat(data) {
      if (debug) {
        console.log('onChat', data)
      }

      enqueuedMessages.value = [
        ...enqueuedMessages.value,
        data
      ]
      onNewMessage()
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

  <div class="horizontal-layout">
    <div v-for="message in visibleMessages" class="horizontal-layout__item">
      <ChatMessage
        :pronouns="null"
        :sub-badge="message.subBadgeUrl"
        :broadcaster="message.broadcaster"
        :color="message.color"
        :message="message.message"
        :mod="message.moderator"
        :vip="message.vip"
        :username="message.username"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.horizontal-layout {
  display: flex;
}

.horizontal-layout__item {
  margin-right: 1.5rem;
}
</style>
