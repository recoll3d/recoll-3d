import { useEffect } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

export function BasicUsage({
  isOpenModal,
  handleModalClose,
  isRecycling,
  recyclingData,
  handleRecyclingStart,
  bottles,
  timerInSeconds,
}: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (isOpenModal) {
      onOpen();
    }
  }, [isOpenModal]);

  return (
    <>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={() => handleModalClose(onClose)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Processo de reciclagem</ModalHeader>
          {!isRecycling && (
            <ModalCloseButton onClick={() => handleModalClose(onClose)} />
          )}
          <ModalBody>
            {!isRecycling && recyclingData.score == 0 && (
              <Text fontWeight="bold" mb="1rem">
                Clique em "Iniciar Reciclagem" para começar.
              </Text>
            )}
            {!isRecycling && recyclingData.score > 0 && (
              <Text fontWeight="bold" mb="1rem">
                É isso aí!!! <br />
                Você obteve {recyclingData.score} pontos reciclando{" "}
                {recyclingData.number_of_bottles}{" "}
                {recyclingData.number_of_bottles > 1 ? "garrafas" : "garrafa"}.
              </Text>
            )}
            {isRecycling && (
              <>
                <Text fontWeight="bold" mb="1rem">
                  {/* Insira suas garrafas. */}
                  {!bottles.length && "Nenhuma garrafa inserida."}
                  {bottles.length == 1 && "1 garrafa inserida."}
                  {bottles.length > 1 &&
                    bottles.length + " " + "garrafas inseridas."}
                </Text>
                <Text fontWeight="bold" mb="1rem">
                  {/* Insira suas garrafas. */}
                  Você tem {timerInSeconds} segundos restantes.
                </Text>
              </>
            )}
            {/* <Lorem count={2} /> */}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme={!isRecycling ? "green" : "red"}
              mr={3}
              onClick={handleRecyclingStart}
            >
              {!isRecycling && recyclingData.score == 0 && "Iniciar Reciclagem"}
              {!isRecycling &&
                recyclingData.score > 0 &&
                "Continuar Reciclando"}
              {isRecycling && "Parar Reciclagem"}
            </Button>
            {/* {!recycling && (
              <Button colorScheme="red" mr={3} onClick={handleClose}>
                Close
              </Button>
            )} */}
            {/* <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
