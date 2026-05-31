type PageTitleProps =
  | {
      title: string;
      children?: React.ReactNode;
    }
  | {
      title: string;
      children?: React.ReactNode;
    };

const PageTitle = ({ title, children }: PageTitleProps) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h1 className="text-3xl font-bold">{title}</h1>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};

export default PageTitle;
