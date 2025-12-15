# Imagem base do Node
FROM node:20

# Define diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependência primeiro (para aproveitar cache)
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Gera o cliente do Prisma (necessário pois o ambiente mudou)
RUN npx prisma generate

# Expõe a porta que a API usa
EXPOSE 3000

# Comando para iniciar em modo de desenvolvimento
CMD [ "/bin/sh", "-c", "npx prisma migrate deploy && npm run start:dev" ]