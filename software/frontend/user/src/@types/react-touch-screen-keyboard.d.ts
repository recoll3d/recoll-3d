declare module 'react-touch-screen-keyboard' {
  import { ComponentType } from 'react';

  interface KeyboardedInputProps {
    enabled: boolean;
    required: boolean;
    type?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    value?: string;
    min?: number;
    max?: number;
    step?: number;
    name?: string;
    inputClassName?: string;
    keyboardClassName?: string;
    placeholder?: string;
    defaultKeyboard?: string;
    secondaryKeyboard?: string;
    isFirstLetterUppercase?: boolean;
    uppercaseAfterSpace?: boolean;
    isDraggable?: boolean;
    readOnly?: boolean;
    opacity?: number;
  }

  const KeyboardedInput: Component<KeyboardedInputProps>;

  export default KeyboardedInput;
}
