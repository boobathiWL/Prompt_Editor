import TextArea from "../text_area";

const ScriptSection = ({ script, onChange, className = "" }) => (
  <>
    <TextArea
      label=""
      placeholder="Add your script here..."
      value={script}
      onChange={onChange}
      className={`h-[9rem] border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 ${className}`}
    />
  </>
);

export default ScriptSection;
