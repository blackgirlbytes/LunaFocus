
import React, { useState } from 'react';


export function Modal({children}) {
  return (
    <dialog id="my_modal_1" className="modal">
      {children}
    </dialog>
  )
}


export const DynamicDialog = ({title, dialogContent, onClose}) => {

  return (
    <div className="p-4">
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{title}</h3>
            <div className="py-4">{dialogContent}</div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={onClose}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

