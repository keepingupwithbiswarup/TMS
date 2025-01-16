import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import { User } from '../utilities/types';

interface AddMembersModalProps {
  visible: boolean;
  onClose: () => void;
  membersList: User[];
  onAddMember: (selectedMembers: User[]) => void;
  teamId:number
}

const getRandomDarkColor = () => {
  const letters = '012345'.split('');
  const color = `#${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}`;
  return color;
};

const AddMembersModal: React.FC<AddMembersModalProps> = ({
  visible,
  onClose,
  membersList,
  onAddMember,
  teamId,
}) => {
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);


  const toggleMemberSelection = (member: User) => {
    if (selectedMembers.some((item) => item.Email === member.Email)) {
      setSelectedMembers(
        selectedMembers.filter((item) => item.Email !== member.Email)
      );
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const renderMemberItem = ({ item }: { item: User }) => {
    const isSelected = selectedMembers.some(
      (member) => member.Email === item.Email
    );
    return (
        <TouchableOpacity onPress={()=>toggleMemberSelection(item)}>
      <View style={styles.memberItem}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: getRandomDarkColor() },
          ]}
        >
          <Text style={styles.avatarText}>
            {item.Username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.Username}</Text>
          <Text style={styles.memberPhone}>{item.Email}</Text>
        </View>
        <CheckBox
          isChecked={isSelected}
          onClick={() => toggleMemberSelection(item)}
          checkBoxColor="#17594A"
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={require('../assets/back2.png')}
                style={{ height: 18, width: 18, marginLeft: 5 }}
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Invite Members</Text>
            <TouchableOpacity onPress={() => onAddMember(selectedMembers)}>
              <View
                style={{
                  backgroundColor: '#17594A',
                  paddingHorizontal: 15,
                  padding: 6,
                  borderRadius: 5,
                  position: 'relative',
                  right: 0,
                }}
              >
                <Text style={[styles.nextButton, { color: 'white' }]}>Add</Text>
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            data={membersList}
            keyExtractor={(item) => item.Email}
            renderItem={renderMemberItem}
            style={styles.memberList}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AddMembersModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 17,
    textAlign: 'center',
    marginLeft: 25,
  },
  nextButton: {
    fontSize: 15,
  },
  memberList: {
    marginTop: 10,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
  },
  memberPhone: {
    fontSize: 13,
    color: '#666',
    fontStyle:"italic",
  },
});
