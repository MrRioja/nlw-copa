import { useCallback, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { Icon, useToast, VStack, FlatList } from "native-base";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { api } from "../services/api";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { PoolCard, PoolCardPros } from "../components/PoolCard";

export function Pools() {
  const toast = useToast();
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [pools, setPools] = useState<PoolCardPros[]>([]);

  async function fetchPools() {
    try {
      setIsLoading(true);

      const response = await api.get("/pools");

      setPools(response.data.pools);
    } catch (error) {
      console.log(error);
      toast.show({
        placement: "top",
        bgColor: "red.500",
        title: "Não foi possível carregar os bolões.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPools();
    }, [])
  );

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack
        mt={6}
        mx={5}
        pb={4}
        mb={4}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
      >
        <Button
          title="Buscar bolão por código"
          onPress={() => navigate("find")}
          leftIcon={
            <Icon as={Octicons} name="search" color={"black"} size="md" />
          }
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          px={5}
          data={pools}
          keyExtractor={(item) => item.id}
          _contentContainerStyle={{
            pb: 100,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => <EmptyPoolList />}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate("details", { id: item.id })}
            />
          )}
        />
      )}
    </VStack>
  );
}
