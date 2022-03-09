배포 사이트 : https://used-auction.herokuapp.com

# 설명

최근 중고거래 시장이 활발해지고 있지만 기사를 보면 중고제품의 미개봉의 경우 가격대가 어느정도 형성되어 있지만 사용을 한 제품의 경우 가격대가 천차 만별이고 사용은 하였지만 그렇게 싸다고 느끼기 힘든 제품도 있습니다. 판매자의 경우에도 제대로 형성된 금액대가 없기에 이득을 보기위에서 또는 다른 중고 제품과 비슷하게 올려야지 하는 마음으로 금액대 형성이 잘 이루어 지지 않는것 같아 정해진 금액이 아닌 필요에 의해 더 높은 가격에 구매할 수도 있고 좀 더 저렴하게 구매할 수도 있게 경매 시스템이 있으면 좋겠다 생각하여 만들어 보게 되었습니다.

# 사용한 기술

## NodeJS

- express를 사용하여 간편하게 서버구축
- express의 middleware 기능으로 예외처리 코드를 재사용해서 적용

## 세션

- 세션을 이용하여 클라이언트 정보를 서버에 저장
- 쿠키를 통해 세션 아이디를 클라이언트에 저장
- 쿠키 기간 설정
  ```jsx
  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 20000,
      },
      store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    })
  );
  ```

## MVC 패턴

- MVC 패턴을 사용하여 Model, View, Controller로 나누어 개발

## Babel

- Babel을 사용하여 최신 JS언어를 nodeJS가 이해 가능한 오래되고 안정정인 JS언어로 변환하여 사용

## Webpack

- webpack을 사용하여 종속성이 있는 JS파일을 하나의 파일로 번들링 하여 페이지 성능 최적화

## Morgan

- morgan을 사용하여 status code를 확인하며 개발의 편의성을 높임

```jsx
import morgan from "morgan";

const logger = morgan("dev");
app.use(logger);
```

# Pug

- 핫한 Node Express Template Engine을 사용하여 HTML을 간단하게 표현하고 JS 연산 결과를 쉽게 보여줄 수 있다는것을 배움
- res.sendFile(\_\_dirname, 'potato.html') 같이 html 파일을 바로 렌더링 할 수 있긴하지만, request를 통해 각종 변수를 전달하지 못하기 때문에 미리 정해둔 화면 밖에는 보여줄 수가 없고, header 나 footer 등을 따로 partial로 만들어 관리하고 모든 파일에 첨부한다든지 할 수 있다.

## MongoDB

- MySQL 과는 다르게 오브젝트 형식으로 개발자가 더 친숙하게 사용할 수 있다는 MongoDB를 사용해 DB를 구축

## bcrypt

- 값을 해시값으로 변경할 수 있고, 해시값을 기존 값과도 비교할 수 있다.

## 소셜 로그인

- 깃헙과 카카오 계정을 사용하여 로그인을 할 수 있게 하였습니다.

## Express Flash

- 플래시 메시지를 사용해서 post가 정상적으로 이행됐을때 잠깐의 메시지를 띄움.

## Heroku 배포

Java, Node.js, Python등 여러 언어를 지원하는 클라우드 Paas로, 서비스형 플랫폼(Platform as a Service, PaaS)은 클라우드 컴퓨팅 서비스 분류 중 하나다. 일반적으로 앱을 개발하거나 구현할 때, 관련 인프라를 만들고 유지보수하는 복잡함 없이 애플리케이션을 개발, 실행, 관리할 수 있게 하는 플랫폼을 제공한다. SaaS의 개념을 개발 플랫폼에도 확장한 방식으로, 개발을 위한 플랫폼을 구축할 필요 없이, 필요한 개발 요소를 웹에서 쉽게 빌려쓸 수 있게 하는 모델이다.

## AWS S3

aws s3는 Simple Storage Service의 약자로 파일 서버의 역할을 하는 인터넷 스토리지 서비스이다.
용량에 관계 없이 파일을 저장할 수 있고 웹(HTTP 프로토콜)에서 파일에 접근할 수 있다.

- aws s3를 사용해 제품의 이미지와 개인 프로필 이미지를 저장하게 하였습니다.

# 기억에 남는 에러

- views 폴더가 src안에 있을때 제대로 읽어들이지 못하는데 이 경우 디폴트 경로 문제 때문이다. src폴더 밖으로 꺼내면 이상없이 돌아가긴하지만, 이것을 src안에 있을때도 돌아가게 만들고 싶을때는 아래의 코드를 server.js에 추가한다.
  ```tsx
  app.set("views", process.cwd() + "/src/views");
  ```
- 제품 페이지에서 입찰을 했을때 정규식을 사용해 쉼표를 넣고 반환해서 입찰금액을 표시했는데 크롬에서 문제가 없었는데 사파리에서는 제대로 뜨지 않는 에러가 발생하였습니다. 이유를 살펴보니 사파리의 경우 regex에서 lookbehind 문법을 지원하지 않는다고 해서 substring() 을 사용해서 값을 바꿔주었습니다.
- **No 'Access-Control-Allow-Origin' header is present on the requested resource. net::ERR_FAILED 200**
  AWS S3에 저장한 사진들을 불러오는데 발생한 에러로 AWS S3 버킷의 권한 설정에서 하단의 Cross-origin resource sharing (CORS) 에 JSON형식으로 입력
  ```jsx
  [
    {
      AllowedHeaders: ["*"],
      AllowedMethods: ["GET", "PUT", "POST", "DELETE"],
      AllowedOrigins: ["*"],
      ExposeHeaders: [],
    },
  ];
  ```
  JSON으로 작성된 CORS 구성은 한 도메인에 로드되어 다른 도메인의 리소스와 상호 작용하는 클라이언트 웹 애플리케이션에 대한 방법을 정의합니다.
  [https://docs.aws.amazon.com/AmazonS3/latest/userguide/enabling-cors-examples.html](https://docs.aws.amazon.com/AmazonS3/latest/userguide/enabling-cors-examples.html)
  [https://stackoverflow.com/questions/17533888/s3-access-control-allow-origin-header](https://stackoverflow.com/questions/17533888/s3-access-control-allow-origin-header)

# 보완할 점

- 고객센터
- 거래 방법에 대한 생각
