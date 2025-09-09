import React from "react";

interface InputProps {
  type: string;
  name?: string;
  id?: string;
  value?: string | number;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<InputProps> = ({
  type,
  name,
  id,
  value,
  placeholder,
  className = "",
  required = false,
  disabled = false,
  label,
  leftIcon,
  rightIcon,
  onChange,
  error,
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          name={name}
          id={id}
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={onChange}
          className={`w-full ${leftIcon ? "pl-10" : "pl-4"} ${
            rightIcon ? "pr-10" : "pr-4"
          } py-3 border text-black rounded-xl 
      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors 
      ${error ? "border-red-500" : "border-gray-300"} ${className}`}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CustomInput;
