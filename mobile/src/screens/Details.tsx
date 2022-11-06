import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";

import { api } from "../services/api";
import { Header } from "../components/Header";
import { Option } from "../components/Option";
import { Loading } from "../components/Loading";
import { PoolCardPros } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Share } from "react-native";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(false);
  const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">(
    "guesses"
  );
  const [poolDetails, setPoolDetails] = useState<PoolCardPros>(
    {} as PoolCardPros
  );

  const toast = useToast();
  const route = useRoute();
  const { id } = route.params as RouteParams;

  async function handleCodeShare() {
    await Share.share({
      message: poolDetails.code,
    });
  }

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${id}`);

      setPoolDetails(response.data.pool);
    } catch (error) {
      console.log(error);

      toast.show({
        placement: "top",
        bgColor: "red.500",
        title: "Não foi possível carregar os detalhes do bolão.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        showBackButton
        showShareButton
        title={poolDetails.title}
        onShare={handleCodeShare}
      />

      {poolDetails._count?.participants > 0 ? (
        <VStack flex={1} px={5}>
          <PoolHeader data={poolDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === "guesses"}
              onPress={() => setOptionSelected("guesses")}
            />

            <Option
              title="Ranking"
              isSelected={optionSelected === "ranking"}
              onPress={() => setOptionSelected("ranking")}
            />
          </HStack>

          <Guesses poolId={poolDetails.id} code={poolDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  );
}
