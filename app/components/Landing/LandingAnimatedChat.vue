<template>
  <div
    ref="chatContainer"
    class="chat-half w-full min-h-[50vh] md:flex-1 md:h-full overflow-hidden p-5 select-none bg-comic-bg"
  >
    <div class="chat max-w-[600px] py-[30px] mx-auto w-full">
      <template v-for="item in visibleLines" :key="item.uid">
        <div
          v-if="item.type === 'system'"
          class="system text-center text-[19px] py-[12px] px-[18px] my-[40px] mx-auto bg-comic-soft border border-dashed border-[#4ecdc4]/60 rounded-[16px] max-w-[85%] animate-fade-in"
        >
          {{ item.content }}
        </div>

        <div
          v-else
          class="msg flex my-[30px] mx-0 items-end msg-animated"
          :class="item.isRight ? 'justify-end' : 'justify-start'"
        >
          <div v-if="!item.isRight" class="avatar">
            <img
              v-if="item.avatarUrl"
              :src="item.avatarUrl"
              :alt="item.name"
              @error="item.avatarUrl = null"
            >
            <span v-else>{{ item.fallbackEmoji }}</span>
          </div>

          <div
            class="msg-col flex flex-col max-w-[80%]"
            :class="item.isRight ? 'items-end' : 'items-start'"
          >
            <div
              class="name text-[13px] mb-[5px] uppercase tracking-[0.5px]"
              :style="{ color: item.color, textShadow: '1px 1px 0 rgb(var(--comic-surface))' }"
            >
              {{ item.name }}
            </div>

            <div
              class="bubble comic-muted relative py-[12px] px-[18px] text-[19px] leading-[1.4] border border-comic-line break-words w-fit"
              :class="item.isRight ? 'right-bubble' : 'left-bubble'"
              :style="item.isRight ? undefined : { backgroundColor: item.color }"
            >
              <div>{{ item.text }}</div>
              <div
                v-if="item.metaText"
                class="meta text-[13px] mt-[10px] pt-[6px] border-t border-dashed border-white/40 text-white/85"
              >
                {{ item.metaText }}
              </div>

              <div
                v-if="item.reactions"
                class="reactions absolute bottom-[-18px] bg-comic-surface border border-comic-line rounded-[12px] py-[2px] px-[8px] text-[13px] flex gap-[6px] items-center z-10 whitespace-nowrap"
                :class="item.isRight ? 'left-[12px]' : 'right-[12px]'"
              >
                <span v-for="(r, rIdx) in item.reactions" :key="rIdx">
                  {{ r.emoji }}
                  <span class="reaction-count font-bold text-comic-ink text-[12px]">{{ r.count }}</span>
                </span>
              </div>
            </div>
          </div>

          <div v-if="item.isRight" class="avatar">
            <img
              v-if="item.avatarUrl"
              :src="item.avatarUrl"
              :alt="item.name"
              @error="item.avatarUrl = null"
            >
            <span v-else>{{ item.fallbackEmoji }}</span>
          </div>
        </div>
      </template>

      <div v-if="isTyping" class="msg flex my-[30px] mx-0 items-end justify-start">
        <div class="avatar">
          <span>{{ nextSpeakerEmoji }}</span>
        </div>
        <div class="msg-col flex flex-col items-start">
          <div class="name text-[13px] mb-[5px] uppercase tracking-[0.5px] text-gray-500">
            {{ $t("landing.chat.typing", { name: nextSpeakerName }) }}
          </div>
          <div class="bubble comic-muted left-bubble relative py-[12px] px-[18px] border border-comic-line w-fit">
            <div class="typing-dots flex gap-1 items-center py-1 px-2">
              <span class="dot"/>
              <span class="dot"/>
              <span class="dot"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { Character, RawLine, ChatMessage } from "@/types/landingChat";

const { t, locale } = useI18n();

const chatContainer = ref<HTMLElement | null>(null);
const visibleLines = ref<ChatMessage[]>([]);
const isTyping = ref(false);
const currentLineIndex = ref(0);
const selectedScenario = ref("alice");

const animationTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

