import React from "react";

interface Custommodelprops {
  onCancel?: () => void;
  onOk?: () => void;
  message?: string;
  oktest?: string;
  Action?: string;
}
const CustomPopup: React.FC<Custommodelprops> = ({
  message,
  onOk,
  onCancel,
  oktest,
  Action,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
        <h2 className="text-lg font-semibold text-gray-800">
          Confirm {Action}
        </h2>
        <p className="text-gray-600 mt-2">{message}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onOk}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            {oktest}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPopup;
