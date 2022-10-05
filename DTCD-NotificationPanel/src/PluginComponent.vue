<template>
  <div class="PluginComponent">
    <div class="list">
      <base-button
        :disabled="notificationList.length === 0"
        class="clear-btn"
        @click.prevent="$root.notificationSystem.clearList()"
        theme="theme_blueSec"
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
        <span 
          class="FontIcon FrontIcon"
          :class="getIcon(className)"
        >
        </span>
        <span 
          @click.prevent="$root.notificationSystem.remove(id)" 
          class="FontIcon name_closeBig size_md close-btn"
          >
        </span>
        <div
          v-if="title" 
          class="title"
          :class="{
            'has-action': hasAction,
          }"
          @click.prevent="onClick(id)"
        >
          <vue-show-more-text
            :text="title"
            :lines="1"
            additional-container-css="padding:0;display:flex;margin-right:18px;"
            additional-anchor-css="color:transparent;padding:0;position:absolute;right:0;width:100%;height:100%;"
          />
        </div>
        <div 
          v-if="body" 
          class="body-text"
        >
          <vue-show-more-text
            :text="body"
            :lines="4"
            more-text="Show"
            less-text="Hide"
            additional-container-css="padding:0;"
            additional-anchor-css="color: var(--text_secondary);margin-bottom:0;padding:10px 0 0;"
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
      classes: {
        'success':'name_circleCheckOutline',
        'warning': 'name_warningOutline',
        'error': 'name_offOutlineClose',
        'info': 'name_infoCircleOutline'
      },
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

    getIcon(className) {
      if (Object.keys(this.classes).includes(className)) {
        return this.classes[className]
      } else {
        return 'name_infoCircleOutline'
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
  font-family: "Proxima Nova";

  &,
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  .clear-btn {
    width: 100%;
    padding: 10px 10px 4px;
  }

  .empty-text {
    padding: 32px 16px;
    text-align: center;
    color: var(--text_main);
  }

  .notification {
    &-list {
      background-color: var(--background_secondary);
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: 1px 1px 12px rgb(8 18 55 / 12%);
      max-height: 700px;
      overflow-y: auto;
      overflow-x: unset;
      width: 360px;
      margin-right: -8px;
    }

    &-item {
      margin: 6px;
      padding: 10px;
      background: var(--border_12);
      border-radius: 8px;
      border: 1px solid;
      color: var(--accent);
      position: relative;
      min-height: 20px;

      .FrontIcon {
        position: absolute;
        left: 0;
        top: 0;
        margin: 10px;
        display: flex;
        font-size: 18px;
        align-items: center;
      }

      .close-btn {
        position: absolute;
        right: 0;
        top: 0;
        margin: 10px;
        text-decoration: none;
        cursor: pointer;

        &:hover {
          color: var(--text_main);
        }
      }

      .title {
        font-weight: 700;
        font-size: 16px;
        position: relative;
        margin: 0 18px 0 21px;
      }

      .body-text {
        margin-top: 8px;
        font-size: 14px;
        color: var(--text_main);
      }

      &.success {
        color: var(--success);

        .FontIcon {
          &.name_circleCheckOutline {
            color: var(--success);
          }   
        }
      }

      &.warning {
        color: var(--warning);

        .FontIcon {
          &.name_warningOutline {
            color: var(--warning);
          }   
        }
      }

      &.error {
        color: var(--danger);

        .FontIcon {
          &.name_offOutlineClose {
            color: var(--danger);
          }
        }
      }
    }
  }
  .FontIcon {

    &.name_closeBig {
      color: var(--border);
    }
  }
}
</style>
