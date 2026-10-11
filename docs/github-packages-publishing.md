# 한결 core — GitHub Packages 배포 준비

이 문서는 **배포 전 준비 조건**입니다. 패키지 이름·공개 범위·라이선스·publish guard를 변경하거나 실제 publish를 실행하지 않습니다. 소비자용 설치·명령어 안내는 Docs의 시작하기 페이지에 있습니다.

## 현재 코드에서 확인한 상태

- 배포 대상은 `packages/core` 한 개입니다. `apps/docs`나 저장소 루트는 npm 배포 대상이 아닙니다.
- 현재 이름은 `hangyeol-core`, 버전은 `0.1.0-s2.1`, 실행 파일 이름은 `hangyeol`입니다.
- core의 `private: true`와 `prepublishOnly`의 `publish-guard.mjs`가 publication을 막습니다. npm은 private:true인 패키지를 publish하지 않습니다.[5]
- 현재 라이선스 메타데이터는 `UNLICENSED`입니다. 공개 여부와 외부 사용 허용 조건은 별도로 결정해야 합니다. 외부 사용을 허용하는 라이선스를 임의로 추가하지 않습니다.
- 현재 설치 경로는 실제 로컬 `.tgz` → consumer의 exact devDependency → local CLI → init/add입니다. GitHub 레지스트리에서 배포된 scoped 패키지의 설치 증명은 아닙니다.

## 1. 소유 계정과 scoped 이름 결정

GitHub Packages의 npm 레지스트리는 소문자 scoped 패키지만 지원합니다. 현재 계정으로 배포한다면 **`@orderthan31/hangyeol-core`**를 제안합니다. 조직 계정을 사용한다면 그 조직의 실제 scope와 게시 권한을 먼저 확정합니다.[1]

CLI 이름은 계속 `hangyeol`로 유지할 수 있습니다. npm 패키지의 scope와 실행 파일 이름은 별개입니다.

**package.json의 name만 바꾸면 부족합니다.** 현재 다음 경계가 unscoped 이름을 사용하므로 같은 작업으로 이관·검증해야 합니다.

- `packages/core/src/tools/common.mjs`: 패키지·payload·tool manifest 이름 일치 검사
- `scripts/build-slice-payload.mjs`, `packages/core/build.mjs`: 생성 manifest와 tool identity
- `packages/core/src/doctor.mjs`: 실제 node_modules 위치, exact devDependency와 lock identity
- `scripts/generate-slice-docs.mjs`, `apps/docs/package.json`: installed package lookup과 정확한 core pin
- 소비자 `hangyeol.json`, lockfile, packed install fixtures 및 기존 사용자 이관 안내

scope 변경 후에도 이전 패키지 설치본의 편집 파일·설치 기록을 조용히 덮어쓰면 안 됩니다. 현재는 자동 update/migration 명령을 제공하지 않습니다.

## 2. 게시 금지 설정과 사용 조건 검토

- 실제 배포 승인을 받은 다음에 **core 패키지만** private:false로 변경하거나 private 필드를 제거합니다. 루트와 Docs의 private 설정은 유지합니다.[5]
- `publish-guard.mjs`는 승인된 릴리스 경로를 허용하도록 별도로 변경해야 합니다. `--ignore-scripts`로 publication guard를 우회하지 않습니다.
- 외부 사용 조건과 THIRD_PARTY_NOTICES, Pretendard·의존성 라이선스를 검토합니다. `UNLICENSED`라는 현재 상태를 MIT 등으로 자동 치환하지 않습니다.
- `private:false`는 npm의 게시 금지 해제입니다. GitHub 패키지가 public인지 private인지는 별도 visibility 설정입니다.[1][5]

## 3. 레지스트리와 저장소 연결

아래는 **승인 후 core package.json에서 추가·수정할 필드의 제안**입니다. 전체 package.json을 이 조각으로 교체하지 않습니다. version, bin, engines, files, 의존성과 release gate도 함께 유지·검토합니다. GitHub는 repository 필드로 연결을 제공하고 publishConfig로 게시 레지스트리를 지정할 수 있습니다.[1]

