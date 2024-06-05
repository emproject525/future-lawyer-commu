import { cache } from 'react';
import dynamic from 'next/dynamic';
import AuthWrapper from '@/ui/auth/AuthWrapper';
import { PageData } from '../page';

const ContentsAdd = dynamic(() => import('@/ui/contentsAdd'), {
  ssr: false,
});

type PageProps = {
  params: { seq: number };
  searchParams: { [key: string]: string | string[] | undefined };
};

// 페이지 데이터 조회
const getData = cache(async (params: { seq: number }): Promise<PageData> => {
  'use server';

  const { seq } = params;

  // Fetch data from external API
  const response = await fetch(`http://localhost:3000/api/contents/${seq}`, {
    cache: 'no-store',
  });
  const data: Pick<PageData, 'header' | 'body'> = await response.json();

  return {
    status: response.status,
    header: data.header,
    body: data.body,
  };
});

/**
 * 게시글 수정
 * - `TODO` 본인 게시글이 아니면 나가는 처리 필요
 */
export default async function Page({ params }: Pick<PageProps, 'params'>) {
  const { status, header, body } = await getData(params);

  return (
    <main
      style={{
        height: 'calc(100vh - 65px)',
      }}
    >
      {status === 200 && header.success && (
        <AuthWrapper userSeq={body?.userSeq}>
          <ContentsAdd
            editMode
            orgTitle={body?.title}
            orgBody={body?.body}
            orgCategorySeq={body?.categorySeq}
          />
        </AuthWrapper>
      )}
    </main>
  );
}
