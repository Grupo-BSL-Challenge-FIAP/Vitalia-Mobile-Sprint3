import { Text, View } from "react-native";
import ContainerTitleSubTitle from "../ContainerTitleSubTitle";
import ContainerForm from "../ContainerForm";
import InputForm from "../InputForm";
import AlertMessageError from "../AlertMessageError";
import ButtonFormLink from "../ButtonFormLink";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { COLORS, FONTS } from "../../styles/styles";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuth } from "../../contexts/AuthContext";
import { useCreatePet } from "../../hooks/useCreatePet";
import { PET_SPECIES } from "../../data/petCatalog";

export default function FormPet() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { isAuthenticated } = useAuth();

  const createPetMutation = useCreatePet();

  const speciesList = PET_SPECIES;

  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(
    null,
  );

  const [selectedBreedId, setSelectedBreedId] = useState<number | null>(null);

  const breedList =
    speciesList.find((species) => species.id === selectedSpeciesId)?.breeds ?? [];

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [messageError, setMessageError] = useState("");

  const [errors, setErrors] = useState({
    name: false,
    species: false,
    breed: false,
    gender: false,
    birthDate: false,
    weight: false,
  });

  const handleBirthDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");

    cleaned = cleaned.slice(0, 8);

    if (cleaned.length > 4) {
      cleaned = cleaned.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    } else if (cleaned.length > 2) {
      cleaned = cleaned.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }

    setBirthDate(cleaned);
  };

  const handleWeightChange = (text: string) => {
    let cleaned = text.replace(/[^0-9.,]/g, "");

    cleaned = cleaned.replace(",", ".");

    setWeight(cleaned);
  };

  const formatDateToApi = (date: string) => {
    const [day, month, year] = date.split("/");

    return `${year}-${month}-${day}`;
  };

  const handleSpeciesChange = (speciesId: number | null) => {
    setSelectedSpeciesId(speciesId);

    setSelectedBreedId(null);

    if (errors.species) {
      setErrors((previous) => ({
        ...previous,
        species: false,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: false,
      species: false,
      breed: false,
      gender: false,
      birthDate: false,
      weight: false,
    };

    const birthDateParts = birthDate.split("/");
    const day = Number(birthDateParts[0]);
    const month = Number(birthDateParts[1]);
    const year = Number(birthDateParts[2]);

    const parsedBirthDate = new Date(year, month - 1, day);

    const today = new Date();

    if (!name.trim()) {
      newErrors.name = true;

      setErrors(newErrors);

      setMessageError("O nome do pet é obrigatório.");

      return false;
    }

    if (name.trim().length < 2 || name.trim().length > 50) {
      newErrors.name = true;

      setErrors(newErrors);

      setMessageError("O nome do pet deve ter entre 2 e 50 caracteres.");

      return false;
    }

    if (!selectedSpeciesId) {
      newErrors.species = true;

      setErrors(newErrors);

      setMessageError("A espécie é obrigatória.");

      return false;
    }

    if (!selectedBreedId) {
      newErrors.breed = true;

      setErrors(newErrors);

      setMessageError("A raça é obrigatória.");

      return false;
    }

    if (!gender.trim()) {
      newErrors.gender = true;

      setErrors(newErrors);

      setMessageError("O sexo biológico é obrigatório.");

      return false;
    }

    if (!birthDate.trim()) {
      newErrors.birthDate = true;

      setErrors(newErrors);

      setMessageError("A data de nascimento é obrigatória.");

      return false;
    }

    if (
      birthDate.length !== 10 ||
      parsedBirthDate.getDate() !== day ||
      parsedBirthDate.getMonth() !== month - 1 ||
      parsedBirthDate.getFullYear() !== year ||
      parsedBirthDate >= today
    ) {
      newErrors.birthDate = true;

      setErrors(newErrors);

      setMessageError(
        "A data de nascimento deve ser válida e estar no passado.",
      );

      return false;
    }

    if (!weight.trim()) {
      newErrors.weight = true;

      setErrors(newErrors);

      setMessageError("O peso é obrigatório.");

      return false;
    }

    const parsedWeight = Number(weight);

    if (parsedWeight <= 0 || Number.isNaN(parsedWeight)) {
      newErrors.weight = true;

      setErrors(newErrors);

      setMessageError("O peso deve ser um valor positivo.");

      return false;
    }

    setErrors(newErrors);

    setMessageError("");

    return true;
  };

  const saveTemporaryPet = async () => {
    const selectedSpecies = speciesList.find(
      (species) => species.id === selectedSpeciesId,
    );

    const selectedBreed = breedList.find(
      (breed) => breed.id === selectedBreedId,
    );

    const petData = {
      id: Date.now(),
      name: name.trim(),

      species: selectedSpecies?.name ?? "",
      speciesId: selectedSpeciesId,

      breed: selectedBreed?.name ?? "",
      breedId: selectedBreedId,

      gender: gender.trim(),
      birthDate,
      weight,

      image: "dogPaws",
    };

    await AsyncStorage.setItem(
      "@petguardian:petsData",
      JSON.stringify([petData]),
    );

    await AsyncStorage.setItem(
      "@petguardian:activePetId",
      String(petData.id),
    );

    console.log("Pet temporário salvo:", petData);
  };

  const createAuthenticatedPet = async () => {
    if (!selectedBreedId) {
      return;
    }

    createPetMutation.mutate(
      {
        name: name.trim(),
        sex: gender.trim(),
        birthDate: formatDateToApi(birthDate),
        weightKg: Number(weight),
        status: "NORMAL",
        breedId: selectedBreedId,
      },
      {
        onSuccess: async (createdPet) => {
          await AsyncStorage.setItem(
            "@petguardian:activePetId",
            String(createdPet.id),
          );

          navigation.goBack();
        },

        onError: (error) => {
          console.error("Erro ao cadastrar pet:", error);

          setMessageError(
            "Não foi possível cadastrar o pet. Tente novamente.",
          );
        },
      },
    );
  };

  const handleFormSubmit = async () => {
    if (createPetMutation.isPending) {
      return;
    }

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    if (isAuthenticated) {
      await createAuthenticatedPet();

      return;
    }

    try {
      await saveTemporaryPet();

      navigation.navigate("AccountCreationConfirmationScreen");
    } catch (error) {
      console.error(
        "Erro ao salvar dados temporários do pet:",
        error,
      );

      setMessageError(
        "Ocorreu um erro ao salvar os dados. Tente novamente.",
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        gap: 30,
        paddingTop: 30,
      }}
    >
      <ContainerTitleSubTitle
        alignItems="center"
        textTitle={
          isAuthenticated
            ? "Cadastre um novo pet"
            : `Agora insira os\ndados do seu pet:`
        }
        textSubTitle="Campos marcados com * são obrigatórios."
        fontSizeSubTitle={15}
      />

      <ContainerForm>
        <InputForm
          label="Nome *"
          placeholder="Digite o nome do pet"
          value={name}
          onChangeText={(text) => {
            setName(text);

            if (errors.name) {
              setErrors((previous) => ({
                ...previous,
                name: false,
              }));
            }
          }}
          error={errors.name}
        />

        {/* ESPÉCIE */}

        <View
          style={{
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.inter[700],
              color: COLORS.orange[900],
              fontSize: 20,
              marginBottom: 10,
            }}
          >
            Espécie *
          </Text>

          <View
            style={{
              height: 60,
              justifyContent: "center",
              borderWidth: 2,
              borderColor: errors.species
                ? COLORS.red[500]
                : COLORS.orange[900],
              borderRadius: 20,
              backgroundColor: COLORS.white[100],
              overflow: "hidden",
            }}
          >
            <Picker
              selectedValue={selectedSpeciesId}
              onValueChange={handleSpeciesChange}
              dropdownIconColor={COLORS.orange[900]}
              style={{
                height: 60,
                color: COLORS.orange[900],
                fontFamily: FONTS.inter[400],
                fontSize: 18,
              }}
            >
              <Picker.Item
                label="Selecione a espécie"
                value={null}
                color={COLORS.gray[100]}
              />

              {speciesList.map((species) => (
                <Picker.Item
                  key={species.id}
                  label={species.name}
                  value={species.id}
                  color={COLORS.orange[900]}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* RAÇA */}

        <View
          style={{
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.inter[700],
              color: COLORS.orange[900],
              fontSize: 20,
              marginBottom: 10,
            }}
          >
            Raça *
          </Text>

          <View
            style={{
              height: 60,
              justifyContent: "center",
              borderWidth: 2,
              borderColor: errors.breed
                ? COLORS.red[500]
                : COLORS.orange[900],
              borderRadius: 20,
              backgroundColor: COLORS.white[100],
              overflow: "hidden",
              opacity: selectedSpeciesId === null ? 0.6 : 1,
            }}
          >
            <Picker
              selectedValue={selectedBreedId}
              enabled={selectedSpeciesId !== null}
              dropdownIconColor={COLORS.orange[900]}
              style={{
                height: 60,
                color: COLORS.orange[900],
                fontFamily: FONTS.inter[400],
                fontSize: 18,
              }}
              onValueChange={(value) => {
                setSelectedBreedId(value);

                if (errors.breed) {
                  setErrors((previous) => ({
                    ...previous,
                    breed: false,
                  }));
                }
              }}
            >
              <Picker.Item
                label={
                  !selectedSpeciesId
                    ? "Selecione primeiro a espécie"
                    : "Selecione a raça"
                }
                value={null}
                color={COLORS.gray[100]}
              />

              {breedList.map((breed) => (
                <Picker.Item
                  key={breed.id}
                  label={breed.name}
                  value={breed.id}
                  color={COLORS.orange[900]}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* SEXO BIOLÓGICO */}

        <View
          style={{
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.inter[700],
              color: COLORS.orange[900],
              fontSize: 20,
              marginBottom: 10,
            }}
          >
            Sexo Biológico *
          </Text>

          <View
            style={{
              height: 60,
              justifyContent: "center",
              borderWidth: 2,
              borderColor: errors.gender
                ? COLORS.red[500]
                : COLORS.orange[900],
              borderRadius: 20,
              backgroundColor: COLORS.white[100],
              overflow: "hidden",
            }}
          >
            <Picker
              selectedValue={gender}
              onValueChange={(value) => {
                setGender(value);

                if (errors.gender) {
                  setErrors((previous) => ({
                    ...previous,
                    gender: false,
                  }));
                }
              }}
              dropdownIconColor={COLORS.orange[900]}
              style={{
                height: 60,
                color: COLORS.orange[900],
                fontFamily: FONTS.inter[400],
                fontSize: 18,
              }}
            >
              <Picker.Item
                label="Selecione o sexo biológico"
                value=""
                color={COLORS.gray[100]}
              />

              <Picker.Item
                label="Macho"
                value="macho"
                color={COLORS.orange[900]}
              />

              <Picker.Item
                label="Fêmea"
                value="fêmea"
                color={COLORS.orange[900]}
              />
            </Picker>
          </View>
        </View>

        <InputForm
          label="Data de nascimento *"
          placeholder="dd/mm/aaaa"
          value={birthDate}
          onChangeText={handleBirthDateChange}
          error={errors.birthDate}
          icon={
            <FontAwesome
              name="calendar-o"
              size={24}
              color={COLORS.orange[900]}
            />
          }
        />

        <InputForm
          label="Peso *"
          placeholder="Digite o peso do pet"
          value={weight}
          onChangeText={handleWeightChange}
          keyboardType="decimal-pad"
          error={errors.weight}
          marginBottom={10}
        />

        {messageError.length > 0 && (
          <AlertMessageError message={messageError} />
        )}

        <View
          style={{
            marginTop: 50,
          }}
        >
          <ButtonFormLink
            onPress={handleFormSubmit}
            backgroundColor={COLORS.orange[900]}
            colorText={COLORS.white[300]}
            fontFamily={FONTS.poppins[700]}
            paddingVertical={7}
            iconRight={
              <AntDesign
                name={isAuthenticated ? "plus" : "arrow-right"}
                size={26}
                color={COLORS.white[300]}
              />
            }
          >
            {createPetMutation.isPending
              ? "Cadastrando..."
              : isAuthenticated
                ? "Cadastrar pet"
                : "Continuar"}
          </ButtonFormLink>
        </View>
      </ContainerForm>
    </View>
  );
}