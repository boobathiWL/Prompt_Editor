import TextArea from "../test_area";

const ScriptSection = ({ script, onChange }) => (
  <TextArea
    label="Script"
    placeholder="Add your script here..."
    value={script}
    onChange={onChange}
    className="h-[9rem] border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
  />
);

export default ScriptSection;
