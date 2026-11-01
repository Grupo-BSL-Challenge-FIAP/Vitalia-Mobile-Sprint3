import {createContext,ReactNode,useContext,useEffect,useState,} from "react";
import { ImageSourcePropType} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PET_IMAGES, USER_IMAGES } from "../data/petImages";

interface ImageContextType {
  getPetImage: (
    speciesId?: number | null,
    gender?: string,
    imageUrl?: string | null,
    petId?: number | null,
  ) => ImageSourcePropType;

  getUserImage: (
    gender?: string,
    imageUrl?: string | null,
    userId?: number | null,
  ) => ImageSourcePropType;

  saveUserImage: (
    userId: number,
    imageUrl: string,
  ) => Promise<void>;

  savePetImage: (
    petId: number,
    imageUrl: string,
  ) => Promise<void>;
}

interface ImageProviderProps {
  children: ReactNode;
}

const ImageContext = createContext<ImageContextType>( {} as ImageContextType,);

export function ImageProvider({
  children,
}: ImageProviderProps) {
  const [userImages, setUserImages] = useState<Record<string, string>>({});
  const [petImages, setPetImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadUserImages = async () => {
      const storedImages = await AsyncStorage.getItem("user-images");

      if (storedImages) {
        setUserImages(JSON.parse(storedImages));
      }

      const storedPetImages = await AsyncStorage.getItem("pet-images");

      if (storedPetImages) {
        setPetImages(JSON.parse(storedPetImages));
      }
    };

    loadUserImages();
  }, []);

  const saveUserImage = async (
    userId: number,
    imageUrl: string,
  ) => {
    const updatedImages = {
      ...userImages,
      [userId]: imageUrl,
    };

    setUserImages(updatedImages);

    await AsyncStorage.setItem(
      "user-images",
      JSON.stringify(updatedImages),
    );
  };

  const savePetImage = async (
    petId: number,
    imageUrl: string,
  ) => {
    const updatedImages = {
      ...petImages,
      [petId]: imageUrl,
    };

    setPetImages(updatedImages);

    await AsyncStorage.setItem(
      "pet-images",
      JSON.stringify(updatedImages),
    );
  };

  const getPetImage = (
    speciesId?: number | null,
    gender?: string,
    imageUrl?: string | null,
    petId?: number | null,
  ): ImageSourcePropType => {
    if (imageUrl) {
      return {
        uri: imageUrl,
      };
    }

    if (petId && petImages[petId]) {
      return {
        uri: petImages[petId],
      };
    }

    const normalizedGender =
      gender?.trim().toLowerCase();

    if (speciesId === 1) {
      return normalizedGender === "fêmea"
        ? PET_IMAGES.dog.female
        : PET_IMAGES.dog.male;
    }

    if (speciesId === 2) {
      return normalizedGender === "fêmea"
        ? PET_IMAGES.cat.female
        : PET_IMAGES.cat.male;
    }

    if (speciesId === 3) {
      return PET_IMAGES.bird;
    }

    if (speciesId === 4) {
      return PET_IMAGES.rabbit;
    }

    if (speciesId === 5) {
      return PET_IMAGES.hamster;
    }

    return PET_IMAGES.dog.male;
  };

  const getUserImage = (
    gender?: string,
    imageUrl?: string | null,
    userId?: number | null,
  ): ImageSourcePropType => {
    if (imageUrl) {
      return {
        uri: imageUrl,
      };
    }

    if (userId && userImages[userId]) {
      return {
        uri: userImages[userId],
      };
    }

    const normalizedGender =
      gender?.trim().toLowerCase();

    if (
      normalizedGender === "feminino" ||
      normalizedGender === "fêmea"
    ) {
      return USER_IMAGES.female;
    }

    return USER_IMAGES.male;
  };

  return (
    <ImageContext.Provider
      value={{
        getPetImage,
        getUserImage,
        saveUserImage,
        savePetImage,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}

export function useImages() {
  return useContext(ImageContext);
}