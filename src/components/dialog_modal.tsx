import Modal, { ModalProps } from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

type DialogModalProps = {
  handleClose: () => void;
} & ModalProps;

function DialogModal(props: DialogModalProps) {
  const { open, handleClose, children, className = "", ...rest } = props;
  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      {...rest}
    >
      <Fade in={open}>
        <div
          className={`w-[94%] md:w-fit sm:w-fit rounded-lg overflow-y-auto mx-auto mt-[12vh] absolute -translate-x-1/2 -translate-y-1/2 top-1/3 left-1/2 ${className}`}
        >
          {children}
        </div>
      </Fade>
    </Modal>
  );
}

export default DialogModal;
