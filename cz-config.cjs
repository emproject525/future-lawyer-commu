module.exports = {
  types: [
    { value: '🏗️ WIP', name: '🏗️  WIP:\t진행중인 작업' },
    { value: '✨ Feat', name: '✨ Feat:\t새로운 기능을 추가' },
    { value: '🐛 Modify', name: '🐛 Fix:\t프로그램의 기능/UI/UX 수정' },
    { value: '📝 Docs', name: '📝 Docs:\t문서/설명/주석 추가 또는 업데이트' },
    {
      value: '💄 Style',
      name: '💄 Style:\t스타일 코드 또는 업데이트 (버그를 수정하거나 기능을 추가하지 않는 코드 변경)',
    },
    {
      value: '🤖 Refactor',
      name: '🤖 Refactor:\t버그를 수정하거나 기능을 추가하지 않는 코드 변경',
    },
    {
      value: '✅ Test',
      name: '✅ Test:\t테스트 케이스와 관련된 코드변경',
    },
    {
      value: '🚚 Chore',
      name: '🚚 Chore:\t빌드 프로세스 또는 문서 생성과 같은\n\t\t보조 도구 및 라이브러리 변경',
    },
  ],
  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['body'],
  subjectLimit: 100,
};
