interface CircleWithTickProps {
  bgColor?: string;
  tickColor?: string;
  size?: string;
}
const CircleWithTick = (props: CircleWithTickProps) => {
  const {
    bgColor = "bg-green-500",
    tickColor = "text-white",
    size = "h-3 w-3",
  } = props;
  return (
    <div
      className={`flex items-center justify-center ${size} ${bgColor} rounded-full`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-2.5 h-2.5 ${tickColor}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  );
};

export default CircleWithTick;
