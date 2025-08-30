interface DetailAccordionProps {
  title: string;
  description: string | React.ReactNode;
  defaultOpen?: boolean;
}

const DetailAccordion = ({
  title,
  description,
  defaultOpen = false,
}: DetailAccordionProps) => {
  return (
    <details
      className="group rounded-lg border border-gray-200 dark:border-white/15 p-4"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none font-medium text-gray-900 dark:text-gray-100">
        {title}
      </summary>
      <div className="mt-2 leading-relaxed text-gray-700 dark:text-gray-300">
        {description}
      </div>
    </details>
  );
};

export default DetailAccordion;
