IMPORTANTE: a versão do projeto web n é a versão final e é feita p q n tenha q mudar os dominios toda a hora;
quando for dar commit, verifique todas as mudanças

1: abre 2 janelas de cmd no vscode ou só uma janela de cmd fora do vscode

2: na primeira janela entra no root do projeto (deve ser a primeira pasta quando vc abre o cmd pelo vscode) e roda o npm install

3: na segunda janela do cmd entra no frontend "cd frontend-web" e roda o npm install

4: enquanto o frontend instala (vai demorar) pega o .env no trello, cria um no arquivo com o exato nome de ".env" no root do projeto e cola o .env inteiro lá

4.1: o . env vai estar inteiro em uma linha  vc vai precisar colocar paragrafos p separar tudo, 1 dps do "3000" outro dps do "require" e dps disso outro paragrafo dps de cada ' , tem uma foto no gp de como de estar dps de tudo isso

5.qnd tudo estiver pronto roda primeiro o back e dps o front (o back n funciona se o front rodar primeiro)

caso no mobile o "tsconfig.base" não seja gerado, crie um arquivo "tsconfig.base.json" na pasta .expo e cole o código abaixo lá

{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-native"
  },
  "exclude": ["node_modules", "babel.config.js", "metro.config.js", "jest.config.js"]
}

.env: 
PORT=3000
#postgresql://hoteldb_owner:npg_7SjQXYmWk2Ad@ep-purple-lake-ac1gp7qj-pooler.sa-east-1.aws.neon tech/hoteldb?sslmode=require
PGHOST='ep-purple-lake-ac1gp7qj-pooler.sa-east-1.aws.neon.tech'
PGDATABASE='hoteldb'
PGUSER='hoteldb_owner' 
PGPASSWORD='npg_7SjQXYmWk2Ad' 
JWT_SECRET='4eceed3691fef88bfb7b6ad1'

#ips: http://172.16.1.234:3000

WEB_FRONT_PORT='http://172.16.1.234:3001' 
WEB_BACK_PORT='http://172.16.1.234:3000'

EXPO_PUBLIC_API_URL='http://172.16.1.234:3000'

EMAIL_USER='igolwb@gmail.com' 
EMAIL_PASS='pzeejieogmqvbfea'

PAGSEGURO_SANDBOX_TOKEN=
PAGSEGURO_NOTIFICATION_URL=http://172.16.1.234:3000/api/payments/notifications

GROQ_API_KEY=


