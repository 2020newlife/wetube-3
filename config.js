// ref: https://stackoverflow.com/questions/42817339/es6-import-happening-before-env-import
// dotenv를 app.js에서 config()하면 process.env에 설정이 세팅이 되므로 다른 모듈에서 dotenv.config()를 호출하지 않아도 된다고 생각함.
// 그래서 app.js에 dotenv.config() 위치를 db.js보다 위로 올렸지만 db.js에서 process.env의 값이 세팅이 되어있지 않았다.
// 확인해보니 import 구문은 hoisted되어 코드가 실행되기 전에 모듈부터 임포트하기 때문이라고 함.
// 대신 import된 모듈은 순서대로 initialized된다고 하므로
// config.js를 만들어 dotenv.config가 포함된 config.js모듈을 만들고 이를 app.js의 최상위에 import함.
import dotenv from 'dotenv';

dotenv.config();
