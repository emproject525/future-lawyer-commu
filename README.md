## future-lawyer-commu

- 익명 커뮤니티 front 서버 (포트 3000)
- [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) 으로 생성
- typescript 적용
- storybook 적용 중
- ~~nextjs + mui (https://mui.com/material-ui/integrations/nextjs/)~~
- nextjs + module scss
- Next.js 번들링툴 : [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

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
