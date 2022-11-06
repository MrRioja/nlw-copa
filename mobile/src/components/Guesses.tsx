import { Share } from "react-native";
import { useEffect, useState } from "react";
import { Box, useToast, FlatList } from "native-base";

import { Loading } from "./Loading";
import { api } from "../services/api";
import { Game, GameProps } from "./Game";
import { EmptyMyPoolList } from "./EmptyMyPoolList";

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");

  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${poolId}/games`);

      setGames(response.data.games);
    } catch (error) {
      console.log();

      toast.show({
        placement: "top",
        bgColor: "red.500",
        title: "Não foi possível carregar os jogos.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          placement: "top",
          bgColor: "red.500",
          title: "Informe o placar do palpite.",
        });
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        placement: "top",
        bgColor: "green.500",
        title: "Seu palpite foi realizado com sucesso.",
      });

      fetchGames();
    } catch (error) {
      console.log(error);

      toast.show({
        placement: "top",
        bgColor: "red.500",
        title: "Não foi possível enviar o palpite.",
      });
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
      renderItem={({ item }) => (
        <Game
          data={item}
          onGuessConfirm={() => {
            handleGuessConfirm(item.id);
          }}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
        />
      )}
    />
  );
}
