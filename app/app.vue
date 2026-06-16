<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <Toaster position="bottom-center" rich-colors />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted} from "vue";
import type { WebSocketPayload } from "~/types/event";
import type { DownloadBookStatus } from "~/types/book";
import { useDownloadStore } from "~/stores/downloadBook";
import { useBookStore } from "~/stores/book";
import { useUserStore } from "~/stores/user";
import { Toaster, toast } from "vue-sonner";
import "vue-sonner/style.css";

const { t } = useI18n();

const { connect } = useNotificationSocket();
const downloadStore = useDownloadStore();
const bookStore = useBookStore();
const userStore = useUserStore();
const downloadService = useDownloadService();

const { isAuthenticated } = storeToRefs(userStore);

let unsubscribe: (() => void) | null = null;

const mapSocketStatus = (socketStatus: string): DownloadBookStatus => {
  if (socketStatus === "processing") return "pending";
  return socketStatus as DownloadBookStatus;
};

const startWebSocket = (): void => {
  if (unsubscribe) return;

  unsubscribe = connect<WebSocketPayload>((rawPayload: WebSocketPayload) => {
    let payload: WebSocketPayload;
    try {
      payload = typeof rawPayload === "string" ? JSON.parse(rawPayload) : rawPayload;
    } catch (error) {
      console.error("Error parsing WebSocket payload:", error);
      return;
    }

    if (payload?.type === "book_converted") {
      const normalizedStatus = mapSocketStatus(payload.status);
      downloadStore.updateDownloadStatus(payload.convert_item_id, normalizedStatus);

      if (payload.status === "completed") {
        toast.success(t("notifications.conversion_completed.title"), {
          description: t("notifications.conversion_completed.description"),
          action: {
            label: t("download"),
            onClick: async () => {
              try {
                const bookId = payload.book_id;
                const downloadId = payload.convert_item_id;

                if (!bookId || !downloadId) {
                  toast.error(t("notifications.missing_download_data"));
                  return;
                }

                await downloadService.downloadCompleteBook(bookId, downloadId);
                toast.success(t("notifications.download_started"));
              } catch (error) {
                console.error(t("notifications.download_error_console"), error);
                toast.error(t("notifications.download_error.title"), {
                  description: t("notifications.download_error.description"),
                });
              }
            },
          },
        });
      } else if (payload.status === "failed") {
        toast.error(t("notifications.conversion_error.title"), {
          description: t("notifications.conversion_error.description"),
        });
      } else if (payload.status === "processing") {
        toast.info(t("notifications.conversion_started"));
      }
    } else if (payload?.type === "create_book_model") {
      bookStore.updateBookActionStatus(payload.book_id, "book_parsing", payload.status);
      if (payload.status === "completed") {
        toast.success(t("notifications.book_model_created"));
      } else if (payload.status === "failed") {
        toast.error(t("notifications.book_model_error"));
      }
    }
  });
};

const stopWebSocket = (): void => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
};

watch(
  isAuthenticated,
  (isLoggedIn) => {
    if (isLoggedIn) {
      startWebSocket();
    } else {
      stopWebSocket();
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  stopWebSocket();
});
</script>