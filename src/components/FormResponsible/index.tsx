import { View } from "react-native";
import InputForm from "../InputForm";
import ContainerTitleSubTitle from "../ContainerTitleSubTitle";
import { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { COLORS, FONTS } from "../../styles/styles";
import ContainerForm from "../ContainerForm";
import AntDesign from "@expo/vector-icons/AntDesign";
import TextLink from "../TextLink";
import ButtonFormLink from "../ButtonFormLink";
import AlertMessageError from "../AlertMessageError";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

export default function FormResponsible() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [messageError, setMessageError] = useState("");
  const [errors, setErrors] = useState({
    name: false,
    birthDate: false,
    cpf: false,
    phone: false,
    address: false,
    email: false,
    password: false,
    confirmPassword: false,
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

  const handleCpfChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");

    cleaned = cleaned.slice(0, 11);

    if (cleaned.length > 9) {
      cleaned = cleaned.replace(
        /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
        "$1.$2.$3-$4",
      );
    } else if (cleaned.length > 6) {
      cleaned = cleaned.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (cleaned.length > 3) {
      cleaned = cleaned.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    setCpf(cleaned);
  };

  const handlePhoneChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    cleaned = cleaned.slice(0, 11);

    if (cleaned.length > 6) {
      cleaned = cleaned.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
    } else if (cleaned.length > 2) {
      cleaned = cleaned.replace(/(\d{2})(\d{1,5})/, "($1) $2");
    }
    setPhone(cleaned);
  };

  const validateForm = () => {
    const newErrors = {
      name: false,
      birthDate: false,
      cpf: false,
      phone: false,
      address: false,
      email: false,
      password: false,
      confirmPassword: false,
    };

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

    const birthDateParts = birthDate.split("/");
    const day = Number(birthDateParts[0]);
    const month = Number(birthDateParts[1]);
    const year = Number(birthDateParts[2]);
    const parsedBirthDate = new Date(year, month - 1, day);
    const today = new Date();

    if (!name.trim()) {
      newErrors.name = true;
      setErrors(newErrors);
      setMessageError("O nome completo é obrigatório.");
      return false;
    }

    if (name.trim().length < 3 || name.trim().length > 100) {
      newErrors.name = true;
      setErrors(newErrors);
      setMessageError("O nome deve ter entre 3 e 100 caracteres.");
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

    if (!cpf.trim()) {
      newErrors.cpf = true;
      setErrors(newErrors);
      setMessageError("O CPF é obrigatório.");
      return false;
    }

    if (!cpfRegex.test(cpf)) {
      newErrors.cpf = true;
      setErrors(newErrors);
      setMessageError("O CPF deve seguir o formato 000.000.000-00.");
      return false;
    }

    if (!phone.trim()) {
      newErrors.phone = true;
      setErrors(newErrors);
      setMessageError("O número de telefone é obrigatório.");
      return false;
    }

    if (phone.length < 14) {
      newErrors.phone = true;
      setErrors(newErrors);
      setMessageError("Informe um telefone válido.");
      return false;
    }

    if (!address.trim()) {
      newErrors.address = true;
      setErrors(newErrors);
      setMessageError("O endereço é obrigatório.");
      return false;
    }

    if (!email.trim()) {
      newErrors.email = true;
      setErrors(newErrors);
      setMessageError("O e-mail é obrigatório.");
      return false;
    }

    if (!emailRegex.test(email.trim())) {
      newErrors.email = true;
      setErrors(newErrors);
      setMessageError("Formato de e-mail inválido. Exemplo: example@gmail.com");
      return false;
    }

    if (!password.trim()) {
      newErrors.password = true;
      setErrors(newErrors);
      setMessageError("A senha é obrigatória.");
      return false;
    }

    if (password.length < 8 || password.length > 20) {
      newErrors.password = true;
      setErrors(newErrors);
      setMessageError("A senha deve ter entre 8 e 20 caracteres.");
      return false;
    }

    if (!passwordRegex.test(password)) {
      newErrors.password = true;
      setErrors(newErrors);
      setMessageError("A senha deve conter pelo menos uma letra e um número.");
      return false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = true;
      setErrors(newErrors);
      setMessageError("As senhas não conferem.");
      return false;
    }

    setErrors(newErrors);
    setMessageError("");
    return true;
  };

  const saveDataResponsibleData = async () => {
    try {
      const emailTrim = email.trim().toLowerCase();

      const responsibleData = {
        name,
        birthDate,
        cpf,
        phone,
        address,
        email: emailTrim,
        password,
      };

      await AsyncStorage.setItem(
        "@petguardian:responsibleData", 
        JSON.stringify(responsibleData)
      );
    } catch (error) {
      setMessageError("Ocorreu um erro ao salvar os dados. Tente novamente.");
    }
  }

  const handleFormSubmit = async () => {
  const isValid = validateForm();

  if (!isValid) return;

  await saveDataResponsibleData();

  navigation.navigate("PetRegisterScreen");
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
        textTitle={`Insira seus dados\npara continuar:`}
        textSubTitle="Campos marcados com * são obrigatórios."
        fontSizeSubTitle={15}
      />

      <ContainerForm>
        <InputForm
          label="Nome completo *"
          placeholder="Digite seu nome completo"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />

        <InputForm
          label="Data de nascimento *"
          placeholder="dd/mm/aaaa"
          value={birthDate}
          onChangeText={handleBirthDateChange}
          icon={
            <FontAwesome
              name="calendar-o"
              size={24}
              color={COLORS.orange[900]}
            />
          }
          error={errors.birthDate}
        />

        <InputForm
          label="CPF *"
          placeholder="000.000.000-00"
          value={cpf}
          onChangeText={handleCpfChange}
          error={errors.cpf}
        />

        <InputForm
          label="Telefone *"
          placeholder="(11) 12345-6789"
          keyboardType="number-pad"
          value={phone}
          onChangeText={handlePhoneChange}
          error={errors.phone}
        />

        <InputForm
          label="Endereço *"
          placeholder="Ex: Rua dos Animais, 123, São Paulo - SP"
          value={address}
          onChangeText={setAddress}
          error={errors.address}
        />

        <InputForm
          label="E-mail *"
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />

        <InputForm
          label="Crie uma senha *"
          placeholder="Crie sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
        />

        <InputForm
          label="Confirme sua senha *"
          placeholder="Repita a senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          marginBottom={10}
          secureTextEntry
          error={errors.confirmPassword}
        />

        <TextLink
          route={"LoginScreen"}
          textLink="Já tem uma conta? Clique aqui."
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
                name="arrow-right"
                size={26}
                color={COLORS.white[300]}
              />
            }
          >
            Continuar
          </ButtonFormLink>
        </View>
      </ContainerForm>
    </View>
  );
}
