interface Props {
  children: React.ReactNode;
  className?: string;
}

export const StatusWidget = (props: Props) => {
  return (
    <span
      className={
        "font-mono bg-gray-900 p-2 rounded text-xs opacity-90 " +
        props.className
      }
    >
      {props.children}
    </span>
  );
};