interface Scenario {
  avatars: string[]; // in characterKeys order
  reactions: string[];
  authors?: number[]; // character id of each line, if not the default two-person dialogue
}

const characterKeys = ["guest", "hero", "friend"];
const defaultAuthors = [1, 2, 1, 2, 1];

// Keys match landing.chat.scenarios in the locale files
const scenarioStyles: Record<string, Scenario> = {
  alice: { avatars: ["🙋", "👱‍♀️"], reactions: ["✨", "🫖", "😹"] },
  space: { avatars: ["👩‍🚀", "🤖"], reactions: ["🚀", "🛸", "🧦"] },
  detective: { avatars: ["👨‍⚕️", "🕵️‍♂️"], reactions: ["🔍", "💡", "🍮"] },
  dracula: { avatars: ["😰", "🧛"], reactions: ["🦇", "🧄", "🌙"] },
  romeo: { avatars: ["🤵", "👰"], reactions: ["❤️", "🌹", "🥟"] },
  quixote: { avatars: ["🧔", "🤺"], reactions: ["🛡️", "🌭", "🐴"] },
  redhood: { avatars: ["👧", "🐺"], reactions: ["🥧", "👂", "🌲"] },
  watermelon: { avatars: ["🧐", "😴", "💪"], reactions: ["🍉", "🌙", "👁️"], authors: [1, 2, 3, 1, 2, 3, 1] },
  rocket: { avatars: ["🧑‍🔧", "🖥️"], reactions: ["🚀", "🎸", "⭐"], authors: [1, 2, 1, 2, 1, 2, 1] },
};

const scenarios = Object.keys(scenarioStyles);

const bookData = computed(() => {
  const s = selectedScenario.value;
  const style = scenarioStyles[s];
  const prefix = `landing.chat.scenarios.${s}`;
  return {
    characters: characterKeys.slice(0, style?.avatars.length).map((key, index) => ({
      id: index + 1,
      nameKey: `${prefix}.characters.${key}`,
      avatar: null,
    })) as Character[],
    lines: [
      { is_dialogue: false, contentKey: `${prefix}.lines.system_title` },
      ...(style?.authors ?? defaultAuthors).map((authorId, index) => ({
        is_dialogue: true,
        author_id: authorId,
        contentKey: "",
        partsKeys: [`${prefix}.lines.line${index + 1}_text`, `${prefix}.lines.line${index + 1}_meta`],
      })),
    ] as RawLine[],
  };
});

const getFallbackEmoji = (id: number): string =>
  scenarioStyles[selectedScenario.value]?.avatars[id - 1] ?? "💬";

const getRandomReactions = (): { emoji: string; count: number }[] | null => {
  if (Math.random() > 0.4) return null;
  const emojis = scenarioStyles[selectedScenario.value]?.reactions ?? [];

  const chosenEmoji = emojis[Math.floor(Math.random() * emojis.length)] ?? "✨";
  return [{ emoji: chosenEmoji, count: Math.floor(Math.random() * 3) + 1 }];
};

const allProcessedLines = computed<ChatMessage[]>(() => {
  const charMap = new Map(bookData.value.characters.map((c) => [c.id, c]));
  const colors = ["#4ecdc4", "#ff6b6b", "#9b5de5"]; // by character id
  const result: ChatMessage[] = [];

  bookData.value.lines.forEach((line, index) => {
    if (!line.is_dialogue) {
      result.push({ uid: `sys-${index}`, type: "system", content: t(line.contentKey) });
      return;
    }

    const aId = line.author_id ?? 999;
    const char = charMap.get(aId);
    const name = char ? t(char.nameKey) : t("landing.chat.unknown");
    const avatarUrl = char?.avatar || null;
    const color = colors[aId - 1];
    const isRight = aId === 1;

    if (line && line.partsKeys && line.partsKeys.length) {
      result.push({
        uid: `msg-${index}`,
        type: "message",
        text: t(line.partsKeys[0] ?? "").trim(),
        name,
        isRight,
        color: color ?? "#4b2c20",
        metaText: t(line.partsKeys[1] ?? "").trim(),
        fallbackEmoji: getFallbackEmoji(aId),
        avatarUrl,
        reactions: getRandomReactions(),
      });
    }
  });

  return result;
});

