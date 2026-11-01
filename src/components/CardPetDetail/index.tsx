import { Image, Text, View } from "react-native";
import CardPet from "../CardPet";
import { COLORS, FONTS } from "../../styles/styles";
import { PetResponse } from "../../services/petService";
import { useImages } from "../../contexts/ImageContext";

interface CardPetDetailProps {
  pet: PetResponse;
}

export default function CardPetDetail({
  pet,
}: CardPetDetailProps) {
  const { getPetImage } = useImages();

  const getPetAgeLabel = (
    birthDate?: string,
  ) => {
    if (!birthDate) {
      return "";
    }

    const [year, month, day] = birthDate
      .split("-")
      .map(Number);

    const birth = new Date(
      year,
      month - 1,
      day,
    );

    const today = new Date();

    let months =
      (today.getFullYear() -
        birth.getFullYear()) *
        12 +
      (today.getMonth() - birth.getMonth());

    if (today.getDate() < birth.getDate()) {
      months--;
    }

    if (months < 0) {
      return "";
    }

    if (months < 12) {
      return `Filhote • ${months} ${
        months === 1 ? "mês" : "meses"
      }`;
    }

    const years = Math.floor(months / 12);

    if (years < 8) {
      return `Adulto ${
        years === 1 ? "ano" : "anos"
      }`;
    }

    return `Idoso`;
  };

  const breedLabel = pet.breedName ?? "Raça não informada";

  return (
    <CardPet
      paddingVertical={10}
      paddingHorizontal={15}
    >
      <View>
        <Image
          source={getPetImage(
            pet.speciesId,
            pet.sex,
            undefined,
            pet.id,
          )}
          style={{
            width: 84,
            height: 84,
            borderRadius: 10,
            borderColor: COLORS.orange[500],
            borderWidth: 2,
          }}
        />
      </View>

      <View
        style={{
          gap: 10,
          justifyContent: "center",
        }}
      >
        <View style={{ gap: 10 }}>
          <Text
            style={{
              fontFamily: FONTS.inter[700],
              fontSize: 18,
              color: COLORS.orange[100],
              lineHeight: 20,
            }}
          >
            {pet.name}
          </Text>

          <Text
            style={{
              fontFamily: FONTS.inter[500],
              fontSize: 16,
              color: COLORS.orange[100],
              lineHeight: 20,
            }}
          >
            {`${breedLabel} • ${getPetAgeLabel(
              pet.birthDate,
            )}`}
          </Text>
        </View>
      </View>
    </CardPet>
  );
}