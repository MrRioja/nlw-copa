import { useState } from "react";
import { Heading, useToast, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { api } from "../services/api";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Header } from "../components/Header";

export function Find() {
  const toast = useToast();
  const { navigate } = useNavigation();

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleJoinPool() {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        return toast.show({
          placement: "top",
          bgColor: "red.500",
          title: "Informe o código.",
        });
      }

      await api.post("/pools/join", { code });

      toast.show({
        placement: "top",
        bgColor: "green.500",
        title: "Você entrou no bolão com sucesso.",
      });

      setCode("");
      setIsLoading(false);

      navigate("pools");
    } catch (error) {
      console.log(error);

      setIsLoading(false);

      if (error.response.data.message === "Pool not found.") {
        return toast.show({
          placement: "top",
          bgColor: "red.500",
          title: "Bolão não encontrado.",
        });
      }

      if (error.response.data.message === "You already joined this pool.") {
        return toast.show({
          placement: "top",
          bgColor: "red.500",
          title: "Você já está nesse bolão.",
        });
      }

      toast.show({
        placement: "top",
        bgColor: "red.500",
        title: "Não foi possível encontrar o bolão.",
      });
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          mb={8}
          color="white"
          fontSize="xl"
          textAlign="center"
          fontFamily="heading"
        >
          Encontrar um bolão através de {"\n"} seu código único
        </Heading>

        <Input
          mb={2}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          placeholder="Qual o código do bolão?"
        />

        <Button
          title="Buscar bolão"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
