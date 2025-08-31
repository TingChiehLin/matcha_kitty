interface ChipProps {
  label: string;
  icon?: string;
  selected?: boolean;
  onClick?: () => void;
}

const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  selected = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-colors
        ${
          selected
            ? "bg-purple-600 text-white border-purple-600"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
};

export default Chip;
