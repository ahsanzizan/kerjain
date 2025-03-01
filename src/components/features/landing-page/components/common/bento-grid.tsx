import { Text } from "@/components/common/text";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-[18rem] lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-transparent bg-white p-4 transition duration-200 hover:shadow-xl",
        className,
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <Text
          variant="headline-bold"
          className="mb-2 mt-2 font-sans font-bold text-text-600"
        >
          {title}
        </Text>
        <Text
          variant="callout"
          className="font-sans text-xs font-normal text-text-400"
        >
          {description}
        </Text>
      </div>
    </div>
  );
};
