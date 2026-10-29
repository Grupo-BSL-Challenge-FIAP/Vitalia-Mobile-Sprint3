import { ActivityIndicator, Image, Text, TouchableOpacity, View,} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS, FONTS } from "../../styles/styles";
import TitleOrange from "../TitleOrange";
import SubTitleOrange from "../SubTitleOrange";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useState } from "react";
import EditUserModal from "../EditUserModal";
import { useImages } from "../../contexts/ImageContext";

export default function CardProfileUser() {
  const { data: user, isLoading, isError } = useCurrentUser();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { getUserImage } = useImages();

  const formatCpf = (cpf?: string | null) => {
    if (!cpf) {
      return "Não informado";
    }

    const numbers = cpf.replace(/\D/g, "");

    if (numbers.length !== 11) {
      return cpf;
    }

    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  if (isLoading) {
    return (
      <View
        style={{
          backgroundColor: COLORS.orange[800],
          padding: 15,
          borderBottomWidth: 2,
          borderWidth: 1,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 110,
        }}
      >
        <ActivityIndicator size="small" color={COLORS.orange[900]} />
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View
        style={{
          backgroundColor: COLORS.orange[800],
          padding: 15,
          borderBottomWidth: 2,
          borderWidth: 1,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 110,
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.inter[500],
            color: COLORS.orange[900],
          }}
        >
          Não foi possível carregar o perfil.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: COLORS.orange[800],
        padding: 15,
        borderBottomWidth: 2,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
        }}
      >
        <View>
          <Image
            source={getUserImage()}
            style={{
              width: 80,
              height: 80,
              borderRadius: 100,
              borderBottomWidth: 2,
              borderWidth: 1,
              borderColor: COLORS.orange[900],
            }}
          />
        </View>

        <View>
          <TitleOrange
            title={user.fullName}
            fontSize={18}
            fontFamily={FONTS.inter[700]}
          />

          <SubTitleOrange
            title={`CPF: ${formatCpf(user.cpf)}`}
            fontSize={14}
            color={COLORS.orange[900]}
            fontFamily={FONTS.inter[400]}
          />
        </View>
      </View>

      <View>
        <TouchableOpacity
          onPress={() => setEditModalVisible(true)}
          style={{
            borderRadius: 100,
            backgroundColor: COLORS.orange[900],
            padding: 7,
          }}
        >
          <AntDesign name="edit" size={24} color={COLORS.gray[200]} />
        </TouchableOpacity>
      </View>

      <EditUserModal
        visible={editModalVisible}
        user={user}
        onClose={() => setEditModalVisible(false)}
      />
    </View>
  );
}
