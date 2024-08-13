const ScriptSection = ({ script, onChange }) => (
  <div className="mb-6">
    <h2 className="mb-2 text-xl font-bold">Script</h2>
    <textarea
      name="user_input"
      id="user_input"
      className="w-full h-32 p-2 border-2 outline-none focus:ring-1 focus:ring-black"
      placeholder="Add your script here..."
      onChange={(e) => onChange(e.target.value)}
      value={script}
    ></textarea>
  </div>
);

export default ScriptSection;
