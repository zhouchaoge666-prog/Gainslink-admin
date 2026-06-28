import { useState, useRef } from 'react';

interface NumericInputProps {
  value: number | undefined | null;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  allowEmpty?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function NumericInput({
  value,
  onChange,
  min = 0,
  max,
  allowEmpty,
  placeholder,
  className = '',
  disabled,
}: NumericInputProps) {
  const [raw, setRaw] = useState(valueToRaw(value));
  const isFocused = useRef(false);

  // 仅在非聚焦状态下从外部值同步，避免用户清空输入时被强制还原
  const valueString = valueToRaw(value);
  if (!isFocused.current && raw !== valueString) {
    setRaw(valueString);
  }

  const normalize = (v: string): number | undefined => {
    if (v === '') return allowEmpty ? undefined : min;
    const n = parseInt(v, 10);
    if (Number.isNaN(n)) return allowEmpty ? undefined : min;
    if (n < min) return min;
    if (max !== undefined && n > max) return max;
    return n;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    // 允许临时为空或仅包含减号/加号，方便用户删除重输
    if (v === '' || v === '-' || v === '+') {
      setRaw(v);
      if (allowEmpty) onChange(undefined);
      return;
    }
    // 只保留数字字符（允许前导 +/-）
    const cleaned = v.replace(/[^0-9]/g, '');
    setRaw(cleaned);
    if (cleaned !== '') {
      const n = normalize(cleaned);
      onChange(n);
    } else if (allowEmpty) {
      onChange(undefined);
    }
  };

  const handleBlur = () => {
    isFocused.current = false;
    const n = normalize(raw);
    setRaw(valueToRaw(n));
    onChange(n);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={raw}
      placeholder={placeholder}
      disabled={disabled}
      onChange={handleChange}
      onFocus={() => { isFocused.current = true; }}
      onBlur={handleBlur}
      className={className}
    />
  );
}

function valueToRaw(value: number | undefined | null): string {
  if (value === undefined || value === null) return '';
  return String(value);
}
