'use client'
// types
import { MouseEvent, useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";

// hooks
import { createPortal } from "react-dom";

// helpers
import { cleanClasses } from "../utils/clean-classes";

// styles
import './modal.styles.scss';

interface ModalProps extends ComponentPropsWithoutRef<'div'> {
  open: boolean;
  onClose?: () => void;
};

const Modal = ({ children, className, open = false, onClose, ...divProps }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [ modalRoot, setModalRoot ] = useState<HTMLElement | null>(null);

  // set modal root on mount — prefer a dedicated `#modal-root`, otherwise
  // fall back to <body> so the component works with no host-app markup.
  useEffect(() => {
    setModalRoot(document.getElementById('modal-root') ?? document.body);
  }, [])

  // close modal on escape
  useEffect(() => {
    if (!open || !onClose) return;

    const handleKeyDown = ( event: KeyboardEvent ) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [ open, onClose ]);

  // close modal on background click
  const handleModalClick = ( event: MouseEvent ) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose?.()
    };
  };

  if (!modalRoot || !open) return;
  return createPortal(
    <div
      onClick={ handleModalClick }
      className={
        cleanClasses(
          'modal',
          { classes: className,
            modifiers: [ open ? 'open' : 'closed' ]
          }
        )
      }
      { ...divProps }
    >
      <div ref={ modalRef } className="modal_content">
        { children }
      </div>
    </div>,
    modalRoot
  )
};

export default Modal;
