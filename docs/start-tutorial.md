# Arranque de un proyecto React Native con Expo

Estos pasos se repiten cada vez que se crea una app nueva. El código vive en el ordenador. El proyecto de [Expo](https://expo.dev/) vive en la nube y es el que usa EAS para builds, actualizaciones y el panel. Hay que crear los dos y después unirlos.

Este repositorio usa **Expo SDK 58**, **pnpm** y **Expo Router**. La plantilla `default@sdk-58` deja el siguiente proyecto en la misma línea.

Referencia oficial (SDK 58):

- [Crear un proyecto](https://docs.expo.dev/get-started/create-a-project/)
- [Crear el primer build](https://docs.expo.dev/build/setup/)
- [`eas init`](https://docs.expo.dev/eas/cli/)

## Antes de empezar

- [Node.js LTS](https://nodejs.org/).
- [pnpm](https://pnpm.io/installation). Este repo tiene `pnpm-lock.yaml`; los comandos de abajo usan pnpm.
- Una cuenta en [expo.dev](https://expo.dev/). El alta es gratuita.

`eas-cli` se instala una vez por máquina. El resto se repite en cada proyecto.

## 1. Crear el proyecto en Expo

Entra en [expo.dev](https://expo.dev/) e inicia sesión. Crea un proyecto nuevo desde el panel y copia su **Project ID**. Es un UUID, por ejemplo `106ffa2f-8950-4012-9eb1-b767f76ab684`.

Ese identificador es el que usa el paso 5. Sin él, el código local no queda asociado a la cuenta.

## 2. Instalar EAS CLI

EAS CLI es el cliente de los servicios de Expo (builds, envíos, actualizaciones). Instálalo una vez:

```bash
npm install --global eas-cli
```

Con pnpm, el equivalente es `pnpm add --global eas-cli`. Comprueba la sesión antes de seguir:

```bash
eas login
eas whoami
```

`eas whoami` imprime la cuenta con la que vas a vincular el proyecto. Si la cuenta no es la dueña del proyecto del panel, `eas init` falla.

## 3. Crear el proyecto local

Desde la carpeta donde quieras el repo, sustituye `<nombre>` por el slug del proyecto (en este tutorial, `macrozone-tutorial`):

```bash
pnpm create expo-app@latest <nombre> --template default@sdk-58
cd <nombre>
```

`pnpm create expo-app` es el comando de pnpm. Durante la transición a SDK 58, `create-expo-app` sin `--template` genera un proyecto **SDK 57**. La plantilla `default@sdk-58` es la que coincide con este repo (`expo` `~58.0.24`).

El comando crea la app, instala dependencias y deja la navegación en `src/app/`. Cada archivo de esa carpeta es una pantalla. Los layouts viven en los `_layout.tsx`.

Entra en la carpeta del proyecto antes del paso 5. `eas init` escribe en el `app.json` del directorio actual.

## 4. Instalar dependencias si hace falta

`create-expo-app` ya ejecuta el install. Si clonas el repo en otra máquina, instala desde la raíz:

```bash
pnpm install
```

Para añadir librerías de Expo más adelante, usa `pnpm expo install <paquete>`. Ese comando elige la versión compatible con el SDK. `pnpm add` no lo hace.

### Después de instalar una librería

Cada vez que instales, actualices o quites un paquete, para el servidor de Metro con `Ctrl+C` y arráncalo limpiando la caché:

```bash
pnpm start --clear
```

pnpm puede cambiar versiones de otras dependencias al instalar y vuelve a crear los enlaces de `node_modules`. Metro guarda en caché el índice de archivos antiguo y sigue buscando las rutas que ya no existen. El síntoma típico en el teléfono es una pantalla roja con `The development server returned response error code: 404` y `Unable to resolve module ./node_modules/expo-router/entry`.

Si la librería trae código nativo y no viene incluida en Expo Go, además hace falta un development build nuevo.

## 5. Vincular el código con el proyecto de Expo

Dentro de la carpeta del proyecto, pasa el Project ID del paso 1:

```bash
eas init --id <project-id>
```

`eas init` crea o vincula un proyecto de EAS. Con `--id` no crea otro: enlaza esta carpeta con el proyecto que ya existe en el panel.

En este tutorial el comando es:

```bash
eas init --id 106ffa2f-8950-4012-9eb1-b767f76ab684
```

Al terminar, `app.json` queda con el dueño y el id:

```json
{
  "expo": {
    "owner": "hirammahandi",
    "extra": {
      "eas": {
        "projectId": "106ffa2f-8950-4012-9eb1-b767f76ab684"
      }
    }
  }
}
```

`owner` es la cuenta de Expo. `projectId` es el UUID del panel. Esos dos campos son los que identifican la app en EAS.

## 6. Arrancar la app

```bash
pnpm start
```

Ese script ejecuta `expo start`. En el terminal aparecen las opciones para abrir la app:

- Android: emulador o dispositivo.
- iOS: simulador (en macOS).
- Web: `pnpm web`, que ejecuta `expo start --web`.
- [Expo Go](https://expo.dev/go) para probar módulos que ya vienen en esa app.

Un proyecto SDK 58 en un teléfono físico se abre con un development build. Expo Go, en este periodo de transición, abre proyectos SDK 57. El emulador y la web sirven para desarrollar este tutorial sin ese build.

Las carpetas `ios/` y `android/` no se crean a mano. Expo las genera cuando hace falta un build nativo. El comportamiento nativo se configura en `app.json` y en los config plugins.

## Checklist del siguiente proyecto

1. Crear el proyecto en [expo.dev](https://expo.dev/) y copiar el Project ID.
2. Tener `eas-cli` instalado y la sesión abierta (`eas whoami`).
3. `pnpm create expo-app@latest <nombre> --template default@sdk-58`.
4. `cd <nombre>`.
5. `eas init --id <project-id>`.
6. `pnpm start`.
