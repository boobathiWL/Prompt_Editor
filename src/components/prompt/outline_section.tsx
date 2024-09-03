import TextArea from "../text_area";

const OutlineSection = ({ outline, onChange }) => (
  <TextArea
    label="Outline"
    placeholder="Add your script here..."
    value={outline}
    onChange={onChange}
    className="h-[8rem] border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
  />
);

export default OutlineSection;
