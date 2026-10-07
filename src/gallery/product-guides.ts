export type ComponentGuide = { summary:string; use:string; props:string; tips:string[] };

export const componentGuides:Record<string,ComponentGuide> = {
  "Chart": {
    "summary": "수치를 비교하거나 변화와 구성 비율을 보여주는 차트입니다.",
    "use": "항목 비교에는 막대, 흐름에는 선, 전체의 구성 비율에는 도넛을 사용합니다.",
    "props": "title과 data는 필수입니다. data는 label·value 배열입니다. type 기본값은 bar, showLegend 기본값은 true입니다. description에 데이터의 맥락과 주요 추세를 적으세요.",
    "tips": [
      "차트 아래 표와 툴팁에서 원본 수치를 확인할 수 있습니다. 긴 항목 이름은 범례와 표에 표시합니다.",
      "도넛은 음수가 없는 데이터에 사용하세요. 값이 모두 0이거나 음수가 있으면 안내와 원본 표를 표시합니다."
    ]
  },
  "GridList": {
    "summary": "카드나 항목을 여러 열로 배치하는 목록입니다.",
    "use": "상품, 파일, 프로젝트처럼 같은 형태의 항목을 훑어보는 화면에 사용합니다.",
    "props": "items·renderItem·getKey·label을 전달합니다. columns 기본값은 3이며 1~4열을 선택할 수 있습니다. empty로 빈 목록 안내를 바꿉니다.",
    "tips": [
      "getKey에는 항목별 고유하고 안정적인 값을 사용하세요. 항목의 버튼과 링크는 renderItem에서 구성합니다.",
      "좁은 공간에서는 열 수가 줄어듭니다. 읽는 순서에 맞춰 items를 정렬하세요."
    ]
  },
  "Highlight": {
    "summary": "텍스트에서 검색어와 일치하는 부분을 강조합니다.",
    "use": "검색 결과의 제목이나 설명에서 검색어를 빠르게 찾도록 도울 때 사용합니다.",
    "props": "text와 query를 전달합니다. caseSensitive 기본값은 false입니다.",
    "tips": [
      "query는 검색할 문자열입니다. 빈 문자열이면 원문을 그대로 표시합니다.",
      "강조 표시와 함께 검색 결과의 제목과 맥락을 읽을 수 있도록 원문을 유지하세요."
    ]
  },
  "Bubble": {
    "summary": "짧은 메시지나 부가 설명을 말풍선 형태로 표시합니다.",
    "use": "대화 내용이나 화면 안의 간단한 안내에 사용합니다.",
    "props": "children에 내용을 넣습니다. tone은 neutral 또는 info이며 기본 neutral, align은 start 또는 end이며 기본 start입니다. div 속성을 함께 전달할 수 있습니다.",
    "tips": [
      "중요한 오류나 작업 결과는 Alert 또는 Result로 안내하세요.",
      "대화 흐름에 맞춰 align을 선택하고, 메시지의 작성자와 시간을 필요한 위치에 함께 표시하세요."
    ]
  },
  "BottomCTA": {
    "summary": "화면 아래에 주요 작업 버튼을 모아 보여줍니다.",
    "use": "긴 신청서의 다음 단계나 확인·적용처럼 계속 보이는 동작이 필요한 화면에 사용합니다.",
    "props": "actions에 한 개 또는 두 개의 버튼 설정을 전달합니다. placement 기본값은 flow, safeArea 기본값은 true입니다. topAccessory와 bottomAccessory에 안내를 추가할 수 있습니다.",
    "tips": [
      "고정 배치는 BottomCTARegion의 cta에 placement=fixed인 BottomCTA를 넣어 사용하세요. 본문 아래에 버튼 높이만큼 공간을 확보합니다.",
      "버튼별 loading과 disabled로 상태를 표시하고, 실제 저장 결과는 별도 메시지로 안내하세요. 외부 폼 제출은 버튼의 form과 type을 연결합니다."
    ]
  },
  "Slider": {
    "summary": "정해진 범위 안에서 숫자를 연속적으로 조절합니다.",
    "use": "음량, 밝기, 비율처럼 값을 움직이며 조정하는 설정에 사용합니다.",
    "props": "label은 필수입니다. min 기본값은 0, max는 100, step은 1입니다. value/onValueChange로 값을 관리하거나 defaultValue로 시작 값을 지정합니다.",
    "tips": [
      "라벨이나 주변 설명에 단위를 적고 현재 수치를 함께 보여주세요. 방향키로 값을 조절할 수 있습니다.",
      "값은 범위와 step에 맞는 유한한 숫자여야 합니다. name으로 폼 제출 값을 연결하세요."
    ]
  },
  "Rating": {
    "summary": "1~5점 중 하나를 별점으로 선택합니다.",
    "use": "만족도나 사용 경험의 평가를 받을 때 사용합니다.",
    "props": "label은 필수입니다. defaultValue 기본값은 0이며 미선택을 뜻합니다. value/onValueChange·required·disabled를 사용할 수 있습니다. clearable 기본값은 false입니다.",
    "tips": [
      "Tab으로 선택 영역에 들어가 방향키로 점수를 이동합니다. clearable을 켜면 선택을 지우고 0으로 되돌릴 수 있습니다.",
      "필수 평가를 지운 뒤에는 다시 점수를 선택해야 합니다. 서로 다른 평가에는 다른 name을 사용하세요."
    ]
  },
  "ProgressStepper": {
    "summary": "여러 단계로 진행되는 작업의 현재 위치를 표시합니다.",
    "use": "가입, 신청, 결제처럼 순서가 있는 흐름에서 전체 단계와 진행 위치를 안내할 때 사용합니다.",
    "props": "steps와 currentStep은 필수입니다. currentStep은 0부터 시작하는 정수입니다. label 기본값은 진행 단계입니다.",
    "tips": [
      "현재 단계 이전은 완료, 현재 단계는 진행 중, 이후는 대기로 표시합니다. 단계 이동 버튼은 별도로 구성하세요.",
      "currentStep은 steps 배열 안의 인덱스여야 합니다. 최종 성공 결과는 Result 등으로 따로 안내하세요."
    ]
  },
  "Result": {
    "summary": "작업의 성공, 오류, 빈 결과 또는 안내를 제목과 설명으로 보여줍니다.",
    "use": "제출 후 결과 화면이나 사용자가 다음 행동을 선택해야 하는 상태에 사용합니다.",
    "props": "variant·heading·children을 전달합니다. variant는 success/error/empty/info입니다. headingLevel 기본값은 3입니다. actions에 버튼을 넣고 error에서는 guidance에 복구 방법을 적습니다.",
    "tips": [
      "오류에는 다시 시도하거나 이전 화면으로 돌아가는 방법을 안내하세요.",
      "제목 계층을 화면 구조에 맞추고 위험한 작업은 실행 전에 Confirm으로 확인하세요."
    ]
  },
  "SegmentedControl": {
    "summary": "서로 관련된 소수의 선택지 중 하나를 고릅니다.",
    "use": "목록 표시 방식이나 간단한 필터처럼 선택을 바로 비교할 수 있는 설정에 사용합니다.",
    "props": "label과 options는 필수입니다. 각 옵션에 고유한 value·label을 넣고 disabled를 지정할 수 있습니다. value/onValueChange 또는 defaultValue로 선택을 설정합니다.",
    "tips": [
      "Tab으로 그룹에 들어가 방향키와 Space로 선택합니다. required와 name을 사용해 폼에 연결할 수 있습니다.",
      "선택에 맞춰 화면 내용을 바꾸려면 onValueChange에서 앱의 상태를 갱신하세요."
    ]
  },
  "TextField": {
    "summary": "입력란에 라벨, 도움말, 오류와 앞뒤 보조 내용을 함께 제공합니다.",
    "use": "단위, 아이콘, 지우기 동작이 필요한 텍스트 입력에 사용합니다.",
    "props": "label은 필수입니다. clearable의 기본값은 false입니다. description·error·prefix·suffix·trailingAction과 input 속성을 전달합니다. value/onChange 또는 defaultValue로 값을 설정합니다.",
    "tips": [
      "입력에 필요한 단위를 description에도 설명하세요. 슬롯의 버튼에는 이름과 type=button을 지정합니다.",
      "clearable을 켜면 입력을 비우고 입력란으로 초점을 돌려줍니다. loading은 진행 중 안내이며 편집을 잠그려면 readOnly 또는 disabled를 함께 선택하세요."
    ]
  },
  "ListRow": {
    "summary": "제목, 설명, 보조 내용과 독립 동작을 한 목록 행에 배치합니다.",
    "use": "선택 체크박스나 오른쪽 메타데이터가 필요한 상세 목록에 사용합니다.",
    "props": "title은 필수입니다. leading·content·trailing·description으로 내용을 구성하고 selected/onSelectionChange로 선택을 관리합니다. disabled 기본값은 false입니다.",
    "tips": [
      "List 안에 넣어 사용하세요. 선택과 동작은 체크박스 및 action 버튼에서 수행합니다.",
      "슬롯에 넣은 버튼에도 이름과 비활성 상태를 지정하세요. 버튼 안에 버튼을 중첩하지 마세요."
    ]
  },
  "ListHeader": {
    "summary": "목록 위에 제목, 설명과 도구를 배치합니다.",
    "use": "목록 이름과 항목 추가 버튼, 검색 안내를 한곳에 보여줄 때 사용합니다.",
    "props": "title은 필수입니다. description·children·actions에 보조 내용과 동작을 넣습니다.",
    "tips": [
      "List의 ul 바깥, 목록 바로 위에 배치하세요.",
      "actions에는 구체적인 동작 이름을 가진 버튼을 넣으세요."
    ]
  },
  "ListFooter": {
    "summary": "목록 아래에 안내와 후속 동작을 배치합니다.",
    "use": "선택한 항목 수, 더 보기, 일괄 작업 등을 목록 뒤에 보여줄 때 사용합니다.",
    "props": "children에 안내를, actions에 버튼을 넣습니다.",
    "tips": [
      "List의 ul 바깥, 목록 바로 아래에 배치하세요.",
      "동작에 필요한 선택 상태와 결과 안내는 목록을 사용하는 화면에서 관리합니다."
    ]
  },
  "Button": {
    "summary": "사용자가 작업을 실행하거나 다음 행동을 선택하는 버튼입니다.",
    "use": "저장, 적용, 취소, 삭제처럼 명확한 동작에 사용합니다.",
    "props": "variant 기본값은 primary, size는 medium, loading은 false, type은 button입니다. variant에는 secondary/quiet/ghost/destructive도 사용할 수 있습니다. onClick과 button 속성을 전달합니다.",
    "tips": [
      "버튼 문구에는 저장, 삭제처럼 동작을 적으세요. 폼 제출에는 type=submit을 명시합니다.",
      "loading 중에는 클릭 실행을 막고 진행 상태를 표시합니다. 사용할 수 없는 동작은 disabled로 구분하세요."
    ]
  },
  "IconButton": {
    "summary": "텍스트 대신 아이콘을 표시하는 버튼입니다.",
    "use": "닫기, 펼치기처럼 의미가 분명하고 공간을 적게 쓰는 동작에 사용합니다.",
    "props": "label에 동작 이름을, children에 아이콘을 넣습니다. variant 기본값은 secondary, size는 medium, type은 button입니다. loading과 button 속성을 사용할 수 있습니다.",
    "tips": [
      "label은 닫기, 메뉴 열기처럼 실행할 동작을 설명해야 합니다.",
      "아이콘 자체의 크기는 children에서 정하고 size는 버튼 크기에 사용하세요.",
      "button 속성과 ref는 실제 버튼 요소에 전달됩니다."
    ]
  },
  "Input": {
    "summary": "한 줄의 텍스트나 값을 입력합니다.",
    "use": "간단한 입력을 화면의 라벨과 직접 조합할 때 사용합니다. 라벨과 오류까지 묶으려면 TextField를 선택하세요.",
    "props": "type·value·defaultValue·onChange·name·required 등 input 속성을 전달합니다. loading 기본값은 false, busyLabel은 입력 확인 중…입니다.",
    "tips": [
      "label의 htmlFor와 입력 id를 연결하세요. 입력 목적에 맞춰 type·autoComplete·inputMode를 지정합니다.",
      "loading 안내 중에도 입력은 편집할 수 있습니다. 편집을 제한할 때는 readOnly와 disabled의 차이를 고려하세요."
    ]
  },
  "Textarea": {
    "summary": "여러 줄의 텍스트를 입력합니다.",
    "use": "설명, 의견, 긴 메시지를 받을 때 사용합니다.",
    "props": "rows·value·defaultValue·onChange·name·required 등 textarea 속성을 전달합니다.",
    "tips": [
      "라벨과 id를 연결하고 입력 길이 제한이 있으면 maxLength와 안내 문구를 함께 제공하세요.",
      "내용을 읽고 편집할 수 있는 높이를 확보하세요."
    ]
  },
  "Select": {
    "summary": "정해진 목록에서 한 항목을 선택합니다.",
    "use": "선택지의 이름을 알고 있고 검색이 필요하지 않은 입력에 사용합니다.",
    "props": "children에 option을 넣고 value/onChange 또는 defaultValue로 선택을 설정합니다. name·required·disabled 등 select 속성을 전달합니다.",
    "tips": [
      "option의 value에는 저장할 값을, 내용에는 사용자가 읽을 이름을 넣으세요.",
      "선택지가 많아 검색이 필요하면 Combobox를 사용하세요."
    ]
  },
  "Checkbox": {
    "summary": "하나의 항목을 선택하거나 해제합니다.",
    "use": "동의, 복수 선택, 켜고 끌 수 있는 선택 항목에 사용합니다.",
    "props": "label은 필수입니다. checked/onChange 또는 defaultChecked로 선택을 설정합니다. mixed 기본값은 false입니다. name·value·required·disabled를 사용할 수 있습니다.",
    "tips": [
      "label 영역 전체를 눌러 선택할 수 있습니다. mixed는 일부만 선택된 상태를 나타내며 checked와 별도로 설정합니다.",
      "onChange의 checked 값을 사용해 앱의 선택 상태를 갱신하세요."
    ]
  },
  "FormField": {
    "summary": "입력 요소를 라벨, 필수 표시, 도움말과 오류로 감쌉니다.",
    "use": "기존 입력에 일관된 설명과 오류 연결을 추가할 때 사용합니다.",
    "props": "label은 필수입니다. description·error·required를 지정하고 children에 입력을 넣습니다. children을 생략하면 기본 Input을 표시합니다.",
    "tips": [
      "직접 넣은 입력의 value·onChange·disabled 등은 해당 입력에 설정하세요.",
      "오류 문구에는 문제가 무엇인지와 수정 방법을 함께 적으세요."
    ]
  },
  "PasswordInput": {
    "summary": "비밀번호 입력과 표시·숨김 버튼을 제공합니다.",
    "use": "로그인이나 비밀번호 설정 화면에 사용합니다.",
    "props": "label과 input 속성을 전달합니다. hint·error·required·disabled를 사용할 수 있습니다. value/onChange 또는 defaultValue로 값을 설정합니다.",
    "tips": [
      "표시 버튼의 이름과 눌림 상태로 현재 보기 방식을 안내합니다. readOnly에서는 보기 방식을 바꿀 수 있고 aria-busy가 true이면 전환을 막습니다.",
      "autoComplete를 입력 목적에 맞춰 current-password 또는 new-password로 지정하세요. 실제 비밀번호를 문서 예제에 입력하지 마세요."
    ]
  },
  "NumberInput": {
    "summary": "숫자를 입력하거나 증가·감소 버튼으로 조절합니다.",
    "use": "수량처럼 정확한 숫자와 변화 단위가 중요한 입력에 사용합니다.",
    "props": "label은 필수입니다. value는 숫자 또는 빈 문자열입니다. min·max·step을 설정하며 step 기본값은 1입니다. onValueChange로 확정 값을 받습니다.",
    "tips": [
      "허용 범위와 단위를 설명하세요. 범위나 단위에 맞지 않는 편집은 입력에 남고 오류를 안내합니다.",
      "확정 값과 편집 중인 문자열을 구분해 저장하세요."
    ]
  },
  "CurrencyInput": {
    "summary": "금액을 입력하고 천 단위로 읽기 쉽게 표시합니다.",
    "use": "원 단위처럼 0 이상의 정수 금액을 받는 화면에 사용합니다.",
    "props": "label과 value/defaultValue·onValueChange를 사용합니다. value에는 쉼표 없는 문자열을 전달합니다. required·error·hint를 지정할 수 있습니다.",
    "tips": [
      "입력을 마치면 한국어 천 단위 구분으로 표시합니다. 저장할 때는 표시 문자열이 아닌 value를 사용하세요.",
      "통화와 단위를 라벨이나 도움말에 적으세요. 유효 범위는 0 이상의 안전한 정수입니다."
    ]
  },
  "PhoneInput": {
    "summary": "전화번호를 입력하고 형식 오류를 안내합니다.",
    "use": "연락처를 받는 신청서나 계정 화면에 사용합니다.",
    "props": "label과 value/defaultValue·onValueChange를 사용합니다. required·error·hint·autoComplete를 지정할 수 있습니다.",
    "tips": [
      "입력을 마치면 지원하는 전화번호 형식을 확인합니다.",
      "번호 소유 확인이 필요하면 인증 단계를 별도로 구성하세요."
    ]
  },
  "EmailInput": {
    "summary": "이메일 주소를 입력하고 형식 오류를 안내합니다.",
    "use": "연락용 이메일이나 계정 주소를 받는 화면에 사용합니다.",
    "props": "label과 value/defaultValue·onValueChange를 사용합니다. required·error·hint·autoComplete를 지정할 수 있습니다.",
    "tips": [
      "오류는 입력을 마친 뒤 확인할 수 있습니다. autoComplete=email을 사용하면 입력을 돕습니다.",
      "주소 소유 확인이 필요하면 이메일 인증을 별도로 연결하세요."
    ]
  },
  "Combobox": {
    "summary": "검색으로 선택지를 좁힌 뒤 한 항목을 선택합니다.",
    "use": "긴 목록에서 이름을 찾아 선택해야 하는 입력에 사용합니다.",
    "props": "label과 options는 필수입니다. 각 옵션에 value·label·disabled를 설정합니다. value/onValueChange 또는 defaultValue로 선택을 관리합니다.",
    "tips": [
      "방향키로 이동하고 Enter로 선택합니다. Escape로 목록을 닫으며 한글 조합 중에는 선택 키 처리를 기다립니다.",
      "검색 중인 문자열과 확정 선택은 다릅니다. 저장에는 확정 value를 사용하세요."
    ]
  },
  "MultiSelect": {
    "summary": "여러 항목을 선택하고 선택 결과를 태그로 보여줍니다.",
    "use": "관심 분야, 담당자 등 복수 선택을 요약해 보여줄 때 사용합니다.",
    "props": "label·options를 전달하고 value/onValueChange 또는 defaultValue에 문자열 배열을 지정합니다. showTags 기본값은 true입니다. required·disabled·error·hint를 사용할 수 있습니다.",
    "tips": [
      "태그 제거 버튼과 체크박스로 선택을 해제할 수 있습니다.",
      "선택 배열에는 options에 있는 고유한 value를 넣으세요."
    ]
  },
  "RadioGroup": {
    "summary": "관련된 선택지 중 하나만 선택합니다.",
    "use": "모든 선택지를 한눈에 보여주고 비교해야 하는 입력에 사용합니다.",
    "props": "label과 options는 필수입니다. value/onValueChange 또는 defaultValue로 선택을 설정합니다. name·required·disabled와 옵션별 disabled를 사용할 수 있습니다.",
    "tips": [
      "Tab으로 그룹에 들어가 방향키로 선택합니다.",
      "폼의 각 라디오 그룹에 고유한 name을 사용하세요."
    ]
  },
  "CheckboxGroup": {
    "summary": "관련된 여러 선택 항목을 한 그룹으로 보여줍니다.",
    "use": "선택 결과를 태그보다 목록에서 확인하는 복수 선택 입력에 사용합니다.",
    "props": "label·options와 문자열 배열 value/onValueChange 또는 defaultValue를 사용합니다. required·disabled·error·hint를 설정할 수 있습니다.",
    "tips": [
      "required를 지정하면 한 개 이상을 선택해야 합니다.",
      "그룹 이름과 옵션 문구에 선택 목적을 명확히 적으세요."
    ]
  },
  "Switch": {
    "summary": "설정의 켜짐과 꺼짐을 전환합니다.",
    "use": "알림 수신처럼 두 상태가 분명한 설정에 사용합니다.",
    "props": "label은 필수입니다. checked/onCheckedChange 또는 defaultChecked로 상태를 설정합니다. required·disabled·name을 사용할 수 있습니다.",
    "tips": [
      "Space 또는 클릭으로 전환합니다. 라벨은 상태가 아닌 설정 이름으로 작성하세요.",
      "폼에서 checked인 상태의 기본 제출값은 on입니다. 앱에서 boolean 값이 필요하면 checked를 사용하세요."
    ]
  },
  "FileInput": {
    "summary": "파일을 선택하거나 끌어 놓고 선택한 파일 이름을 확인합니다.",
    "use": "첨부할 파일을 고르는 화면에 사용합니다.",
    "props": "label은 필수입니다. accept·multiple·onFilesChange와 required·disabled·error·hint·name을 사용합니다. onFilesChange는 File 배열을 전달합니다.",
    "tips": [
      "클릭 선택과 끌어 놓기에 같은 형식 제한을 적용합니다. 허용하지 않는 파일이 있으면 선택을 비우고 오류를 안내합니다.",
      "파일 전송은 선택 후 별도로 연결하세요. form.reset은 변경 콜백을 호출하지 않으므로 앱의 File 배열도 필요한 경우 함께 초기화하세요."
    ]
  },
  "AddressField": {
    "summary": "우편번호, 도로명·지번 주소와 상세 주소를 함께 입력합니다.",
    "use": "배송지나 연락 주소를 받는 폼에 사용합니다.",
    "props": "value/defaultValue는 postal·road·jibun·detail 문자열 객체입니다. onValueChange로 전체 주소를 받습니다. onSearch 또는 searchSlot으로 주소 검색을 연결합니다.",
    "tips": [
      "name을 지정하면 주소 필드별 제출 이름을 구성합니다. required는 우편번호와 도로명 주소에 적용합니다.",
      "사용할 주소 검색 서비스의 선택 결과를 select 콜백으로 전달하세요. 배송 가능 여부는 서비스에서 확인합니다."
    ]
  },
  "DatePicker": {
    "summary": "달력 또는 직접 입력으로 날짜를 선택합니다.",
    "use": "예약일, 시작일 등 하루를 지정하는 입력에 사용합니다.",
    "props": "value/defaultValue 형식은 YYYY-MM-DD입니다. label 기본값은 날짜입니다. onChange·onValidityChange·min·max·disabledDates·required를 사용할 수 있습니다.",
    "tips": [
      "방향키로 달력의 날짜를 이동하고 Escape로 닫습니다.",
      "편집 중인 문자열과 확정 날짜는 다를 수 있습니다. 제출 전에 onValidityChange 결과를 확인하세요."
    ]
  },
  "DateRangePicker": {
    "summary": "시작일과 종료일을 함께 선택합니다.",
    "use": "여행 기간, 조회 기간처럼 연속된 날짜 범위가 필요한 입력에 사용합니다.",
    "props": "value/defaultValue는 start·end 객체이며 각 값은 YYYY-MM-DD입니다. label 기본값은 기간입니다. min·max·disabledDates와 onChange·onValidityChange를 사용할 수 있습니다.",
    "tips": [
      "시작일이 종료일보다 늦으면 오류를 안내합니다. 범위 제한을 두 날짜에 맞춰 설정하세요.",
      "폼 제출에는 앱이 관리하는 start와 end 값을 연결하세요."
    ]
  },
  "MonthPicker": {
    "summary": "연도와 월을 선택합니다.",
    "use": "월별 조회나 청구 기간처럼 날짜 없이 월 단위로 지정할 때 사용합니다.",
    "props": "value/defaultValue 형식은 YYYY-MM, label 기본값은 월입니다. onChange·onValidityChange·min·max·required를 사용할 수 있습니다.",
    "tips": [
      "min과 max를 지정하면 해당 월을 포함한 범위 안에서 선택합니다.",
      "월 단위 문자열을 그대로 저장하고 조회 조건에 사용하세요."
    ]
  },
  "TimeInput": {
    "summary": "시와 분을 선택해 시간을 입력합니다.",
    "use": "예약 시간이나 일정의 시작 시간을 지정할 때 사용합니다.",
    "props": "value/defaultValue 형식은 HH:mm, label 기본값은 시간입니다. min·max·onChange·onValidityChange·required를 사용할 수 있습니다.",
    "tips": [
      "시계 또는 24시간 목록에서 조정하고 확인하면 값을 확정합니다.",
      "HH:mm은 현지 시간입니다. 날짜와 시간대가 필요한 저장은 서비스의 시간 기준에 맞춰 처리하세요."
    ]
  },
  "DateTimeInput": {
    "summary": "날짜와 시간을 하나의 입력으로 선택합니다.",
    "use": "예약 시작이나 일정 마감처럼 날짜와 분 단위 시간이 함께 필요한 입력에 사용합니다.",
    "props": "value/defaultValue 형식은 YYYY-MM-DDTHH:mm입니다. label 기본값은 날짜 및 시간입니다. onChange·onValidityChange·min·max·disabledDates를 사용할 수 있습니다.",
    "tips": [
      "경계 날짜에서는 min과 max의 시간 제한도 적용합니다.",
      "입력은 시간대가 없는 현지 날짜와 시간입니다. 저장할 때 적용할 시간대를 정하세요."
    ]
  },
  "SearchField": {
    "summary": "검색어를 입력하는 한 줄 검색 필드입니다.",
    "use": "목록이나 콘텐츠를 검색하는 화면에 사용합니다.",
    "props": "value/defaultValue·onChange와 name·placeholder·disabled 등 input 속성을 전달합니다. 입력 type은 search입니다.",
    "tips": [
      "무엇을 검색하는지 라벨이나 aria-label로 설명하세요.",
      "onChange에서 검색어를 받아 필터링하거나 검색 요청에 연결하세요."
    ]
  },
  "GNB": {
    "summary": "서비스의 주요 영역을 탐색하는 메뉴입니다.",
    "use": "여러 주요 화면을 오가는 최상위 탐색에 사용합니다.",
    "props": "items·selectedId·onSelect는 필수입니다. 항목에 id·label·disabled를 지정합니다. label 기본값은 전체 탐색입니다.",
    "tips": [
      "onSelect에서 선택 상태와 화면 이동을 연결하세요. Tab과 Enter/Space로 항목을 조작합니다.",
      "640px 이하에서는 펼침 버튼으로 메뉴를 열고 항목 선택 후 닫습니다."
    ]
  },
  "LNB": {
    "summary": "현재 영역 안에서 하위 메뉴를 그룹별로 탐색합니다.",
    "use": "설정이나 관리 화면의 사이드 탐색에 사용합니다.",
    "props": "groups·selectedId·onSelect는 필수입니다. 그룹은 id·label·items로 구성합니다. label 기본값은 영역 탐색입니다.",
    "tips": [
      "선택 상태와 화면 이동은 onSelect에서 함께 관리하세요.",
      "전체 메뉴 또는 각 그룹을 접을 수 있습니다. 접어도 선택값은 유지합니다."
    ]
  },
  "Breadcrumb": {
    "summary": "현재 화면이 전체 경로에서 어디에 있는지 표시합니다.",
    "use": "계층이 있는 상세 화면에서 상위 화면으로 돌아갈 수 있게 할 때 사용합니다.",
    "props": "items에 label과 선택적 href를 전달합니다. label 기본값은 현재 위치입니다.",
    "tips": [
      "앞 항목에 상위 화면의 href를 지정하세요. 마지막 항목은 현재 페이지로 표시합니다.",
      "경로는 실제 탐색 구조의 순서로 구성하고 이름은 간결하게 적으세요."
    ]
  },
  "Tabs": {
    "summary": "같은 화면 안의 관련 콘텐츠를 탭으로 전환합니다.",
    "use": "정보, 설정, 기록처럼 맥락을 유지하며 내용을 나누는 화면에 사용합니다.",
    "props": "items에 label·content 배열을 전달합니다. label 기본값은 보기 전환입니다. 처음에는 첫 탭을 선택합니다.",
    "tips": [
      "좌우 방향키로 이동하고 Home/End로 첫 탭과 마지막 탭을 선택합니다.",
      "숨겨진 패널도 유지됩니다. 선택한 인덱스가 항목 축소로 사라지면 첫 탭을 선택합니다."
    ]
  },
  "Menu": {
    "summary": "버튼을 눌러 관련 작업 목록을 펼칩니다.",
    "use": "복제, 보관처럼 한 항목에 연결된 보조 작업이 여러 개일 때 사용합니다.",
    "props": "label 기본값은 작업 메뉴, items 기본값은 복제·보관입니다. onSelect로 선택한 작업 이름을 받습니다.",
    "tips": [
      "ArrowDown으로 열고 위아래 방향키·Home·End로 이동합니다. 선택하거나 Escape를 누르면 버튼으로 초점을 돌려줍니다.",
      "메뉴는 버튼 가까이에 배치됩니다. 조상 요소의 잘림과 화면 가장자리에서의 위치를 확인하세요."
    ]
  },
  "BottomSheet": {
    "summary": "작은 화면의 아래쪽에서 내용과 작업을 보여줍니다.",
    "use": "모바일의 옵션 선택이나 짧은 입력에 사용합니다.",
    "props": "open·title·children·onClose는 필수입니다. footer에 하단 작업을 넣습니다.",
    "tips": [
      "작은 화면에서는 하단 시트, 큰 화면에서는 중앙 대화상자로 표시합니다.",
      "onClose에서 open을 false로 갱신하세요. 취소와 적용 결과를 구분합니다."
    ]
  },
  "Dialog": {
    "summary": "현재 작업에 집중하도록 배경 위에 대화상자를 표시합니다.",
    "use": "정보 확인, 선택, 짧은 폼처럼 완료하거나 취소한 뒤 원래 화면으로 돌아오는 작업에 사용합니다.",
    "props": "open·title·children·onClose는 필수입니다. footer에 취소와 적용 등의 버튼을 넣습니다.",
    "tips": [
      "title은 대화상자의 접근 가능한 이름입니다. Escape와 닫기 동작은 onClose로 전달합니다.",
      "닫을 때 열기 버튼으로 초점을 돌려줍니다. 긴 본문과 하단 버튼이 모두 사용 가능한지 확인하세요."
    ]
  },
  "Confirm": {
    "summary": "중요한 작업을 실행하기 전에 사용자의 확인을 받습니다.",
    "use": "삭제나 되돌리기 어려운 변경을 확인하는 화면에 사용합니다.",
    "props": "open·title·children·onClose·onConfirm은 필수입니다. onConfirm은 확인 요청, onClose는 취소와 닫기 요청입니다. loading의 기본값은 false입니다.",
    "tips": [
      "무엇이 바뀌고 복구할 수 있는지 본문에 설명하세요. onConfirm에서 작업을 실행하고 성공한 뒤 open을 false로 갱신하세요.",
      "loading은 확인 버튼의 진행 상태를 표시하고 확인 클릭을 막습니다. 취소와 닫기 요청은 계속 사용할 수 있으므로 요청 진행 중의 취소 처리도 앱에서 정하세요."
    ]
  },
  "Drawer": {
    "summary": "화면 오른쪽에서 보조 내용을 펼쳐 보여줍니다.",
    "use": "원래 화면을 유지하며 상세 정보나 설정을 확인할 때 사용합니다.",
    "props": "open·title·children·onClose는 필수입니다. footer에 작업 버튼을 넣을 수 있습니다.",
    "tips": [
      "작은 화면에서는 화면 너비를 사용합니다. 내용 길이에 맞춰 읽고 조작할 공간을 확보하세요.",
      "닫기와 Escape 요청은 onClose에서 open에 반영하세요."
    ]
  },
  "Popover": {
    "summary": "버튼 가까이에 짧은 내용과 보조 작업을 펼칩니다.",
    "use": "설명, 간단한 설정 등 화면을 떠나지 않고 확인할 내용에 사용합니다.",
    "props": "label·title·children을 전달합니다. 버튼을 누르면 펼침 상태를 전환합니다.",
    "tips": [
      "외부를 누르거나 Escape를 누르면 닫고 버튼으로 초점을 돌려줍니다.",
      "패널은 버튼 주변에 배치됩니다. 좁은 화면과 잘림이 있는 조상 요소에서 위치를 확인하세요."
    ]
  },
  "Tooltip": {
    "summary": "버튼에 대한 짧은 보충 설명을 보여줍니다.",
    "use": "화면의 문구만으로 부족한 간단한 설명을 더할 때 사용합니다.",
    "props": "label과 text는 필수입니다. label은 버튼 문구, text는 설명입니다.",
    "tips": [
      "포인터를 올리거나 버튼에 초점을 두면 표시합니다. 포인터를 벗어나거나 초점을 옮기거나 Escape를 누르면 닫힙니다.",
      "필수 안내는 항상 보이는 문구로 제공하세요. 툴팁에는 조작해야 하는 내용을 넣지 마세요."
    ]
  },
  "Table": {
    "summary": "행과 열로 정리된 데이터를 표로 보여줍니다.",
    "use": "데이터를 비교해 읽는 기본 표에 사용합니다. 검색과 선택이 필요하면 DataTable을 선택하세요.",
    "props": "caption·rows·columns·rowKey는 필수입니다. columns.value는 문자열 또는 숫자를 반환하고 render로 셀 내용을 바꿀 수 있습니다.",
    "tips": [
      "caption에 표의 목적을 적고 rowKey에 안정적인 고유 값을 사용하세요.",
      "넓은 표는 내부에서 가로로 이동할 수 있습니다. 셀 내용이 읽는 순서에 맞는지 확인하세요."
    ]
  },
  "DataTable": {
    "summary": "검색, 정렬, 필터와 선택 작업을 함께 제공하는 표입니다.",
    "use": "많은 행을 찾아보고 여러 항목을 처리하는 관리 화면에 사용합니다.",
    "props": "caption·rows·columns·rowKey를 전달합니다. initialPageSize 기본값은 5입니다. filter·bulkAction·loading·error·onRetry를 설정할 수 있습니다.",
    "tips": [
      "정렬할 열에는 sortable을 지정하세요. 검색과 페이지 이동은 전달한 rows를 대상으로 동작합니다.",
      "bulkAction은 선택한 원본 행을 전달합니다. 행별 이름은 rowLabel로 알기 쉽게 지정하세요."
    ]
  },
  "Pagination": {
    "summary": "페이지를 나누어 이동하는 탐색 버튼입니다.",
    "use": "목록이나 검색 결과를 여러 페이지로 보여줄 때 사용합니다.",
    "props": "page·pageCount·onPageChange는 필수입니다. page는 1부터 시작합니다. label 기본값은 페이지 탐색입니다.",
    "tips": [
      "onPageChange에서 page와 표시할 데이터를 함께 갱신하세요.",
      "이전과 다음은 첫 페이지와 마지막 페이지에서 비활성화됩니다. page에는 유효한 정수를 전달하세요."
    ]
  },
  "List": {
    "summary": "관련된 항목을 세로 목록으로 묶습니다.",
    "use": "제목과 설명 중심으로 항목을 읽는 화면에 사용합니다.",
    "props": "label은 필수입니다. children에 ListItem 또는 ListRow를 넣고 ul 속성을 전달할 수 있습니다.",
    "tips": [
      "목록 이름을 label에 지정하세요.",
      "머리말과 바닥말은 ul 바깥에 ListHeader·ListFooter로 구성합니다."
    ]
  },
  "ListItem": {
    "summary": "목록에 제목, 설명, 이미지와 동작을 표시합니다.",
    "use": "내용 구성이 단순한 목록 항목에 사용합니다.",
    "props": "title은 필수입니다. description·thumbnail·action을 넣고 selected/onSelectionChange로 선택을 관리합니다. selected 기본값은 false입니다.",
    "tips": [
      "List 안에 배치하세요. onSelectionChange가 있으면 선택 체크박스를 표시합니다.",
      "행 전체 대신 체크박스와 action 버튼으로 조작합니다. 추가 슬롯이 필요하면 ListRow를 선택하세요."
    ]
  },
  "Badge": {
    "summary": "짧은 상태나 분류를 작은 표시로 보여줍니다.",
    "use": "진행 상태, 분류, 개수처럼 빠르게 읽을 정보를 강조할 때 사용합니다.",
    "props": "children에 내용을 넣고 tone을 선택합니다. tone은 neutral/running/success/review/error이며 기본 neutral입니다.",
    "tips": [
      "문구 자체로 상태를 설명하고 색만으로 의미를 전달하지 마세요.",
      "사용자에게 새 결과를 알릴 때는 Alert나 Toast처럼 알림 용도의 컴포넌트를 선택하세요."
    ]
  },
  "Alert": {
    "summary": "현재 화면에서 알아야 할 안내나 오류를 표시합니다.",
    "use": "입력 오류, 처리 상태, 주의사항처럼 내용을 읽고 행동해야 하는 안내에 사용합니다.",
    "props": "title과 children은 필수입니다. tone 기본값은 running이며 neutral/success/review/error를 사용할 수 있습니다.",
    "tips": [
      "제목에는 요점을, 본문에는 이유와 다음 행동을 적으세요.",
      "error는 오류 알림으로, 다른 tone은 상태 안내로 전달됩니다. 안내를 해결했을 때 화면에서 갱신하거나 제거하세요."
    ]
  },
  "Progress": {
    "summary": "작업의 완료 비율이나 진행 중 상태를 표시합니다.",
    "use": "완료량을 알 수 있는 처리나 아직 비율을 알 수 없는 대기 상태에 사용합니다.",
    "props": "value에 숫자를 전달하면 0~100 범위로 표시합니다. value를 생략하면 진행 중 표시를 사용합니다. label 기본값은 진행률입니다.",
    "tips": [
      "실제 처리 상태에 맞춰 값을 갱신하세요. 작업이 끝나면 결과를 함께 안내합니다.",
      "완료 비율을 알 수 없으면 임의의 숫자 대신 value를 생략하세요."
    ]
  },
  "Skeleton": {
    "summary": "콘텐츠를 기다리는 동안 자리 표시를 보여줍니다.",
    "use": "읽을 내용이 로딩될 때 빈 공간의 위치를 안내하는 데 사용합니다.",
    "props": "label 기본값은 콘텐츠 불러오는 중입니다. 불러올 내용에 맞춰 안내 문구를 바꿀 수 있습니다.",
    "tips": [
      "내용이 준비되면 실제 콘텐츠로 바꾸세요.",
      "움직임 줄이기 설정에서는 애니메이션을 멈춥니다."
    ]
  },
  "LoadingSpinner": {
    "summary": "작업이 진행 중임을 짧은 문구와 회전 표시로 안내합니다.",
    "use": "완료 비율을 알기 어려운 짧은 대기에 사용합니다.",
    "props": "label 기본값은 불러오는 중입니다. 어떤 작업을 기다리는지 설명하는 문구를 지정하세요.",
    "tips": [
      "대기가 끝나면 제거하거나 결과 안내로 바꾸세요.",
      "로딩이 길어지면 사용자가 취소하거나 다시 시도할 방법을 제공하세요."
    ]
  },
  "EmptyState": {
    "summary": "표시할 항목이 없을 때 이유와 다음 동작을 안내합니다.",
    "use": "첫 사용, 빈 목록, 검색 결과가 없을 때 사용합니다.",
    "props": "title과 children은 필수입니다. action 기본값은 항목 추가입니다. onAction으로 버튼 동작을 연결하고 loading으로 진행 상태를 표시합니다.",
    "tips": [
      "내용이 없는 이유를 설명하고 추가, 검색 조건 변경 등 가능한 동작을 제안하세요.",
      "loading 중에는 버튼 실행을 막습니다. 완료 후 목록이나 안내를 갱신하세요."
    ]
  },
  "ErrorState": {
    "summary": "내용을 불러오지 못했을 때 오류와 재시도를 보여줍니다.",
    "use": "목록이나 콘텐츠 로딩 실패에 복구 동작을 제공할 때 사용합니다.",
    "props": "onRetry는 필수입니다. message 기본값은 불러오지 못했습니다입니다.",
    "tips": [
      "사용자가 할 수 있는 조치를 message에 적으세요.",
      "onRetry에서 재시도를 실행하고, 진행 중에는 LoadingSpinner 등으로 상태를 바꾸세요."
    ]
  },
  "Toast": {
    "summary": "작업 결과를 짧게 알리는 메시지입니다.",
    "use": "저장 완료처럼 현재 작업을 방해하지 않는 결과 안내에 사용합니다.",
    "props": "message와 onDismiss를 전달합니다. 닫기 버튼에서 onDismiss를 호출합니다.",
    "tips": [
      "닫기 요청을 받으면 메시지를 화면에서 제거하세요.",
      "중요한 오류나 오래 읽어야 할 안내는 Alert로 표시하세요."
    ]
  },
  "Accordion": {
    "summary": "관련된 여러 내용을 제목별로 펼쳐 읽습니다.",
    "use": "도움말, 자주 묻는 질문, 여러 설정 묶음에 사용합니다.",
    "props": "items에 고유한 id·title·content를 전달합니다. 항목별 disabled를 지정할 수 있습니다. multiple 기본값은 false입니다.",
    "tips": [
      "제목 버튼에서 Enter 또는 Space로 펼치고 접습니다. multiple을 켜면 여러 내용을 동시에 열 수 있습니다.",
      "처음에는 모두 접혀 있습니다. 중요한 내용을 찾을 수 있는 제목을 작성하세요."
    ]
  },
  "Collapse": {
    "summary": "하나의 보조 내용을 펼치거나 접습니다.",
    "use": "추가 설명이나 선택적인 세부 내용을 숨겨두고 읽게 할 때 사용합니다.",
    "props": "title과 children을 전달합니다. 처음에는 접혀 있습니다.",
    "tips": [
      "제목 버튼의 Enter 또는 Space로 펼칩니다.",
      "여러 Collapse는 각각 독립적으로 열립니다. 관련된 내용을 묶으려면 Accordion을 사용하세요."
    ]
  },
  "Separator": {
    "summary": "서로 다른 내용의 경계를 구분하는 선입니다.",
    "use": "한 영역 안에서 정보 묶음을 나눌 때 사용합니다.",
    "props": "내용 사이에 Separator를 배치합니다.",
    "tips": [
      "문서 구분선의 의미를 함께 제공합니다.",
      "간격만으로 충분히 구분되면 선을 반복해서 넣지 마세요."
    ]
  },
  "Container": {
    "summary": "본문을 가운데 정렬하고 읽기 좋은 최대 너비로 제한합니다.",
    "use": "페이지 본문과 헤더의 좌우 정렬을 맞출 때 사용합니다.",
    "props": "children과 div 속성을 전달합니다. 기본 최대 너비는 1200px입니다. className과 style로 배치를 조정할 수 있습니다.",
    "tips": [
      "좌우 여백은 사용하는 화면에서 지정하세요.",
      "작은 화면에서는 가용 너비에 맞춰 줄어듭니다."
    ]
  },
  "Stack": {
    "summary": "내용을 일정한 간격으로 세로 배치합니다.",
    "use": "설명, 입력, 버튼 등의 순서를 분명하게 정리할 때 사용합니다.",
    "props": "children과 div 속성을 전달합니다. 기본 간격은 16px이며 className과 style로 조정할 수 있습니다.",
    "tips": [
      "관련된 내용끼리 묶고 큰 구분은 바깥 Stack에서 구성하세요.",
      "긴 내용은 줄바꿈할 수 있는 너비와 함께 배치하세요."
    ]
  },
  "Grid": {
    "summary": "가용 공간에 맞춰 열 수가 바뀌는 격자 배치입니다.",
    "use": "요약 카드나 여러 정보 영역을 반응형으로 나란히 배치할 때 사용합니다.",
    "props": "children과 div 속성을 전달합니다. 기본 간격은 16px이며 항목 너비 280px를 기준으로 열을 구성합니다.",
    "tips": [
      "280px보다 좁은 공간에서는 한 열로 표시합니다.",
      "정해진 항목 목록과 렌더링이 필요하면 GridList를 선택하세요."
    ]
  },
  "Shell": {
    "summary": "헤더, 탐색 영역과 본문으로 페이지 골격을 구성합니다.",
    "use": "여러 화면에 같은 헤더와 사이드 탐색을 사용하는 레이아웃에 적합합니다.",
    "props": "navigation·header·children은 필수입니다. mainAs는 main 또는 div이며 기본 main입니다.",
    "tips": [
      "이미 main 안에 배치할 때는 mainAs=div를 사용해 본문 영역의 중복을 피하세요.",
      "탐색 메뉴와 선택 상태는 navigation에 넣는 컴포넌트에서 구성합니다."
    ]
  },
  "ActionGroup": {
    "summary": "관련된 작업 버튼을 하나의 그룹으로 묶습니다.",
    "use": "취소와 적용, 편집과 삭제처럼 같은 맥락의 동작을 배치할 때 사용합니다.",
    "props": "children에 버튼을 넣고 label에 그룹 이름을 지정합니다. label 기본값은 동작입니다.",
    "tips": [
      "주요 작업과 보조 작업의 버튼 강조를 구분하세요.",
      "버튼별 onClick·loading·disabled를 설정합니다."
    ]
  },
  "FormSection": {
    "summary": "폼의 관련 입력을 제목과 함께 묶습니다.",
    "use": "연락처, 기본 정보처럼 긴 폼을 의미 있는 부분으로 나눌 때 사용합니다.",
    "props": "title과 children은 필수입니다. actions에 섹션의 버튼을 넣을 수 있습니다.",
    "tips": [
      "입력 각각에 라벨과 오류 안내를 연결하세요.",
      "제출이 필요한 전체 폼은 form으로 감싸고 버튼의 type을 명시하세요."
    ]
  },
  "ListPanel": {
    "summary": "제목, 도구와 목록 내용을 하나의 영역으로 구성합니다.",
    "use": "검색·추가 버튼이 있는 목록 섹션에 사용합니다.",
    "props": "title과 children은 필수입니다. toolbar에 검색이나 작업 도구를 넣습니다.",
    "tips": [
      "children에는 List나 필요한 목록 내용을 배치하세요.",
      "검색 조건과 항목 상태는 화면에서 관리하고 toolbar의 동작에 연결합니다."
    ]
  },
  "Icon": {
    "summary": "의미를 보조하는 SVG 아이콘을 표시합니다.",
    "use": "텍스트 옆의 설명이나 버튼 안의 시각적 단서로 사용합니다.",
    "props": "name으로 iconNames의 아이콘을 선택합니다. size 기본값은 20, strokeWidth는 1.75입니다. SVG 속성을 함께 전달할 수 있습니다.",
    "tips": [
      "기본 아이콘은 장식으로 취급합니다. 의미를 텍스트로 함께 설명하세요.",
      "아이콘만 있는 실행 동작에는 접근 가능한 이름을 가진 IconAction 또는 IconButton을 사용하세요."
    ]
  },
  "IconAction": {
    "summary": "이름으로 선택한 아이콘을 실행 버튼으로 표시합니다.",
    "use": "복사, 수정, 삭제처럼 준비된 아이콘으로 동작을 만들 때 사용합니다.",
    "props": "name과 label은 필수입니다. variant 기본값은 secondary, size는 medium, type은 button입니다. Button의 loading·disabled·이벤트 속성을 사용할 수 있습니다.",
    "tips": [
      "label에는 수정, 알림 닫기처럼 동작을 설명하는 이름을 지정하세요.",
      "size는 버튼 크기입니다. 사용자에게 중요한 작업에는 필요에 따라 보이는 텍스트 버튼을 함께 제공하세요."
    ]
  }
};
