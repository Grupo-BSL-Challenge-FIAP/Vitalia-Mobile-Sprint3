import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { authService } from "../services/authService";
import { petService } from "../services/petService";
import { queryClient } from "../api/queryClient";

interface CreateAccountData {
  responsible: {
    name: string;
    email: string;
    password: string;
    phone: string;
    cpf: string;
    birthDate: string;
    address: string;
  };

  pet: {
    name: string;
    gender: string;
    birthDate: string;
    weight: string;
    breedId: number;
  };
}

function convertDateToApi(date: string) {
  const [day, month, year] = date.split("/");

  return `${year}-${month}-${day}`;
}

export function useCreateAccount() {
  return useMutation({
    mutationFn: async ({
      responsible,
      pet,
    }: CreateAccountData) => {
      await authService.register({
        fullName: responsible.name,
        email: responsible.email,
        password: responsible.password,
        phoneNumber: responsible.phone,
        cpf: responsible.cpf,
        dateOfBirth: convertDateToApi(
          responsible.birthDate,
        ),
        address: responsible.address,
      });

      await authService.login({
        email: responsible.email,
        password: responsible.password,
      });

      const createdPet = await petService.create({
        name: pet.name,
        sex: pet.gender,
        birthDate: convertDateToApi(
          pet.birthDate,
        ),
        weightKg: Number(pet.weight),
        status: "NORMAL",
        breedId: pet.breedId,
      });

      await AsyncStorage.setItem(
        "@petguardian:activePetId",
        String(createdPet.id),
      );

      return createdPet;
    },

    onSuccess: async () => {
      await AsyncStorage.removeItem(
        "@petguardian:responsibleData",
      );

      await AsyncStorage.removeItem(
        "@petguardian:petsData",
      );

      await queryClient.invalidateQueries({
        queryKey: ["my-pets"],
      });
    },
  });
}