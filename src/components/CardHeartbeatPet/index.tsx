import { Image, Text, TouchableOpacity, View, } from "react-native";
import { COLORS, FONTS } from "../../styles/styles";
import TitleOrange from "../TitleOrange";
import SubTitleOrange from "../SubTitleOrange";
import BpmCircle from "../BpmCircle";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { CardHeartbeatPetType } from '../../types/CardHeartbeatPetType';
import { useImages } from "../../contexts/ImageContext";

export default function CardHeartbeatPet({ pet, onPress,}: CardHeartbeatPetType) {
  const { getPetImage } = useImages();

  const getSpeciesIdFromPet = () => {
    if (typeof pet?.speciesId === "number") {
      return pet.speciesId;
    }

    return null;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: COLORS.orange[100],
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderColor: COLORS.orange[900],
        padding: 15,
        borderRadius: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Image
            source={getPetImage(
              pet.speciesId,
              pet.sex,
              undefined,
              pet.id,
            )}
            style={{
              width: 70,
              height: 70,
              borderRadius: 10,
              borderColor: COLORS.orange[900],
              borderWidth: 2,
            }}
          />

          <View>
            <TitleOrange
              title={pet.name}
              fontSize={20}
              fontFamily={FONTS.inter[700]}
            />

            <SubTitleOrange
              title={pet.breedName ?? "Raça não informada"}
              fontFamily={FONTS.inter[500]}
              color={COLORS.orange[900]}
              fontSize={12}
            />

            <SubTitleOrange
              title={pet.sex}
              fontFamily={FONTS.inter[500]}
              color={COLORS.orange[900]}
              fontSize={12}
            />
          </View>
        </View>

        <BpmCircle />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginLeft: -60,
          }}
        >
          <MaterialCommunityIcons
            name="needle"
            size={24}
            color={COLORS.orange[900]}
          />

          <Text
            style={{
              fontFamily: FONTS.inter[700],
              fontSize: 14,
              color: COLORS.orange[900],
            }}
          >
            Vacina em 3 dias
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: -30,
        }}
      >
        <Entypo
          name="chevron-small-right"
          size={35}
          color="black"
        />
      </View>
    </TouchableOpacity>
  );
}
