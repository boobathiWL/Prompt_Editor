interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?;
}

const Button = (props: ButtonProps) => {
  const { children, onClick, className, disabled = false } = props;
  return (
    <button
      className={`py-2 px-3 rounded-lg shadow transition duration-150 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
