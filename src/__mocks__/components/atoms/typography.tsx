interface TypographyProps {
    children: React.ReactNode;
    className?: string;
  }

export const mockTypography = ({ children, className }: TypographyProps) => (
    <div className={className}>{children}</div>
);