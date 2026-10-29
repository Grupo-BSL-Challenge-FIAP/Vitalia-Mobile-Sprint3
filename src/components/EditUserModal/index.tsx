import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { COLORS, FONTS } from "../../styles/styles";
import { MeResponse } from "../../services/authService";
import { useUpdateCurrentUser } from "../../hooks/useUpdateCurrentUser";
import { useImages } from "../../contexts/ImageContext";
import * as ImagePicker from "expo-image-picker";

interface EditUserModalProps {
  visible: boolean;
  user: MeResponse;
  onClose: () => void;
}

export default function EditUserModal({
  visible,
  user,
  onClose,
}: EditUserModalProps) {
  const updateUserMutation = useUpdateCurrentUser();
  const { getUserImage } = useImages();
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [cpf, setCpf] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formatDateToMobile = (date?: string | null) => {
    if (!date) {
      return "";
    }

    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
  };

  const formatDateToApi = (date: string) => {
    const [day, month, year] = date.split("/");

    return `${year}-${month}-${day}`;
  };

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const handleBirthDateChange = (value: string) => {
    let numbers = value.replace(/\D/g, "").slice(0, 8);

    if (numbers.length > 4) {
      numbers = numbers.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    } else if (numbers.length > 2) {
      numbers = numbers.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }

    setDateOfBirth(numbers);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    if (!visible) {
      return;
    }

    setFullName(user.fullName ?? "");
    setDateOfBirth(formatDateToMobile(user.dateOfBirth));
    setCpf(formatCpf(user.cpf ?? ""));
    setPhoneNumber(formatPhone(user.phoneNumber ?? ""));
    setAddress(user.address ?? "");
    setSelectedImage(null);
  }, [visible, user]);

  const handleSave = () => {
    if (
      !fullName.trim() ||
      !dateOfBirth.trim() ||
      !cpf.trim() ||
      !phoneNumber.trim() ||
      !address.trim()
    ) {
      Alert.alert("Dados incompletos", "Preencha todos os campos.");

      return;
    }

    const cleanCpf = cpf.replace(/\D/g, "");

    const cleanPhone = phoneNumber.replace(/\D/g, "");

    if (cleanCpf.length !== 11) {
      Alert.alert("CPF inválido", "Informe um CPF válido.");

      return;
    }

    if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
      Alert.alert("Telefone inválido", "Informe um telefone válido.");

      return;
    }

    updateUserMutation.mutate(
      {
        fullName: fullName.trim(),
        dateOfBirth: formatDateToApi(dateOfBirth),
        cpf: cleanCpf,
        phoneNumber: cleanPhone,
        address: address.trim(),
      },
      {
        onSuccess: () => {
          onClose();
        },

        onError: (error) => {
          console.error("Erro ao atualizar usuário:", error);

          Alert.alert("Erro", "Não foi possível atualizar suas informações.");
        },
      },
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            justifyContent: "center",
            paddingHorizontal: 25,
          }}
        >
          <View
            style={{
              maxHeight: "90%",
              backgroundColor: COLORS.white[100],
              borderRadius: 15,
              paddingHorizontal: 25,
              paddingVertical: 25,
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* CABEÇALHO */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 25,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.inter[700],
                    fontSize: 24,
                    color: COLORS.orange[900],
                  }}
                >
                  Editar dados
                </Text>

                <TouchableOpacity
                  onPress={onClose}
                  disabled={updateUserMutation.isPending}
                  style={{
                    position: "absolute",
                    right: 0,
                  }}
                >
                  <AntDesign name="close-circle" size={34} color="black" />
                </TouchableOpacity>
              </View>

              {/* FOTO */}

              <View
                style={{
                  alignItems: "center",
                  marginBottom: 35,
                }}
              >
                <View>
                  <Image
                    source={
                      selectedImage ? { uri: selectedImage } : getUserImage()
                    }
                    style={{
                      width: 135,
                      height: 135,
                      borderRadius: 100,
                      borderWidth: 2,
                      borderColor: COLORS.orange[900],
                    }}
                  />

                  <TouchableOpacity
                    onPress={handlePickImage}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 5,
                      width: 38,
                      height: 38,
                      borderRadius: 20,
                      backgroundColor: COLORS.orange[900],
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AntDesign
                      name="edit"
                      size={20}
                      color={COLORS.white[100]}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* NOME */}

              <Text
                style={{
                  fontFamily: FONTS.inter[700],
                  color: COLORS.orange[900],
                  fontSize: 17,
                  marginBottom: 6,
                }}
              >
                Nome
              </Text>

              <TextInput
                value={fullName}
                onChangeText={setFullName}
                style={{
                  backgroundColor: COLORS.orange[100],
                  borderBottomWidth: 3,
                  borderBottomColor: COLORS.orange[900],
                  borderRadius: 7,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 22,
                  fontFamily: FONTS.inter[400],
                  fontSize: 17,
                  color: COLORS.orange[900],
                }}
              />

              {/* NASCIMENTO */}

              <Text
                style={{
                  fontFamily: FONTS.inter[700],
                  color: COLORS.orange[900],
                  fontSize: 17,
                  marginBottom: 6,
                }}
              >
                Nascimento
              </Text>

              <TextInput
                value={dateOfBirth}
                onChangeText={handleBirthDateChange}
                placeholder="dd/mm/aaaa"
                keyboardType="numeric"
                style={{
                  backgroundColor: COLORS.orange[100],
                  borderBottomWidth: 3,
                  borderBottomColor: COLORS.orange[900],
                  borderRadius: 7,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 22,
                  fontFamily: FONTS.inter[400],
                  fontSize: 17,
                  color: COLORS.orange[900],
                }}
              />

              {/* CPF */}

              <Text
                style={{
                  fontFamily: FONTS.inter[700],
                  color: COLORS.orange[900],
                  fontSize: 17,
                  marginBottom: 6,
                }}
              >
                CPF
              </Text>

              <TextInput
                value={cpf}
                onChangeText={(value) => setCpf(formatCpf(value))}
                keyboardType="numeric"
                maxLength={14}
                style={{
                  backgroundColor: COLORS.orange[100],
                  borderBottomWidth: 3,
                  borderBottomColor: COLORS.orange[900],
                  borderRadius: 7,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 22,
                  fontFamily: FONTS.inter[400],
                  fontSize: 17,
                  color: COLORS.orange[900],
                }}
              />

              {/* TELEFONE */}

              <Text
                style={{
                  fontFamily: FONTS.inter[700],
                  color: COLORS.orange[900],
                  fontSize: 17,
                  marginBottom: 6,
                }}
              >
                Telefone
              </Text>

              <TextInput
                value={phoneNumber}
                onChangeText={(value) => setPhoneNumber(formatPhone(value))}
                keyboardType="phone-pad"
                maxLength={15}
                style={{
                  backgroundColor: COLORS.orange[100],
                  borderBottomWidth: 3,
                  borderBottomColor: COLORS.orange[900],
                  borderRadius: 7,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 22,
                  fontFamily: FONTS.inter[400],
                  fontSize: 17,
                  color: COLORS.orange[900],
                }}
              />

              {/* ENDEREÇO */}

              <Text
                style={{
                  fontFamily: FONTS.inter[700],
                  color: COLORS.orange[900],
                  fontSize: 17,
                  marginBottom: 6,
                }}
              >
                Endereço
              </Text>

              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Digite seu endereço"
                style={{
                  backgroundColor: COLORS.orange[100],
                  borderBottomWidth: 3,
                  borderBottomColor: COLORS.orange[900],
                  borderRadius: 7,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 30,
                  fontFamily: FONTS.inter[400],
                  fontSize: 17,
                  color: COLORS.orange[900],
                }}
              />

              {/* SALVAR */}

              <TouchableOpacity
                onPress={handleSave}
                disabled={updateUserMutation.isPending}
                style={{
                  backgroundColor: COLORS.orange[900],
                  paddingVertical: 13,
                  borderRadius: 7,
                  alignItems: "center",
                  opacity: updateUserMutation.isPending ? 0.6 : 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.inter[700],
                    fontSize: 17,
                    color: COLORS.white[100],
                  }}
                >
                  {updateUserMutation.isPending
                    ? "Salvando..."
                    : "Salvar informações"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
