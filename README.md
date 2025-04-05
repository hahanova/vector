# Vector simulation

## 🚀 Start the app

- Clone the repo:
```
git clone https://github.com/hahanova/vector.git
```
- Go to the folder:
```
cd ./vector
```
- Install dependencies:
```
npm i
```
- Run the app:
```
npm start
```

## 🔧 Deploy the app

### Using Vercel

- Bump version:
```
npm version minor
```
- Push the changes to the `main` branch, and they automatically will be deployed

- Go to `https://vector-simulation.vercel.app/` to check if everything is working, check the published version in the console to be sure.

### Using Surge (outdated, use Vercel)

- Bump version:
```
npm version minor
```
- Build the app:
```
npm run build:force
```
- Copy paste `index.html` file in the `dist` folder and rename a new version to `200.html`. So in the end you `dist` folder will have 2 `html` files: `index.html` and `200.html`.

- Run:
```
surge
```
- You will be asked to specify the folder with the build, so you should add `dist` in the end, so the line will be looking like: `project: /Users/your-username/Documents/projects/vector/dist`
- Change the domain name to: `domain: vector-simulation.surge.sh`
- If in the end you see this ` Success! - Published to vector-simulation.surge.sh`, then it ready.
- Go to `https://vector-simulation.surge.sh` to check if everything is working, check the published version in the console to be sure.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
