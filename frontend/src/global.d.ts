declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'v-emoji-picker' {
  import { VueConstructor } from 'vue';

  interface EmojiData {
    data: string;
  }

  interface VEmojiPickerProps {
    showSearch?: boolean;
    emojisByRow?: number;
    labelSearch?: string;
    lang?: string;
  }

  const VEmojiPicker: VueConstructor<VEmojiPickerProps>;

  export { VEmojiPicker };
  export default VEmojiPicker;
}