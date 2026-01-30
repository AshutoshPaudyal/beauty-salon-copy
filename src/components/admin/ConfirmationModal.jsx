import React from "react";
import { createPortal } from "react-dom";
import { CheckCircle, AlertCircle } from "lucide-react";

const ConfirmationModalContent = ({ onClose, onConfirm, title, message, actionType }) => {
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Full screen backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-2xl animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200 border border-pink-50 relative z-[1001]">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto ${actionType === 'delete' ? 'bg-red-50 text-red-600' :
                    actionType === 'complete' ? 'bg-green-50 text-green-600' :
                        'bg-pink-50 text-secondary'
                    }`}>
                    {actionType === 'delete' ? <AlertCircle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-serif font-bold text-center text-muted-foreground mb-4">{title}</h3>
                <p className="text-center text-muted-foreground mb-8 leading-relaxed">
                    {message}
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-xl border border-gray-100 font-medium text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-6 py-3 rounded-xl text-white font-medium transition-all shadow-md active:scale-95 cursor-pointer ${actionType === 'delete' ? 'bg-red-600 hover:bg-red-700' :
                            actionType === 'complete' ? 'bg-green-600 hover:bg-green-700' :
                                'bg-secondary hover:bg-button-hover'
                            }`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

const ConfirmationModal = (props) => {
    if (!props.isOpen) return null;
    return createPortal(
        <ConfirmationModalContent {...props} />,
        document.body
    );
};

export default ConfirmationModal;
