const HomeSections = ({
  className,
  children,
  style,
}: {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className={`mx-auto max-w-6xl p-8 py-24 xl:py-32 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default HomeSections;
