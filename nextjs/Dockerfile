# Base image sifatida Node.js 18 dan foydalanamiz
FROM node:18

# Ishchi katalogni yaratamiz
WORKDIR /app

# package.json va package-lock.json fayllarini nusxalaymiz
COPY package*.json ./

# Next.js dependencieslarini o‘rnatamiz
RUN npm install

# Barcha loyihani nusxalaymiz
COPY . .

# Next.js loyihasini build qilamiz
RUN npm run build

# Portni ochamiz
EXPOSE 3000

# Next.js serverni ishga tushiramiz
CMD ["npm", "start"]
