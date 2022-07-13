import Head from 'next/head';
import { useMemo } from 'react';
import { NextPage } from 'next';
import { Button, Box } from '@chakra-ui/react';
import { useInfiniteQuery } from 'react-query';

import { api } from '../services/api';
import { Error } from '../components/Error';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { CardList } from '../components/CardList';

interface Image {
  id: string;
  ts: number;
  url: string;
  title: string;
  description: string;
}

interface Response {
  data: Image[];
  after: string;
}

const Home: NextPage = () => {
  // async function fetchPages({ pageParam = null }): Promise<Response> {
  //   const response = await api.get<Response>('/api/image', {
  //     params: {
  //       after: pageParam,
  //     },
  //   });

  //   return response.data;
  // }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    ({ pageParam = null }) =>
      api
        .get<Response>('/api/images', {
          params: { after: pageParam },
        })
        .then(res => res.data),
    {
      getNextPageParam: lastPage => lastPage.after,
    }
  );

  const formattedData = useMemo(() => {
    if (!data) return null;
    const { pages } = data;

    return pages.reduce((acc, page) => [...acc, ...page.data], []);
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return <Loading />;
  }

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Head>
        <title>Upload de Imagens | UpFi</title>
      </Head>

      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {hasNextPage && (
          <Button mt="2.5rem" bg="yellow.400" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
};

export default Home;
