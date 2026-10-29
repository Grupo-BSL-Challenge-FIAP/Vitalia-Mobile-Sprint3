import { ActivityIndicator, View, } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeLoginCadastroScreen from "../screens/HomeLoginCadastroScreen";
import LoginScreen from "../screens/LoginScreen";
import PetRegisterScreen from "../screens/PetRegisterScreen";
import ResponsibleRegisterScreen from "../screens/ResponsibleRegisterScreen";
import AccountCreationConfirmationScreen from "../screens/AccountCreationConfirmationScreen";
import AuthenticationCodeScreen from "../screens/AuthenticationCodeScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import TabNavigator from "./TabNavigator";
import { useAuth } from "../contexts/AuthContext";
import PetsDetailScreen from "../screens/PetsDetailScreen";
import AccountUserScreen from "../screens/AccountUserScreen";

export type RootStackParamList = {
  HomeLoginCadastroScreen: undefined;
  LoginScreen: undefined;
  ResponsibleRegisterScreen: undefined;
  PetRegisterScreen: undefined;
  AccountCreationConfirmationScreen: undefined;
  AuthenticationCodeScreen: undefined;
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: undefined;
  TabsDashboardResponsible: undefined;
  TabsPet: undefined;
  TabsNotification: undefined;
  TabsProfileScreen: undefined;
  PageUnderDevelopmentScreen: undefined;
  Início: undefined;
  Pets: undefined;
  Notificações: undefined;
  Perfil: undefined;
  PetDetailScreen: { petId: number; };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const {
    isAuthenticated,
    isLoadingSession,
  } = useAuth();

  if (isLoadingSession) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={
        isAuthenticated
          ? "TabsDashboardResponsible"
          : "HomeLoginCadastroScreen"
      }
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="TabsDashboardResponsible"
            component={TabNavigator}
          />

          <Stack.Screen
            name="TabsPet"
            component={TabNavigator}
          />

          <Stack.Screen
            name="TabsNotification"
            component={TabNavigator}
          />

          <Stack.Screen
            name="PetDetailScreen"
            component={PetsDetailScreen}
          />

          <Stack.Screen
            name="PetRegisterScreen"
            component={PetRegisterScreen}
          />

          <Stack.Screen
            name="TabsProfileScreen"
            component={AccountUserScreen}
          />

          <Stack.Screen
            name="PageUnderDevelopmentScreen"
            component={TabNavigator}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="HomeLoginCadastroScreen"
            component={HomeLoginCadastroScreen}
          />

          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
          />

          <Stack.Screen
            name="ResponsibleRegisterScreen"
            component={ResponsibleRegisterScreen}
          />

          <Stack.Screen
            name="PetRegisterScreen"
            component={PetRegisterScreen}
          />

          <Stack.Screen
            name="AccountCreationConfirmationScreen"
            component={
              AccountCreationConfirmationScreen
            }
          />

          <Stack.Screen
            name="AuthenticationCodeScreen"
            component={AuthenticationCodeScreen}
          />

          <Stack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
          />

          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}