```json
{
  "name": "@orderthan31/hangyeol-core",
  "private": false,
  "repository": {
    "type": "git",
    "url": "https://github.com/orderthan31/hangyeol-design.git",
    "directory": "packages/core"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

credentials를 package.json, 저장소, 문서, 로그에 넣지 않습니다. 이번 준비에서 실제 .npmrc나 인증 설정은 변경하지 않습니다.

## 4. GitHub Actions 게시 권한과 인증

권장 경로는 저장소의 GitHub Actions가 제공하는 `GITHUB_TOKEN`입니다. 연결된 저장소 패키지에 대한 권한을 확인하고, 게시 job의 최소 권한을 다음과 같이 선언합니다.[1][2]

```yaml
permissions:
  contents: read
  packages: write
```

- 공식 setup-node의 registry-url을 GitHub npm 레지스트리로 설정하고, publish step의 NODE_AUTH_TOKEN에 secrets.GITHUB_TOKEN을 연결합니다.[2]
- 수동 workflow_dispatch 또는 승인된 release trigger, 필요한 경우 environment approval을 둡니다. 이 문서는 실제 workflow를 활성화하지 않습니다.
- 첫 배포 또는 기존 패키지 재사용 시 repository 연결·Actions access를 확인합니다. 연결만으로 모든 다른 저장소가 접근하는 것은 아닙니다.[1][3]
- 기존 Git push용 GitHub App helper를 패키지 게시 인증으로 자동 간주하지 않습니다. source push와 npm registry 인증은 별도 경계입니다. 현재 Git 인증을 PAT로 전환하지 않습니다.
- 로컬 npm 인증이 필요하다면 공식 경로는 PAT classic입니다. 설치에는 최소 read:packages, 게시에는 write:packages와 해당 패키지의 게시 권한이 필요합니다. fine-grained PAT로 대체된다고 가정하지 않습니다.[1][3]

## 5. public/private와 소비자 설치 인증

처음 게시한 npm 패키지의 기본 visibility는 private입니다. 공개하려면 GitHub 패키지 설정에서 public으로 변경하는 절차와 권한을 따로 확인합니다. 저장소가 public인 것만으로 패키지까지 public이라고 간주하지 않습니다.[1]

**GitHub Packages의 공개 npm 패키지도 install 인증이 필요합니다.** 소비자에게 실제 scoped 이름·게시 버전·scope routing과 read 인증 방법을 안내해야 합니다. Docker/container 레지스트리의 익명 접근 규칙과 혼동하지 않습니다.[1][3]

소비자 안내는 실제 게시·설치 검증 후 변경합니다. 현재 시작하기 페이지에 존재하지 않는 registry 버전을 성공한 설치 명령으로 표시하지 않습니다.

## 6. 릴리스 전에 실제 실행할 검증

- scoped 이름으로 전체 build/pack을 수행하고 새 manifest·tool hash·설치 메타데이터를 검증합니다.
- tarball에는 bin/dist/payload/README/license 경계만 담고 credentials·.npmrc·cache·환경 파일·내부 실행 기록을 제외합니다. GitHub npm tarball의 크기 제한도 확인합니다.[1]
- 해당 tarball로 독립 consumer에서 init/add → local import → tsc/Vite build → doctor/lint/tokens를 실행합니다.
- 게시 승인 후에는 **GitHub Packages의 실제 scoped 이름과 exact version**으로 새 consumer에서 다시 설치해 bin, lock SRI, ownership records, 선택 컴포넌트 의존성까지 확인합니다. 로컬 tarball 성공은 scoped registry 인증·설치 성공을 대신하지 않습니다.
- 현재 root lint와 전체 설치본의 기존 진단은 그대로 보존하고 release baseline/허용 기준을 명시합니다. warning/diagnostic을 숨겨 green으로 만들지 않습니다.
- browser/E2E/AT/visual acceptance는 별도 단계이며, 현재 source/build 검증과 섞지 않습니다.

## 문서 명령어의 확인 범위

시작하기 페이지의 npm exec --no 형식은 설치된 local bin을 사용하고 자동 다운로드를 거부하도록 안내합니다.[4] 실제 현재 tarball과 새 격리 npm cache·공개 npm 의존성을 사용한 독립 소비자에서 기본 init/add, 읽기 전용 관리 명령, token export 및 페이지의 App 예제를 tsc/Vite로 실행했습니다. 이 검증은 현재 unscoped local archive의 소비 경로를 확인하며 GitHub Packages 게시 완료를 뜻하지 않습니다.

## Sources

[1] https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
[2] https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages
[3] https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages
[4] https://docs.npmjs.com/cli/v10/commands/npm-exec
[5] https://docs.npmjs.com/cli/v10/configuring-npm/package-json
