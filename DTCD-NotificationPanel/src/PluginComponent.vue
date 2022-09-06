<template>
  <div class="PluginComponent">
    <div class="list">
      <base-button
        :disabled="notificationList.length === 0"
        class="clear-btn"
        @click.prevent="$root.notificationSystem.clearList()"
      >
        Удалить все
      </base-button>
      <div
        v-if="notificationList.length === 0"
        class="empty-text"
      >
        Уведомлений нет
      </div>
      <div
        v-for="{ title, body, className, id, hasAction } of notificationList"
        :key="id"
        class="notification-item"
        :class="className"
      >
        <a
          href="#"
          class="close-btn"
          @click.prevent="$root.notificationSystem.remove(id)"
        >✕</a>
        <div
          class="title"
          :class="{
            'has-action': hasAction,
          }"
          @click.prevent="onClick(id)"
        >{{ title }}</div>
        <div v-if="body" class="body-text">
          <vue-show-more-text
            :text="body"
            :lines="4"
            additional-container-css="padding:0;"
            additional-anchor-css="padding:8px 8px 0 8px;"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vueShowMoreText from 'vue-show-more-text'

export default {
  components: {
    vueShowMoreText,
  },
  data({$root: {
    notifications,
  }}) {
    return {
      notifications,
    }
  },
  computed: {
    notificationList() {
      const list = this.notifications.map(({ title, body, options = {} }, i) => ({
        title,
        body,
        className: options.type || 'info',
        id: options.id,
        hasAction: typeof options.action === 'function',
      }));
      return list.reverse()
    },
  },
  methods: {
    addItem(title, body, options = {}) {
      const idx = this.notifications.findIndex((item) => item.options.id === options.id);
      if (idx > -1) {
        this.notifications[idx].title = title;
        this.notifications[idx].body = body;
        this.notifications[idx].options = options;
      } else {
        this.notifications.push({ title, body, options });
      }
    },

    removeNotification(id) {
      const idx = this.notifications.findIndex((item) => item.options.id === id);
      if (idx >= 0) {
        this.notifications.splice(idx, 1);
      }
    },

    clearNotifyList() {
      this.notifications = [];
    },

    onClick(id) {
      const item = this.notifications.find((item) => item.options.id === id);
      if (typeof item.options?.action === 'function') {
        item.options.action(item);
      }
    },

    onTest() {
      const types = ['info','success','warning','error'];
      this.$root.notificationSystem.create(
          'NotificationPanel',
          [...Array(Math.floor(Math.random() * 50))].map(() => Math.random().toString(36).substring(2, 15)).join(' '),
          {
            type: types[Math.floor(Math.random() * types.length)],
          }
      )
    },
    onTestFloat() {
      const types = ['info','success','warning','error'];
      this.$root.notificationSystem.create(
          '[Float] NotificationPanel',
          [...Array(Math.floor(Math.random() * 50))].map(() => Math.random().toString(36).substring(2, 15)).join(' '),
          {
            floatMode: true,
            floatTime: 3,
            type: types[Math.floor(Math.random() * types.length)],
          }
      )
    }
  },
}
</script>

<style lang="scss" scoped>
.PluginComponent {

  .clear-btn {
    margin: 8px 8px 0 8px;
  }

  .empty-text {
    padding: 32px 16px;
    text-align: center;
    color: var(--text_secondary)
  }

  .notification {
    &-list {
      font-family: "Proxima Nova";
      position: fixed;
      right: 0;
      top: 20px;
      max-height: calc(100% - 20px - 10px);
      overflow-y: scroll;
      overflow-x: unset;
    }
    &-item {
      margin: 8px;
      padding: 8px 8px 8px 30px;
      background: #f5f3fa;
      border-radius: 10px;
      border: 1px solid;
      color: #2c67a6;
      min-width: 280px;
      position: relative;
      min-height: 20px;

      &::before {
        content: 'i';
        width: 18px;
        height: 18px;
        border: 1px solid;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 0;
        margin: 8px;
        text-align: center;
        font-size: 11px;
        font-weight: bold;
        line-height: 18px;
      }

      .close-btn {
        position: absolute;
        right: 0;
        top: 0;
        margin: 6px 8px;
        text-decoration: none;
        color: var(--divider);
        font-size: 20px;

        &:hover {
          color: var(--text_main);
        }
      }

      .has-action {
        cursor: pointer;
      }

      .title {
        font-weight: bold;
        &.has-action:hover {
          text-decoration: underline;
        }
      }
      .body-text {
        margin-top: 8px;
        color: var(--text_main);
      }

      &.info {}
      &.success {
        color: var(--success);
        &::before {
          content: '✓';
        }
      }
      &.warning {
        color: var(--warning);
        &::before {
          content: '!';
        }
      }
      &.error {
        color: var(--danger);
        &::before {
          content: '✕';
          background: var(--danger);
          color: white;
        }
      }
    }
  }
}
</style>
