import Link from 'next/link';
import { RxDividerVertical } from 'react-icons/rx';
import Button from '@/components/Button/Button';
import { IContentsTableRow, IPagingList, IRes, ICategory } from '@/types';
import ContensTable from '@/components/Table/ContentsTable';
import Pagination from '@/components/Table/Pagination';
import styles from '@/styles/contens.module.scss';
import FlexBox from '@/components/Box/FlexBox';
import Span from '@/components/Font/Span';
import AuthWrapper from '@/ui/auth/AuthWrapper';

// * generic 컴포넌트를 dynamic하게 import하는 방법
// const Table = dynamic(() => import('@/components/Table/Table'), {
//   ssr: false,
// }) as <T extends {}>(props: TableProps<T>) => JSX.Element;

type PageData = {
  contents: { status: number } & IRes<IPagingList<IContentsTableRow>>;
  category: { status: number } & IRes<IPagingList<ICategory>>;
};

// 모든 요청에서 호출된다.
async function getData({
  page,
  count,
}: {
  page: number;
  count?: number;
  main?: number;
}): Promise<PageData> {
  'use server';

  // Fetch data from external API
  const contentsResponse = await fetch(
    `http://localhost:3000/api/contents?page=${page}&count=${count}`,
    {
      cache: 'no-store',
    },
  );
  const contentsData: IRes<IPagingList<IContentsTableRow>> =
    await contentsResponse.json();

  // 카테고리 TODO
  const categoryResponse = await fetch(
    `http://localhost:3000/api/category?m=1`,
  );
  const categoryData: IRes<IPagingList<ICategory>> =
    await categoryResponse.json();

  // if (response.status !== 200) {
  //   // This will activate the closest `error.js` Error Boundary
  //   throw new Error('Failed to fetch data');
  // }

  // Pass data to the page via props
  return {
    contents: {
      status: contentsResponse.status,
      header: contentsData.header,
      body: contentsData.body,
    },
    category: {
      status: categoryResponse.status,
      header: categoryData.header,
      body: categoryData.body,
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { contents, category } = await getData({
    page: Number(searchParams?.['page'] ?? 1),
    count: 20,
  });

  return (
    <main>
      <FlexBox
        className="mb-3"
        style={{
          columnGap: '1em',
        }}
      >
        <h1 className={styles.title}>
          {category.body.list[0]?.mainName || ''}
        </h1>
        <RxDividerVertical />
        <ul className={styles.category}>
          {category.body.list.map(({ seq, main, sub, subName }) => (
            <li key={`${main}-${sub}`}>
              <Link href={`/contents/category/${seq}`}>
                {sub === 1 ? (
                  <strong>
                    <Span>{subName}</Span>
                  </strong>
                ) : (
                  <Span>{subName}</Span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </FlexBox>
      <div data-desc="list" className="mb-1">
        {contents.status === 200 && contents.header.success && (
          <ContensTable rowDatas={contents.body.list} />
        )}
      </div>
      <div
        style={{
          textAlign: 'right',
        }}
      >
        <AuthWrapper needLogin>
          <Link href="/contents/add">
            <Button>글 작성</Button>
          </Link>
        </AuthWrapper>
      </div>
      <Pagination
        page={Number(searchParams?.['page'] ?? 1)}
        totalCount={contents.body.count}
        count={20}
      />
    </main>
  );
}
