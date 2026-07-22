import { LucideIcon } from 'lucide-react';

type Variant = 'default' | 'danger' | 'warning' | 'primary';

type Props = {
  icon: LucideIcon;
  onClick: () => void;
  variant?: Variant;
  size?: number;
  disabled?: boolean;
  className?: string;
};

const variantStyles: Record<Variant, string> = {
  default: 'text-gray-300 hover:text-gray-500',
  danger: 'text-gray-300 hover:text-red-500',
  warning: 'text-gray-300 hover:text-yellow-500',
  primary: 'text-gray-300 hover:text-blue-500',
};

export default function IconButton({
  icon: Icon,
  onClick,
  variant = 'default',
  size = 16,
  disabled = false,
  className = '',
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${variantStyles[variant]} disabled:opacity-50 ${className}`}
    >
      <Icon size={size} />
    </button>
  );
}
