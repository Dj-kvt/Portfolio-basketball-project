// frontend/src/components/Common/InputField.jsx
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  inputClassName = "", // <-- nouvelle prop pour personnaliser le style
}) => (
  <div className="mb-3">
    {label && <label className="block text-sm font-medium mb-1">{label}</label>}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${inputClassName}`}
    />
  </div>
);

export default InputField;
