Backend Day 1 - Express 동작 원리 핵심 정리

1.  전체 요청 흐름
    Browser (Chrome)

            │
            ▼

    HTTP Request (GET /health)

            │
            ▼

    Operating System

            │
            ▼

    4000 Port

            │
            ▼

    Node.js HTTP Server
    (server.listen)

            │
            ▼

    Express

            │
            ▼

    Middleware

            │
            ▼

    Route Table

            │
            ▼

    Handler(req, res)

            │
            ▼

    HTTP Response

            │
            ▼

    Browser

2.  Express는 무엇인가?

Express는 HTTP Server가 아니다.

Node.js가 제공하는 HTTP Server를 쉽게 사용할 수 있도록 만든 Framework이다.

Node.js
│
▼
http.createServer()

    │
    ▼

Express

    │
    ├── app.get()
    ├── app.post()
    ├── app.use()
    └── app.listen()

실제로

app.listen(4000)

은 내부적으로

http.createServer(app);

server.listen(4000);

와 거의 같은 역할을 한다.

3. express()는 무엇을 반환하는가?
   const express = require("express");

const app = express();

express는 함수(Function)이다.

호출하면

Application 객체(app)

를 반환한다.

그래서

app.get()

app.post()

app.use()

app.listen()

를 사용할 수 있다.

4. app.get()은 실행이 아니다.
   app.get("/health", handler);

Handler를 실행하는 것이 아니라

Route Table에 등록(Register)한다.

GET /health

↓

handler 등록

실행되는 시점은

Browser

↓

GET /health 요청

↓

Route 검색

↓

Handler 실행

이다.

5. app.use()도 등록이다.
   app.use(logger);

역시 실행하지 않는다.

Middleware 목록에 등록한다.

Middleware

↓

Logger 등록

↓

JWT 등록

↓

CORS 등록

Request가 들어올 때마다 순서대로 실행된다.

6. Middleware 동작
   Request

↓

Logger

↓

JWT

↓

Router

↓

Handler

↓

Response

Middleware는

next();

를 호출해야

다음 Middleware 또는 Router로 이동한다.

7. next()의 의미

성공

JWT 확인 성공

↓

next()

↓

Controller 실행

실패

JWT 확인 실패

↓

401 Response

↓

종료

예시

if (!token) {
return res.status(401).json({
message: "Unauthorized"
});
}

next(); 8. Lambda와 Express의 차이
Lambda
handler(event)

↓

return

↓

API Gateway

↓

Response

Lambda는

return 중심 구조

Express
handler(req, res)

↓

res.json()

↓

Response

Express는

Response 객체 중심 구조

9. return res.json()을 사용하는 이유
   return res.json({
   status: "OK"
   });

res.json()은 응답을 전송한다.

return은

함수를 종료시키기 위해 사용한다.

return res.json(...);

console.log("여기는 실행되지 않음"); 10. Spring과 Express 비교
Spring Express
Tomcat Node.js HTTP Server
DispatcherServlet Express Router
Filter Middleware
Interceptor Middleware
@GetMapping app.get()
HttpServletRequest req
HttpServletResponse res
FilterChain.doFilter() next()
Controller Handler 11. 앞으로 만들 Backend 구조
Browser

        │
        ▼

Node.js HTTP Server

        │
        ▼

Express

        │
        ▼

Logger Middleware

        │
        ▼

JWT Middleware

        │
        ▼

Router

        │
        ▼

Controller

        │
        ▼

Service

        │
        ▼

Repository

        │
        ▼

Database 12. 오늘 가장 중요한 핵심

Express는 "등록(Register)" 기반의 Framework이다.

프로그램 시작

↓

app.use()

↓

Middleware 등록

↓

app.get()

↓

Route 등록

↓

app.listen()

↓

HTTP Server 대기

↓

Request 발생

↓

Middleware 실행

↓

Route 검색

↓

Handler 실행

↓

Response 반환
📌 Backend Day 1 핵심 문장

Express는 Node.js HTTP Server 위에서 동작하는 Framework이며, 프로그램 시작 시 Route와 Middleware를 등록(Register)해두고, HTTP 요청이 들어오면 등록된 순서대로 실행하여 Response를 반환한다.
