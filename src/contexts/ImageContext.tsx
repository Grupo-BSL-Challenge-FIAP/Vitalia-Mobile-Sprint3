import {createContext,ReactNode,useContext,} from "react";
import { ImageSourcePropType} from "react-native";
import { PET_IMAGES, USER_IMAGES } from "../data/petImages";

interface ImageContextType {
  getPetImage: (
    speciesId?: number | null,
    gender?: string,
    imageUrl?: string | null,
  ) => ImageSourcePropType;

  getUserImage: (
    gender?: string,
    imageUrl?: string | null,
  ) => ImageSourcePropType;
}

interface ImageProviderProps {
  children: ReactNode;
}

const ImageContext = createContext<ImageContextType>( {} as ImageContextType,);

export function ImageProvider({
  children,
}: ImageProviderProps) {
  const getPetImage = (
    speciesId?: number | null,
    gender?: string,
    imageUrl?: string | null,
  ): ImageSourcePropType => {
    if (imageUrl) {
      return {
        uri: imageUrl,
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
  ): ImageSourcePropType => {
    if (imageUrl) {
      return {
        uri: imageUrl,
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
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}

export function useImages() {
  return useContext(ImageContext);
}