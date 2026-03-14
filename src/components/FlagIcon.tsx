import Image from 'next/image';

const EMOJI_TO_CODE: Record<string, string> = {
  '\u{1F1FA}\u{1F1F8}': 'us',
  '\u{1F1EF}\u{1F1F5}': 'jp',
  '\u{1F1FB}\u{1F1F3}': 'vn',
  '\u{1F1E8}\u{1F1F3}': 'cn',
  '\u{1F1ED}\u{1F1F0}': 'hk',
  '\u{1F1F9}\u{1F1FC}': 'tw',
  '\u{1F1F0}\u{1F1F7}': 'kr',
  '\u{1F1F8}\u{1F1EC}': 'sg',
  '\u{1F1F7}\u{1F1FA}': 'ru',
  '\u{1F1EC}\u{1F1E7}': 'gb',
  '\u{1F1E9}\u{1F1EA}': 'de',
};

interface FlagIconProps {
  emoji: string;
  size?: number;
  className?: string;
}

export default function FlagIcon({ emoji, size = 44, className = '' }: FlagIconProps) {
  const code = EMOJI_TO_CODE[emoji];

  if (!code) {
    return (
      <div
        className={`rounded-full bg-[var(--bg-secondary)] flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <span style={{ fontSize: size * 0.55 }}>{emoji}</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-full overflow-hidden shrink-0 ring-1 ring-white/10 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={`/images/flags/${code}.svg`}
        alt=""
        width={size}
        height={size}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
