interface MatchCardProps {
  title: string;
  description: string | React.ReactNode;
  defaultOpen?: boolean;
}

const MatchCard = ({
  title,
  description,
  defaultOpen = false,
}: MatchCardProps) => {
  return (
    <details
      className="group rounded-lg border border-gray-200 p-4"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none font-medium text-zinc-900">
        {title}
      </summary>
      <div className="mt-2 leading-relaxed text-zinc-700">{description}</div>
    </details>
  );
};

export default MatchCard;
