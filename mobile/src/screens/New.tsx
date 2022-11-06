import { useState } from "react";
import { Heading, Text, useToast, VStack } from "native-base";

import { api } from "../services/api";
import Logo from "../assets/logo.svg";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Header } from "../components/Header";

export function New() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  async function handlePoolCreate() {
    if (!title.trim()) {
      return toast.show({
        placement: "top",
        bgColor: "red.500",
        title: "Informe um nome para o seu bolão.",
      });
    }

    try {
      setIsLoading(true);

      await api.post("/pools", {
        title,
      });

      toast.show({
        placement: "top",
        bgColor: "green.500",
        title: "Bolão criado com sucesso.",
      });

      setTitle("");
    } catch (error) {
      console.log(error);

      toast.show({
        placement: "top",
        bgColor: "red.500",
        title: "Não foi possível criar o bolão.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading
          my={8}
          color="white"
          fontSize="xl"
          textAlign="center"
          fontFamily="heading"
        >
          Crie seu próprio bolão da copa {"\n"} e compartilhe entre amigos!
        </Heading>

        <Input
          mb={2}
          value={title}
          onChangeText={setTitle}
          placeholder="Qual nome do seu bolão?"
        />

        <Button
          isLoading={isLoading}
          title="Criar meu bolão"
          onPress={handlePoolCreate}
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          Após criar seu bolão você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
}
