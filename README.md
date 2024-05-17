This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## vscode로 실행하기 위한 추가 작업

- sdks 설정

```
yarn dlx @yarnpkg/sdks vscode
```

- vscode 내에서 typescript version 변경

1. control + shift + P
2. [Typescript> Select TypeScripty Version...] 선택
3. [Use Workspace Version] 선택

- 잡다한 에러 발생 시

1. The remote archive doesn't match the expected checksum

```
yarn cache clean --all   (캐시 모두 제거)
yarn install
```

2. Deduplicate dependencies with overlapping ranges

```
yarn dedupe
yarn dedupe --strategy highest
yarn dedupe '@babel/\*'
```

- 전체 버전 업그레이드

```
yarn plugin import interactive-tools
yarn upgrade-interactive
```

- 프로젝트가 사용하는 패키지 버전 확인

```
yarn why webpack
```

- 주기적으로 browerslist update 확인

```
yarn up -R caniuse-lite
```

```
npx update-browserslist-db@latest
```
