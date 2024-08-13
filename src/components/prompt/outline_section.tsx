const OutlineSection = ({ outline, onChange }) => (
  <div className="mb-6">
    <h2 className="mb-2 text-xl font-bold">Outline</h2>
    <textarea
      name="user_outline"
      id="user_outline"
      className="w-full h-32 p-2 border-2 outline-none focus:ring-1 focus:ring-black"
      placeholder="Add your outline here..."
      onChange={(e) => onChange({ outline: e.target.value })}
      value={outline}
    ></textarea>
  </div>
);

export default OutlineSection;
