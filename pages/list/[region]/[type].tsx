import ListCard from '@/components/list/ListCard';
import CommonNav from '@/components/list/ListNav';
import Head from 'next/head';
import { Row } from 'react-bootstrap';
import React, { useCallback } from 'react';
import { regionNames, typesNames } from '@/data/region';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { fetchList } from '@/pages/api/list';
import { useRouter } from 'next/router';
import { GetStaticPropsContext } from 'next';
import { useSearchParams } from 'next/navigation';
import PaginatedItems from '@/components/common/PaginatedItems';
import { useList } from '@/usequery/useList';
import ListCardPlaceholder from '@/components/list/ListCardPlaceholder';

export default function Type() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page'));

  const router = useRouter();
  const { region, type } = router.query as {
    region: string;
    type: string;
  };

  const { data: list, isLoading: listLoading } = useList(region, type, page);

  const createQueryString = useCallback(
    (name: string, value: string | number) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value.toString());

      return params.toString();
    },
    [searchParams],
  );

  const handlePageChange = (pageNumber: number) => {
    router.push('?' + createQueryString('page', pageNumber));
  };

  return (
    <>
      <Head>
        <title>{`${regionNames[region]} - ${typesNames[type]}`}</title>
      </Head>

      <div className="fs-2 mt-5 fw-bold">{`${regionNames[region]} | ${typesNames[type]}`}</div>

      <CommonNav region={region} type={type} margin="mt-5" />

      {listLoading ? (
        <Row xs={1} sm={2} md={2} lg={3} className="mt-2">
          {Array.from({ length: 6 }).map((_, i) => {
            return <ListCardPlaceholder key={i} />;
          })}
        </Row>
      ) : (
        <Row xs={1} sm={2} md={2} lg={3} className="mt-2">
          {list?.data.map((data) => {
            return <ListCard key={data._id} data={data} region={region} />;
          })}
        </Row>
      )}

      <PaginatedItems
        page={page}
        total={list?.total}
        handlePageChange={handlePageChange}
      />
    </>
  );
}

export const getStaticPaths = async () => {
  const regionKeys = Object.keys(regionNames);
  const typeKeys = Object.keys(typesNames);
  const paths: Array<{
    params: { region: string; type: string; page: string };
  }> = [];

  regionKeys.forEach((region) => {
    typeKeys.forEach((type) => {
      paths.push({ params: { region, type, page: '1' } });
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const queryClient = new QueryClient();

  const { region, type } = context.params as { region: string; type: string };

  await queryClient.prefetchQuery(['fetchList', region, type], () =>
    fetchList(region, type),
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