const nextSpeakerName = computed(() => {
  const nextLine = allProcessedLines.value[currentLineIndex.value];
  return nextLine?.name || t("landing.chat.someone");
});

const nextSpeakerEmoji = computed(() => {
  const nextLine = allProcessedLines.value[currentLineIndex.value];
  return nextLine?.fallbackEmoji || "💬";
});

const pickRandomScenario = (): void => {
  const current = selectedScenario.value;
  const available = scenarios.filter((s) => s !== current);
  selectedScenario.value = available[Math.floor(Math.random() * available.length)] ?? 'alice';
};

const manageOverflowAndScroll = async (): Promise<void> => {
  const MAX_VISIBLE_LINES = 10;
  if (visibleLines.value.length > MAX_VISIBLE_LINES) {
    visibleLines.value = visibleLines.value.slice(-MAX_VISIBLE_LINES);
  }

  await nextTick();
  if (!chatContainer.value) return;

  chatContainer.value.scrollTo({
    top: chatContainer.value.scrollHeight,
    behavior: "smooth",
  });
};

const playChatAnimation = async (): Promise<void> => {
  if (currentLineIndex.value >= allProcessedLines.value.length) {
    animationTimeout.value = setTimeout(() => {
      visibleLines.value = [];
      currentLineIndex.value = 0;
      pickRandomScenario();
      playChatAnimation();
    }, 6000);
    return;
  }

  const nextLine = allProcessedLines.value[currentLineIndex.value];
  if (!nextLine) return;

  if (nextLine.type === "system") {
    visibleLines.value.push(nextLine);
    currentLineIndex.value++;
    await manageOverflowAndScroll();
    animationTimeout.value = setTimeout(() => {
      playChatAnimation();
    }, 1500);
  } else {
    isTyping.value = true;
    await manageOverflowAndScroll();
    const typingTime = Math.min(Math.max((nextLine.text?.length || 0) * 35, 1200), 3000);

    animationTimeout.value = setTimeout(async () => {
      isTyping.value = false;
      visibleLines.value.push(nextLine);
      currentLineIndex.value++;
      await manageOverflowAndScroll();

      animationTimeout.value = setTimeout(() => {
        playChatAnimation();
      }, 1000);
    }, typingTime);
  }
};

// Already shown lines hold translated text, so restart the animation on language change
watch(locale, () => {
  if (animationTimeout.value) clearTimeout(animationTimeout.value);
  visibleLines.value = [];
  isTyping.value = false;
  currentLineIndex.value = 0;
  playChatAnimation();
});

onMounted(() => {
  selectedScenario.value = scenarios[Math.floor(Math.random() * scenarios.length)] ?? 'alice';
  playChatAnimation();
});

onUnmounted(() => {
  if (animationTimeout.value) {
    clearTimeout(animationTimeout.value);
  }
});
</script>

<style scoped>
.chat-half {
  font-family: var(--font-comic);
  font-weight: 800;
  background-image: radial-gradient(var(--comic-dot) 3px, transparent 3px);
  background-size: 30px 30px;
  color: rgb(var(--comic-ink));
  -webkit-font-smoothing: antialiased;
}

.avatar {
  width: 48px;
  height: 48px;
  border: 1px solid rgb(var(--comic-line));
  border-radius: 50%;
  background: rgb(var(--comic-surface));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 10px;
  flex-shrink: 0;
  overflow: hidden;
  transform: rotate(-5deg);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.left-bubble {
  background: #ff6b6b;
  color: #ffffff;
  border-radius: 18px 18px 18px 4px;
  transform: rotate(-1deg);
}

.right-bubble {
  background: #4ecdc4;
  color: #ffffff;
  border-radius: 18px 18px 4px 18px;
  transform: rotate(1deg);
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.msg-animated {
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
}

.animate-fade-in {
  animation: popIn 0.5s ease-out backwards;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #ffffff;
  border-radius: 50%;
  display: inline-block;
  animation: bounce 1.4s infinite ease-in-out both;
  will-change: transform;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}
.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>