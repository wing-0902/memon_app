//@ts-ignore
import { registerSW } from 'virtual:pwa-register';

// immediate を削除。デフォルトでは 'autoUpdate' または手動更新になります
registerSW({
  onRegistered(r) {
    console.log('SW Registered:', r);
  },
  onRegisterError(error) {
    console.error('SW registration error', error);
  }
});
