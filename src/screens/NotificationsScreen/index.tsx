import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LayoutWrapper from "../../components/LayoutWrapper";
import Header from "../../components/Header";
import { COLORS, FONTS } from "../../styles/styles";
import { AlertResponse } from "../../services/alertService";
import { useAlerts } from "../../hooks/useAlerts";

type NotificationCardProps = {
  alert: AlertResponse;
};

function NotificationCard({ alert }: NotificationCardProps) {
  const getAlertStyle = () => {
    const severity = alert.severity;

    if (severity === "HIGH") {
      return {
        icon: "alert-circle-outline" as const,
        iconColor: COLORS.red[600],
        backgroundColor: COLORS.red[300],
      };
    }

    if (severity === "MEDIUM") {
      return {
        icon: "alert-outline" as const,
        iconColor: COLORS.orange[900],
        backgroundColor: COLORS.orange[100],
      };
    }

    return {
      icon: "bell-outline" as const,
      iconColor: COLORS.orange[900],
      backgroundColor: COLORS.orange[100],
    };
  };

  const alertStyle = getAlertStyle();

  const title = alert.alertType || "Alerta Vitalia";

  const description =
    alert.message || "Um novo alerta foi identificado para o seu pet.";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={{
        width: "100%",
        minHeight: 125,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderColor: COLORS.orange[900],
        borderRadius: 12,
        backgroundColor: COLORS.white[100],
        paddingHorizontal: 18,
        paddingVertical: 16,
        marginBottom: 20,
      }}
    >
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14,
          backgroundColor: alertStyle.backgroundColor,
        }}
      >
        <MaterialCommunityIcons
          name={alertStyle.icon}
          size={36}
          color={alertStyle.iconColor}
        />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.inter[700],
            fontSize: 18,
            lineHeight: 22,
            color: COLORS.orange[900],
            marginBottom: 8,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            fontFamily: FONTS.inter[400],
            fontSize: 16,
            lineHeight: 22,
            color: COLORS.orange[900],
          }}
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const {
    data: alerts = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useAlerts();

  return (
    <LayoutWrapper paddingHorizontal={-1} paddingBottom={80}>
      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        <Header textHeader="Notificações" isBackBottom={false} />

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isFetching}
          onPress={() => refetch()}
          style={{
            position: "absolute",
            top: 22,
            right: 18,
            zIndex: 10,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isFetching && !isLoading ? (
            <ActivityIndicator size="small" color={COLORS.white[100]} />
          ) : (
            <MaterialCommunityIcons
              name="format-list-checks"
              size={34}
              color={COLORS.white[100]}
            />
          )}
        </TouchableOpacity>

        {isLoading ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 30,
            }}
          >
            <ActivityIndicator size="large" color={COLORS.orange[900]} />

            <Text
              style={{
                marginTop: 12,
                fontFamily: FONTS.inter[500],
                fontSize: 15,
                color: COLORS.orange[900],
              }}
            >
              Carregando alertas...
            </Text>
          </View>
        ) : isError ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 30,
            }}
          >
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={48}
              color={COLORS.red[600]}
            />

            <Text
              style={{
                marginTop: 14,
                fontFamily: FONTS.inter[700],
                fontSize: 18,
                textAlign: "center",
                color: COLORS.orange[900],
              }}
            >
              Não foi possível carregar os alertas.
            </Text>

            <Text
              style={{
                marginTop: 6,
                fontFamily: FONTS.inter[400],
                fontSize: 14,
                lineHeight: 20,
                textAlign: "center",
                color: COLORS.orange[875],
              }}
            >
              Verifique sua conexão e tente novamente.
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => refetch()}
              style={{
                marginTop: 20,
                minWidth: 190,
                paddingHorizontal: 22,
                paddingVertical: 13,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.orange[900],
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.inter[700],
                  fontSize: 15,
                  color: COLORS.white[100],
                }}
              >
                Tentar novamente
              </Text>
            </TouchableOpacity>
          </View>
        ) : alerts.length === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 35,
            }}
          >
            <View
              style={{
                width: 85,
                height: 85,
                borderRadius: 43,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.orange[100],
              }}
            >
              <MaterialCommunityIcons
                name="bell-outline"
                size={45}
                color={COLORS.orange[900]}
              />
            </View>

            <Text
              style={{
                marginTop: 18,
                fontFamily: FONTS.inter[700],
                fontSize: 20,
                color: COLORS.orange[900],
                textAlign: "center",
              }}
            >
              Nenhum alerta
            </Text>

            <Text
              style={{
                marginTop: 8,
                fontFamily: FONTS.inter[400],
                fontSize: 15,
                lineHeight: 21,
                color: COLORS.orange[875],
                textAlign: "center",
              }}
            >
              Quando houver um alerta para o seu pet, ele aparecerá aqui.
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 14,
              paddingTop: 22,
              paddingBottom: 40,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.inter[600],
                fontSize: 19,
                color: COLORS.orange[900],
                marginLeft: 2,
                marginBottom: 12,
              }}
            >
              Alertas
            </Text>

            {alerts.map((alert) => (
              <NotificationCard key={alert.id} alert={alert} />
            ))}
          </ScrollView>
        )}
      </View>
    </LayoutWrapper>
  );
}
