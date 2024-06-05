import { cache } from 'react';
import { CgMenu } from 'react-icons/cg';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDelete } from 'react-icons/md';
import { IoShareSocialSharp } from 'react-icons/io5';
import { RxDividerVertical } from 'react-icons/rx';
import clsx from 'clsx';
import { Metadata, ResolvingMetadata } from 'next';
import { IContentsDetail, IRes } from '@/types';
import styles from '@/styles/contens.module.scss';
import Button from '@/components/Button/Button';
import Span from '@/components/Font/Span';
import Link from 'next/link';
import Hr from '@/components/Hr/Hr';
import FlexBox from '@/components/Box/FlexBox';
import CommendAdd from '@/ui/commentAdd';
import AuthWrapper from '@/ui/auth/AuthWrapper';

export type PageData = {
  status: number;
} & IRes<IContentsDetail, true>;

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

// 메타
export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const { status, header, body } = await getData(params);
  const title = body?.title || '';
  const url = `${process.env.NEXTAUTH_URL}/contents/${params.seq}`;

  // fetch data
  // const product = await fetch(`https://.../${id}`).then((res) => res.json());

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || [];

  return {
    title,
    openGraph: {
      title,
      description: title,
      url,
      // images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  };
}

/**
 * @see https://react-icons.github.io/react-icons/ icon library
 */
export default async function Page({ params }: Pick<PageProps, 'params'>) {
  const { status, header, body } = await getData(params);

  return (
    <main>
      {status === 200 && header.success && (
        <div data-desc="detail">
          <FlexBox
            className={clsx(styles.breadcrumb, 'mb-1')}
            data-desc="breadcrumb"
            style={{
              columnGap: 4,
            }}
          >
            <Span>{body?.mainName || ''}</Span>
            <RxDividerVertical />
            <Span>{body?.subName || ''}</Span>
          </FlexBox>
          <h1 className={styles.title}>{body?.title || ''}</h1>
          <FlexBox
            className={clsx('mt-1', styles.info)}
            style={{
              columnGap: 4,
            }}
          >
            <Span>{body?.regDt || ''}</Span>
            <RxDividerVertical />
            <Span>조회수</Span>
            <Span color="info">0</Span>
          </FlexBox>
          <Hr />
          <div
            data-desc="body"
            className={styles.contents_body}
            dangerouslySetInnerHTML={{
              __html: body?.body || '',
            }}
          />
          <Hr />
          <FlexBox
            row
            style={{
              columnGap: '0.5em',
            }}
            data-desc="operation"
          >
            <Link href="/contents">
              <Button flexContents variant="outlined">
                <CgMenu />
                목록
              </Button>
            </Link>
            <AuthWrapper needLogin>
              <Button flexContents variant="outlined">
                스크랩
              </Button>
            </AuthWrapper>
            <Button flexContents variant="outlined">
              <IoShareSocialSharp />
              공유
            </Button>
            <AuthWrapper userSeq={body?.userSeq}>
              <Link href={`/contents/${body?.seq}/edit`}>
                <Button flexContents variant="outlined" color="gray-200">
                  <CiEdit />
                  수정
                </Button>
              </Link>
            </AuthWrapper>
            <AuthWrapper userSeq={body?.userSeq}>
              <Button flexContents variant="outlined" color="gray-200">
                <MdOutlineDelete />
                삭제
              </Button>
            </AuthWrapper>
          </FlexBox>
          <Hr />
          <CommendAdd totalCommentCnt={body?.commentCnt || 0} />
        </div>
      )}
    </main>
  );
}
