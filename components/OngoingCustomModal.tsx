import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ModalProps } from 'react-native';

interface CustomModalProps {
  visible: boolean;
  cancelModal: () => void;
  confirmDeletion: () => void;
  confirmOngoing: () => void;
  title: string;
  subtitle: string;
}

const OngoingCustomModal: React.FC<CustomModalProps> = ({ visible, cancelModal, confirmDeletion,confirmOngoing, title, subtitle }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={cancelModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{subtitle}</Text>
          <View style={styles.modalButtons}>
            <Pressable style={styles.cancelButton} onPress={cancelModal}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.ongoingButton} onPress={confirmOngoing}>
              <Text style={styles.buttonText}>Ongoing</Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={confirmDeletion}>
              <Text style={styles.buttonText}>Finish</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 13,
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  ongoingButton: {
    backgroundColor: '#4CC9FE',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OngoingCustomModal;
