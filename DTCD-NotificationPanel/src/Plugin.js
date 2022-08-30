import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent';
import {
  PanelPlugin,
  LogSystemAdapter,
  EventSystemAdapter,
  NotificationSystemAdapter,
} from './../../DTCD-SDK/index';

export class NotificationPanel extends PanelPlugin {
  #guid;
  #logSystem;
  #eventSystem;
  #notificationSystem;
  #vue;

  constructor(guid, selector) {
    super();
    console.log(
      `%c[!]%c - NotificationPanel: ${guid} ${selector}`,
      'font-weight: bold; color: yellow;','',
    );
    this.#guid = guid;
    this.#logSystem = new LogSystemAdapter('0.5.0', guid, pluginMeta.name);
    this.#logSystem.info('Initializing system');
    this.#notificationSystem = new NotificationSystemAdapter('0.1.0');
    this.#eventSystem = new EventSystemAdapter('0.4.0', guid);
    this.#eventSystem.registerPluginInstance(this, [
      'newNotify',
      'removeNotify',
      'clearNotifyList',
    ]);

    const guidNotifySystem = this.getGUID(this.getSystem('NotificationSystem', '0.1.0'));
    this.#eventSystem.subscribe(guidNotifySystem, 'newNotify', guid, 'onNewNotify');
    this.#eventSystem.subscribe(guidNotifySystem, 'removeNotify', guid, 'onRemoveNotify');
    this.#eventSystem.subscribe(guidNotifySystem, 'clearNotifyList', guid, 'onClearNotifyList');

    const {
      default: VueJS,
    } = this.getDependence('Vue');

    this.#vue = new VueJS({
      data: () => ({
        notificationSystem: this.#notificationSystem,
        notifications: this.#notificationSystem.getList(),
      }),
      render: h => h(PluginComponent),
    }).$mount(selector);
  }

  onNewNotify({title, body, options}) {
    this.#vue.$children[0].addItem(title, body, options);
  }

  onRemoveNotify(id) {
    this.#vue.$children[0].removeNotification(id);
  }

  onClearNotifyList(id) {
    this.#vue.$children[0].clearNotifyList(id);
  }

  static getRegistrationMeta() {
    return pluginMeta;
  }

}
