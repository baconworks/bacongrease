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

  // close modal on background click — but only when the press STARTED on the background too.
  //
  // A `click` fires on the nearest common ancestor of where the press began and where it ended. So
  // selecting text in a field by dragging — press inside the panel, release past its edge — produces a
  // click whose target is the backdrop, and closing on that alone threw away whatever the user had typed.
  // Tracking the press origin means a drag that starts inside the panel never closes it, however far it
  // travels; a genuine backdrop click (press and release both outside) still does.
  //
  // THE BACKDROP IS THIS ELEMENT ITSELF, which is why the test is `target === currentTarget` rather than
  // "outside the panel". A dropdown belonging to a field in the panel may be PORTALED to <body> to escape
  // the panel's clipping — it is then a React child of the modal, so its events bubble to these handlers,
  // while sitting outside the panel in the DOM. Asking "is the target inside the panel?" called every press
  // on such a menu a backdrop press and closed the modal underneath the option being chosen. Asking whether
  // the press landed on the backdrop NODE answers no for anything the modal owns, portaled or not.
  const pressedOnBackdrop = useRef(false);

  const handleModalPointerDown = ( event: MouseEvent ) => {
    pressedOnBackdrop.current = event.target === event.currentTarget;
  };

  const handleModalClick = ( event: MouseEvent ) => {
    if (event.target === event.currentTarget && pressedOnBackdrop.current) onClose?.();
    pressedOnBackdrop.current = false;
  };

  if (!modalRoot || !open) return;
  return createPortal(
    <div
      onMouseDown={ handleModalPointerDown }
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
      <div className="modal_content">
        { children }
      </div>
    </div>,
    modalRoot
  )
};

export default Modal;
