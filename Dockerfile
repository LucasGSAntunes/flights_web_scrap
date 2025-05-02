# 1) Base com Node + Playwright
FROM mcr.microsoft.com/playwright:latest AS base

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci \
    && npx playwright install --with-deps \
    && npm cache clean --force

COPY . .

FROM base AS test
ENV NODE_ENV=test
ENV CI=true
CMD ["npm", "test", "--", "--detectOpenHandles", "--runInBand"]

FROM base AS runtime
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
