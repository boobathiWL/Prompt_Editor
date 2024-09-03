const TextArea = ({ label, placeholder, value, onChange, className }) => {
  return (
    <div>
      <label className="block mb-2 font-semibold text-gray-700">{label}</label>
      <textarea
        className={`p-4 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e?.target?.value)}
      ></textarea>
    </div>
  );
};

export default TextArea;
