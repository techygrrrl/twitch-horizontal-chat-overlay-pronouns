<script setup lang="ts">
import { onMounted, ref } from "vue";
import ChatMessage from "./components/ChatMessage.vue";
import Alert from "./components/Alert.vue";
import {
  broadcasterIdFromURL,
  debugModeFromURL,
  hostFromURL,
  messageVisibilityMilliseconds,
  portFromURL,
  sslFromURL,
  tokenFromURL
} from "./utils/url-utils.ts";
import { connectToChat } from "./utils/networking-utils.ts";
import {
  ChatBadgeLookup,
  ChatBadgesResponse,
  IRCData,
  ircDataToTwitchChatMessage,
  transformChatBadgesResponseToLookup,
  TwitchChatMessage
} from "./utils/twitch-chat-utils.ts";
import { AbstractrrrApiClient } from "./utils/AbstractrrrApiClient.ts";
import {
  getPronounsAsKeyToDisplayMap,
  getUserPronoun,
  Pronoun
} from "./utils/pronouns.ts";

// Configuration
const token = tokenFromURL()
const port = portFromURL()
const debug = debugModeFromURL()
const host = hostFromURL()
const useSSL = sslFromURL()
const broadcasterId = broadcasterIdFromURL()
const messageVisibility = messageVisibilityMilliseconds()


const apiClient = new AbstractrrrApiClient({
  host,
  port,
  token: token,
  broadcasterId,
  ssl: useSSL,
})

// region State management

// region Error states

const noTokenError = ref<boolean>(!token)
const abstractrrrConnectionError = ref<boolean>(false)
const noBroadcasterIdError = ref<boolean>(!broadcasterId)

// endregion Error states


// region Messages

const visibleMessages = ref<TwitchChatMessage[]>([])
const enqueuedMessages = ref<IRCData[]>([])
const chatBadgeLookup = ref<ChatBadgeLookup>({ bits: {}, subscriber: {} })
const pronounsKeyToDisplayMap = ref<Record<string,string>>({})

const onNewMessage = async () => {
  const nextMessage: IRCData = enqueuedMessages.value[0]

  if (!nextMessage) return

  let pronouns: Pronoun | null = null
  try {
    const userPronoun = await getUserPronoun(nextMessage.user.name)

    if (userPronoun) {
      pronouns = {
        name: userPronoun,
        display: pronounsKeyToDisplayMap.value[userPronoun] || userPronoun
      }
    }
  } catch (e) {
    if (debug) {
      console.error("Failed to fetch pronouns", e)
    }
  }

  const nextMessageForUI = ircDataToTwitchChatMessage(
      nextMessage,
      chatBadgeLookup.value,
      pronouns
  )

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
  if (!host) return

  // Load up badges in lookup table
  apiClient
    .makeGet<ChatBadgesResponse>(
      `/v1/api/helix/chat/badges?broadcaster_id=${broadcasterId}`
    )
    .then(({ data }) => {
      chatBadgeLookup.value = transformChatBadgesResponseToLookup(data)
    })

  getPronounsAsKeyToDisplayMap()
    .then(data => {
      pronounsKeyToDisplayMap.value = data
    })

  // Connect to chat
  connectToChat({
    port,
    token,
    host,
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

  <Alert v-if="noTokenError" message="Query param `token` required" type="error" />
  <Alert v-if="noBroadcasterIdError" message="Query param `broadcaster_id` required" type="error" />
  <Alert v-if="abstractrrrConnectionError" message="Cannot connect to Abstractrrr" type="error" />

  <!-- endregion Alerts / Errors -->

  <div class="horizontal-layout">
    <div v-for="message in visibleMessages" class="horizontal-layout__item">
      <ChatMessage
        :pronouns="message.pronouns"
        :sub-badge="message.subBadgeUrl"
        :bits-badge="message.bitsBadgeUrl"
        :gift-badge="message.bitsBadgeUrl"
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
