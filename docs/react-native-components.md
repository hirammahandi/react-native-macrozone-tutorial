# StyleSheet, Text, View, Platform, Device, Stack, Slot y Tabs

Estos nombres salen de tres paquetes. `StyleSheet`, `Text`, `View` y `Platform` los exporta **`react-native`** (`0.88.1`). `Device` lo exporta **`expo-device`** (`~58.0.5`, Expo SDK 58). `Stack`, `Slot` y `Tabs` los exporta **`expo-router`** (`~58.0.31`, Expo SDK 58). Ni React ni Next.js incluyen estos módulos. Expo arranca la app; la interfaz se construye con los componentes núcleo de React Native, `expo-device` aporta datos del aparato y `expo-router` decide qué pantalla está delante.

`Platform` y `Device` no son componentes. `Platform` dice en qué sistema se ejecuta el código. `Device` describe el aparato físico. `Stack`, `Slot` y `Tabs` sí son componentes: van en un `_layout.tsx` y marcan dónde y cómo se pinta la pantalla activa.

```tsx
import * as Device from "expo-device";
import { Slot, Stack, Tabs } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";
```

React Native no pinta HTML. Cada componente se traduce a la vista nativa de la plataforma. En web, este repo incluye `react-native-web`, que hace esa traducción hacia el DOM cuando se ejecuta `expo start --web`.

Referencia oficial (docs 0.88, la misma línea que `react-native@0.88.1`):

- [Core Components y análogos web](https://reactnative.dev/docs/intro-react-native-components)
- [View](https://reactnative.dev/docs/view)
- [ScrollView](https://reactnative.dev/docs/scrollview)
- [Text](https://reactnative.dev/docs/text)
- [StyleSheet](https://reactnative.dev/docs/stylesheet)
- [Style](https://reactnative.dev/docs/style)
- [Platform](https://reactnative.dev/docs/platform)
- [expo-device (SDK 58)](https://docs.expo.dev/versions/v58.0.0/sdk/device/)
- [Stack (SDK 58)](https://docs.expo.dev/versions/v58.0.0/sdk/router/stack/)
- [Slot (SDK 58)](https://docs.expo.dev/versions/v58.0.0/sdk/router/#slot)
- [Tabs](https://docs.expo.dev/router/advanced/tabs/)
- [Layouts de navegación](https://docs.expo.dev/router/basics/navigation-layouts/)

## Qué renderiza cada uno

| Nombre | Qué es | Android | iOS | Homólogo en React / Next.js |
| --- | --- | --- | --- | --- |
| `View` | Contenedor de layout | `ViewGroup` | `UIView` | Un `<div>` que no hace scroll |
| `ScrollView` | Contenedor que se desplaza | `ScrollView` | `UIScrollView` | Un `<div>` con `overflow: auto` |
| `Text` | Nodo de texto | `TextView` | `UITextView` | `<p>` (un fragmento inline anidado se parece más a `<span>`) |
| `StyleSheet` | API de estilos. No renderiza nada | — | — | Un módulo CSS, o un objeto de estilos aplicado con `style` / `className` |
| `Platform` | Módulo del sistema en ejecución. No renderiza nada | — | — | No hay módulo equivalente. En el navegador se lee `navigator.userAgent` |
| `Device` | Datos del aparato físico (`expo-device`). No renderiza nada | — | — | No hay módulo equivalente. En Chromium, User-Agent Client Hints |
| `Stack` | Navegador de pantallas en pila (`expo-router`) | stack nativo | stack nativo | `app/layout.tsx` de Next.js, más el historial del navegador |
| `Slot` | Hueco de la ruta activa, sin navegador (`expo-router`) | — | — | `{children}` en un `layout.tsx` de Next.js |
| `Tabs` | Navegador de pestañas hecho en JavaScript (`expo-router`) | barra dibujada por JS | barra dibujada por JS | No hay. Un `layout.tsx` con un `<nav>` de `<Link>` y `{children}` |

## View

`View` es el contenedor base de la interfaz. Sirve para agrupar otros componentes y controlar su layout con flexbox, estilos, algo de manejo táctil y accesibilidad.

En nativo se mapea a la vista de la plataforma: `UIView` en iOS y `android.view` / `ViewGroup` en Android. En web, el análogo es un `<div>` que no hace scroll. En el tutorial oficial se describe como el equivalente de `<div>` o `<span>`: un cajón de layout, sin significado de texto.

En `src/app/index.tsx` el `View` ocupa toda la pantalla (`flex: 1`) y centra a sus hijos:

```tsx
<View style={styles.container}>
  <Text>Welcome to MacroZone!</Text>
  <Text style={styles.platformText}>Running on: {Platform.OS}</Text>
  <Text>Device Model: {Device.modelName}</Text>
  <Text>Device Brand: {Device.brand}</Text>
  <Text>OS Version: {Device.osVersion}</Text>
</View>
```

En una página de Next.js ese contenedor sería un `<div>`:

```tsx
<div className={styles.container}>
  <p>Hello React Native!</p>
</div>
```

`View` ya participa en flexbox. En CSS de navegador hay que declarar `display: flex` en el `div` para obtener el mismo eje de alineación (`alignItems`, `justifyContent`).

## Text

`Text` es el componente que muestra texto. Admite estilos, anidación y eventos táctiles.

Cualquier string visible va dentro de un `<Text>`. Un nodo de texto suelto como hijo de un `View` no es válido. En Next.js un string puede vivir directo dentro de un `<div>`, un `<p>` o un `<span>`; aquí el nodo de texto tiene que ser un `Text`.

Dos comportamientos que importan al maquetar:

- **Dentro de otro `Text`, el texto fluye en línea.** Los hijos se leen como una sola frase y, si no caben, parten el renglón como un solo párrafo. El estilo tipográfico se hereda: un `Text` interno recibe `fontWeight: "bold"` del padre y puede sumar `color: "red"`.
- **Como hijo de un `View`, cada `Text` es su propio bloque.** Dos `<Text>` seguidos se apilan en vertical, cada uno con su propio flujo de línea.

El análogo de la tabla oficial es `<p>`. Cuando el `Text` va anidado para marcar una palabra (negrita, color), el papel es el de un `<span>` dentro de ese párrafo.

```tsx
<Text style={{ fontWeight: "bold" }}>
  I am bold
  <Text style={{ color: "red" }}> and red</Text>
</Text>
```

En Next.js:

```tsx
<p style={{ fontWeight: "bold" }}>
  I am bold
  <span style={{ color: "red" }}> and red</span>
</p>
```

## StyleSheet

`StyleSheet` no es un componente y no pinta nada en pantalla. Es la API con la que se declaran los estilos de `View`, `Text` y el resto de componentes núcleo.

Todos aceptan una prop `style`. El valor puede ser un objeto JavaScript o un array de estilos; en un array, el último gana. Los nombres siguen la idea de CSS, escritos en camelCase: `backgroundColor` en lugar de `background-color`.

`StyleSheet.create` agrupa esas definiciones en un solo objeto con nombre. La documentación lo describe como una función de identidad: devuelve los mismos estilos. El beneficio práctico es la comprobación de tipos contra las propiedades nativas (`ViewStyle`, `TextStyle`, `ImageStyle`) y las sugerencias del editor. Separar los estilos del JSX también deja el render más legible y permite reutilizar un estilo por nombre.

En `src/app/index.tsx`:

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
```

En Next.js el mismo papel lo cumple una hoja de estilos, no un componente:

- **CSS Module** (`index.module.css`): se importa `styles` y se aplica con `className={styles.container}`.
- **Objeto de estilos en línea**: el mismo objeto JavaScript, pasado a `style={styles.container}` en un `<div>`. Hace falta añadir `display: "flex"` porque el `div` no es flex por defecto. `flex: 1` solo estira el nodo si el padre tiene altura; en una página suele hacer falta algo como `minHeight: "100vh"`.

`StyleSheet.create` se acerca más a un CSS Module (clases con nombre, reutilizables, fuera del JSX) que a una etiqueta `<style>`.

### Varios estilos en un array

La prop `style` acepta un array. React Native combina los estilos de izquierda a derecha. Si dos estilos definen la misma propiedad, gana el que va más a la derecha.

En `src/components/macro-card.components.tsx`:

```tsx
<View style={[styles.card, { borderLeftColor: color }]}>
```

El array junta dos cosas:

- **`styles.card`**: la base fija, definida en `StyleSheet.create`. Fondo, `borderRadius`, `padding`, ancho y `borderLeftWidth: 4`.
- **`{ borderLeftColor: color }`**: un objeto en línea con el color que llega por props. Cada `MacroCard` pinta su borde izquierdo de un color distinto.

`StyleSheet.create` se ejecuta una vez, al cargar el módulo, y no conoce las props. Un valor que cambia en cada render va en un objeto aparte, al final del array. La base se queda en `StyleSheet.create` y solo lo variable va en línea.

El orden importa. Con los mismos estilos, cada array da un resultado distinto:

```tsx
<Text style={[styles.bigBlue, styles.red]} />  // rojo: red va después
<Text style={[styles.red, styles.bigBlue]} />  // azul: bigBlue va después
```

Un valor falso dentro del array (`false`, `null`, `undefined`) se ignora. Eso permite aplicar un estilo solo si se cumple una condición:

```tsx
<View style={[styles.card, isSelected && styles.cardSelected]} />
```

Si `isSelected` es `false`, el array queda `[styles.card, false]` y solo se aplica la base.

`StyleSheet` tiene dos utilidades para lo mismo fuera del JSX:

- **`StyleSheet.compose(a, b)`** combina dos estilos; `b` gana sobre `a`. Si uno de los dos es falso, devuelve el otro tal cual.
- **`StyleSheet.flatten([a, b])`** convierte el array en un solo objeto. Sirve para leer el resultado final, por ejemplo qué color quedó.

En Next.js, el equivalente de un array de estilos es combinar clases: `className={[styles.card, isSelected && styles.selected].filter(Boolean).join(" ")}`, o una utilidad como `clsx`. Para el valor dinámico, `style={{ borderLeftColor: color }}` en el `<div>`. Hay una diferencia: en CSS, a igual especificidad, gana la regla que aparece más tarde en la hoja de estilos, no el orden en el que se escriben las clases en `className`. En React Native el orden del array es lo que decide.

### Qué unidad tienen los números

Los números de los estilos no llevan unidad. La documentación de React Native dice que todas las dimensiones son píxeles independientes de la densidad: `dp` en Android, puntos (`pt`) en iOS. No son píxeles físicos de la pantalla ni `rem`.

En `src/components/macro-card.components.tsx`:

```tsx
card: {
  borderRadius: 12,
  padding: 16,
  width: "47%",
  borderLeftWidth: 4,
},
```

`borderLeftWidth: 4` es un borde de 4 unidades independientes de la densidad. El sistema lo multiplica por la densidad de la pantalla al pintarlo, así que ocupa lo mismo a la vista en un móvil de gama baja y en uno con pantalla muy densa:

| Pantalla | Densidad (`PixelRatio.get()`) | `borderLeftWidth: 4` en píxeles físicos |
| --- | --- | --- |
| Android `mdpi` | 1 | 4 |
| iPhone con pantalla Retina | 2 | 8 |
| iPhone Pro / Android `xxhdpi` | 3 | 12 |

En web, con `react-native-web`, el número se convierte en `px` de CSS: `borderLeftWidth: 4` es `border-left-width: 4px`. El `px` de CSS ya es una unidad independiente de la densidad, así que la equivalencia es directa: 1 unidad de React Native = 1 `px` de CSS.

#### Otros valores

- **Porcentajes**: un string con `%`, como `width: "47%"`. Es relativo al padre, que necesita tener un tamaño definido. Dos tarjetas al 47% caben en una fila y dejan hueco entre ellas.
- **`rem` y `em`**: no existen. No hay un tamaño de fuente raíz del que colgar. Si hace falta escalar con la fuente, se calcula en JavaScript.
- **`fontSize`**: también es un número sin unidad, pero escala con el tamaño de texto que el usuario elige en los ajustes del sistema. `PixelRatio.getFontScale()` devuelve ese factor; un `fontSize: 14` con factor `1.3` se ve como 18,2. `allowFontScaling={false}` en un `Text` lo desactiva. Es lo más parecido a cómo un `rem` respeta el tamaño de fuente del navegador.
- **`StyleSheet.hairlineWidth`**: la línea más fina que el sistema dibuja nítida, normalmente un píxel físico. Sirve para separadores de 1 píxel real en cualquier densidad.

`PixelRatio.get()` devuelve la densidad del dispositivo y `PixelRatio.getPixelSizeForLayoutSize(n)` convierte unidades a píxeles físicos, útil para elegir el tamaño de una imagen.

En Next.js lo más parecido es escribir `px` en CSS. Un diseño en Figma con un borde de 4 se escribe `borderLeftWidth: 4` en React Native y `border-left-width: 4px` en web. Para pasar de `rem` a React Native, se multiplica por 16 (la fuente raíz por defecto del navegador): `1rem` = `16`.

## Platform

`Platform` es un módulo de `react-native` para ramificar código según el sistema que ejecuta la app. No renderiza vistas: el `Text` de la línea 8 solo imprime el valor que el módulo ya conoce.

```tsx
<Text style={styles.platformText}>Running on: {Platform.OS}</Text>
```

`Platform.OS` es un string con el sistema actual. La referencia de React Native lo tipa como `'ios' | 'android'`. En este proyecto, al correr en el navegador, `react-native-web` fija ese valor en `'web'`. La pantalla muestra entonces una de estas tres frases:

- `Running on: ios` en iPhone o simulador de iOS
- `Running on: android` en un dispositivo o emulador Android
- `Running on: web` con `expo start --web`

El mismo módulo expone dos piezas más, útiles cuando el `if` por string se queda corto:

- **`Platform.select`** devuelve el valor de la clave que coincide con el sistema activo. Las claves `ios` y `android` tienen prioridad; si no están, usa `native` y después `default` (en la documentación, `default` cubre el resto de plataformas, por ejemplo web). Sirve dentro de `StyleSheet.create` para cambiar un color, un margen o incluso un componente entero.
- **`Platform.Version`** es la versión del sistema operativo: un `number` en Android y un `string` en iOS.

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: { backgroundColor: "red" },
      android: { backgroundColor: "green" },
      default: { backgroundColor: "blue" },
    }),
  },
});
```

En Next.js no existe este módulo. La página corre en el navegador (o en el servidor), así que el dato parecido es el sistema del usuario, leído en el cliente con `navigator.userAgent` o `navigator.userAgentData?.platform` (`"Windows"`, `"macOS"`, `"Android"`, etc.). Eso describe el ordenador o el teléfono de quien abre la web, que es otra pregunta distinta de `Platform.OS`, cuyo valor nombra el runtime de React Native (`ios`, `android` o `web`). Para elegir un valor por sistema, el homólogo de `Platform.select` es un condicional o un objeto indexado por esa cadena.

## Device

`Device` es el módulo de `expo-device`. Lee datos del aparato físico —modelo, marca, versión del sistema— y los expone como constantes. No renderiza vistas: el `Text` de la línea 9 imprime un valor que el módulo ya resolvió.

```tsx
import * as Device from "expo-device";

<Text>Device Model: {Device.modelName}</Text>
```

`Device.modelName` es `string | null`. Es el nombre con el que una persona se refiere al aparato, no el identificador interno. Ese identificador es `Device.modelId` (`"iPhone7,2"` en iOS; siempre `null` en Android y en web). Si el nombre no se puede determinar, `modelName` es `null`.

Ejemplos de la documentación de Expo SDK 58:

- Android: `"Pixel 2"`
- iOS: `"iPhone XS Max"`
- Web: `"iPhone"`, o `null`

La misma pantalla lee otras dos constantes:

- **`Device.brand`** es la marca visible para quien compra el aparato (`string | null`). En Android, `"google"` o `"xiaomi"`. En iOS, `"Apple"`. En web es siempre `null`. La referencia de SDK 58 marca Android e iOS como plataformas de esta constante.
- **`Device.osVersion`** es la versión del sistema en texto legible (`string | null`). No siempre trae tres números separados por puntos. Android: `"4.0.3"`. iOS: `"12.3.1"`. Web: `"11.0"` o `"8.1.0"`. `Platform.Version` responde a la misma pregunta desde `react-native`: un `number` en Android y un `string` en iOS. `Device.osVersion` deja la respuesta en un string e incluye la web.

`Platform.OS` nombra el runtime que dibuja la app (`ios`, `android` o `web`). `Device.modelName` nombra el aparato.

En Next.js no existe `expo-device`. El dato parecido está en el navegador, en User-Agent Client Hints, y solo en navegadores Chromium (Safari no expone `navigator.userAgentData`):

```ts
const hints = await navigator.userAgentData?.getHighEntropyValues([
  "model",
  "platformVersion",
]);
```

`hints.model` se acerca a `Device.modelName` y `hints.platformVersion` a `Device.osVersion`. Muchos navegadores dejan `model` vacío: el nombre comercial del teléfono no está disponible con la misma fiabilidad que en nativo. `Device.brand` no tiene un campo equivalente en esa API.

## Stack

`Stack` es el componente de `expo-router` que monta un navegador en pila. En `src/app/_layout.tsx` es el layout raíz: se pinta antes que cualquier pantalla de `src/app/` y define cómo se apilan las rutas de esa carpeta.

```tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
```

`screenOptions` aplica esas opciones a todas las pantallas. En `src/app/_layout.tsx` configuran la cabecera nativa:

```tsx
<Stack
  screenOptions={{
    // headerShown: false,
    // headerTitle: "MacroZone",
    // headerTitleStyle: { color: "#1a1a2e", fontSize: 20 },
    headerStyle: {
      backgroundColor: colors.header,
    },
    headerTintColor: colors.white,
  }}
>
```

- **`headerShown`** muestra u oculta la cabecera. Por defecto es `true`. `false` la quita. En `screenOptions` está comentado. La pantalla `index` la oculta con `<Stack.Header hidden />`, que es la misma orden escrita como componente.
- **`headerTitle`** es el texto de la cabecera, un string o una función que devuelve un nodo. Si no se define, usa `title` y, si tampoco hay `title`, el nombre de la ruta. `"MacroZone"` fijaría ese texto en todas las pantallas. `meals` define `title: "Meals"`, y ese valor es el que acaba en la cabecera.
- **`headerTitleStyle`** es el estilo del título. Solo admite `fontFamily`, `fontSize`, `fontWeight` y `color`. En este layout está comentado, así que el título no tiene un color propio.
- **`headerStyle`** es el estilo del fondo de la cabecera. Solo admite `backgroundColor`. Aquí es `colors.header` (`#242444`).
- **`headerTintColor`** es el tinte de la cabecera: el color del botón atrás y, si el título no tiene `color` propio, también el del título. Aquí es `colors.white`, así que atrás y título quedan blancos.

### Qué pinta cada pieza

Estos componentes no arman un árbol de vistas. `Stack` es el único que renderiza UI: un navegador de pila nativo. `Stack.Screen`, `Stack.Header` y `Stack.Title` son configuración. Expo Router los lee y los traduce a opciones de esa cabecera nativa. Por eso el JSX no coincide con lo que se ve en pantalla.

En `src/app/_layout.tsx` la pantalla de inicio está escrita así:

```tsx
<Stack.Screen name="index">
  <Stack.Header hidden />
  <Stack.Title>Home</Stack.Title>
</Stack.Screen>
```

En React, `Stack.Header` y `Stack.Title` son hermanos. Los dos son hijos de `Stack.Screen`. `Stack.Title` no es hijo de `Stack.Header`, y `Stack.Header` no recibe `children`. La [documentación de `Stack.Header`](https://docs.expo.dev/versions/v58.0.0/sdk/router/stack/#stackheader) reserva `children` para otro caso: `asChild`, cuando se sustituye la cabecera entera por un componente propio. En el uso normal el header no envuelve nada.

| Componente | En el código | En la pantalla |
| --- | --- | --- |
| `Stack` | Envuelve las pantallas | El navegador nativo. Cada ruta es una pantalla de esa pila |
| `Stack.Screen` | Nombra la ruta y agrupa su configuración | No pinta la página. La página es el archivo (`index.tsx`, `meals.tsx`) |
| `Stack.Header` | Hermano de `Stack.Title`. Sin hijos | La barra nativa de esa pantalla: fondo, blur, sombra, y si se muestra |
| `Stack.Title` | Hermano de `Stack.Header`. El texto va en sus `children` | El título escrito dentro de esa misma barra |

La barra nativa es una sola pieza del sistema (la navigation bar). El título, el botón atrás y el fondo viven dentro de ella. `Stack.Header` dice cómo es esa barra. `Stack.Title` escribe el texto que la barra muestra. Las dos órdenes llegan al mismo sitio.

```text
JSX                              barra nativa
Stack.Screen name="index"
  Stack.Header                   ┌─────────────────────┐
  Stack.Title "Home"             │  atrás    Home      │
                                 └─────────────────────┘
                                 contenido de index.tsx
```

`hidden` en `Stack.Header` no oculta un hijo de React. La referencia dice que, con `hidden`, la cabecera no se renderiza. Como el título está dibujado dentro de esa cabecera, desaparece con ella. `Stack.Title` sigue en el árbol y sigue guardando `"Home"`; no tiene barra donde pintarlo.

`meals` hace lo mismo con la otra API. `options={{ title: "Meals" }}` escribe el título de esa pantalla. No hay `<Stack.Title>` porque `title` y `Stack.Title` acaban en el mismo campo de la cabecera. Si esa pantalla llevara `<Stack.Header hidden />`, `"Meals"` también se ocultaría.

`Stack.Title` puede ir en el layout, dentro de `Stack.Screen`, o dentro del propio archivo de la pantalla, al lado del contenido. En los dos sitios configura la cabecera de esa ruta. No se vuelve un `Text` dentro de la página. Si hubiera dos `Stack.Title` para la misma pantalla, vale el último que se renderice.

### Si no se modifican

Sin `screenOptions`, la cabecera usa el tema de React Navigation. En `app.json`, `userInterfaceStyle` es `"automatic"`, así que el tema sigue el claro u oscuro del sistema. La fuente es la del sistema.

| Pieza | Claro | Oscuro |
| --- | --- | --- |
| Fondo (`colors.card`) | `rgb(255, 255, 255)` | `rgb(18, 18, 18)` |
| Título (`colors.text`) | `rgb(28, 28, 30)` | `rgb(229, 229, 231)` |
| Botón atrás (`colors.primary`) | `rgb(0, 122, 255)` | `rgb(10, 132, 255)` |
| Borde (`colors.border`) | `rgb(216, 216, 216)` | `rgb(39, 39, 41)` |

Además:

- La cabecera se muestra y no es transparente: ocupa su sitio encima del contenido.
- El título es el `title` de la pantalla o, si no hay, el nombre de la ruta.
- En Android el título va a la izquierda. En iOS va centrado.
- El borde inferior (iOS) y la sombra (Android) se ven.

## Slot

`Slot` sale de `expo-router`. Es el hueco donde un layout pinta la ruta activa, sin navegador. La referencia de SDK 58 lo describe así: renderiza el contenido seleccionado.

Un `_layout.tsx` no muestra sus páginas por sí solo. Tiene que renderizar algo que les deje sitio: un navegador (`Stack`, `Tabs`, `NativeTabs`, `Drawer`) o un `Slot`. Si no renderiza ninguno, las rutas hijas no aparecen; solo se ve lo que el layout pinte por su cuenta.

`Slot` es el equivalente directo de `{children}` en un layout de React o Next.js. Cambia la forma: el layout no recibe una prop `children`. Pone `<Slot />` donde va la página, y el router decide qué ruta se pinta ahí.

```tsx
// Next.js
export default function Layout({ children }) {
  return <>{children}</>;
}

// Expo Router
import { Slot } from "expo-router";

export default function Layout() {
  return <Slot />;
}
```

Al navegar, `Slot` sustituye la página. No hay pila, no hay botón atrás y no hay transición. Encaja cuando un grupo de rutas comparte algo alrededor (un header, un footer, un provider) y no necesita navegación propia:

```tsx
export default function Layout() {
  return (
    <>
      <Header />
      <Slot />
      <Footer />
    </>
  );
}
```

### Slot frente a un navegador

Un navegador también reserva el hueco de la página. Es `{children}` con lógica de navegación encima:

| | `Slot` | Navegador (`Stack`, `Tabs`, …) |
| --- | --- | --- |
| Pantallas montadas | Solo la activa | Varias. `Stack` guarda las de debajo; `Tabs`, las pestañas visitadas |
| Interfaz propia | Ninguna | Cabecera con atrás (`Stack`), barra de pestañas (`Tabs`) |
| Al navegar | Reemplaza la página | Apila, cambia de pestaña, anima, admite gestos |

Si solo hace falta un hueco para la página, `Slot`. Si hace falta pila, pestañas o menú lateral, el navegador correspondiente, que también hace de hueco.

## Tabs

`Tabs` sale de `expo-router`. Es un navegador de pestañas hecho en JavaScript: pinta una barra (abajo, por defecto) con un botón por ruta. Cada ruta de la carpeta es una pestaña, y la de `index` es la seleccionada al entrar.

Para la barra nativa de Android e iOS existe otro componente, `NativeTabs`, que se importa de `expo-router/native-tabs`. `Tabs` dibuja la barra con componentes de React Native, así que se puede personalizar más.

En este proyecto vive en `src/app/(tabs)/_layout.tsx`:

```tsx
import { colors } from "@/styles/global";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.surface,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-meals"
        options={{
          title: "Add Meal",
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: "All Meals",
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

Igual que en `Stack`, `screenOptions` aplica a todas las pestañas y `options` a una sola:

- **`headerShown`**: cada pestaña trae su propia cabecera arriba. `false` la quita en todas.
- **`tabBarStyle`**: estilo de la barra. Aquí, fondo `colors.background` y la línea superior en `colors.surface`.
- **`tabBarActiveTintColor`**: color del icono y la etiqueta de la pestaña activa (`colors.primary`).
- **`tabBarInactiveTintColor`**: color del icono y la etiqueta del resto (`colors.textSecondary`).
- **`title`**: la etiqueta del botón de la pestaña.
- **`tabBarIcon`**: función que devuelve el icono. Recibe `{ focused, color, size }`. `color` ya llega resuelto con el tinte activo o inactivo, así que pasarlo al icono basta para que cambie al seleccionarlo. Los iconos salen de `@react-native-vector-icons/ionicons`.

`name` sigue la misma regla que en `Stack.Screen`: es el archivo sin extensión. `add-meals.tsx` es `name="add-meals"`. Si no coincide, el `Tabs.Screen` no configura nada y la pestaña de ese archivo aparece con las opciones por defecto: su nombre de ruta como etiqueta y sin icono.

El orden de los botones es el orden de los `Tabs.Screen`. Para que una ruta del grupo exista sin botón en la barra, se pasa `options={{ href: null }}`.

Cambiar de pestaña no apila. La pestaña anterior queda montada con su estado, y volver a pulsarla la muestra tal como estaba. Para avanzar dentro de una pestaña (de la lista de comidas al detalle de una) se anida un `Stack` en la carpeta de esa pestaña.

En Next.js no hay un componente de pestañas. Lo parecido es un `layout.tsx` que pinta un `<nav>` con varios `<Link>` y `{children}` debajo. Ese `<nav>` es HTML propio: los colores, el estado activo y los iconos se programan a mano. Al cambiar de enlace, la página anterior se desmonta.

## ScrollView

`ScrollView` sale de `react-native`. Es un contenedor que se desplaza. `View` no lo hace.

En `src/app/meals.tsx` el `ScrollView` ocupa la pantalla (`flex: 1` de `globalStyles.container`). Lo que no cabe se mueve en vertical.

```tsx
<ScrollView style={globalStyles.container}>
  <Text style={globalStyles.title}>All Meals</Text>
</ScrollView>
```

Android lo pinta como `ScrollView`, iOS como `UIScrollView`. En web es un `<div>` con scroll. El eje por defecto es vertical; la prop `horizontal` lo pone en horizontal.

`style` pinta el marco (tamaño, fondo). `contentContainerStyle` pinta el bloque de dentro, el que se desplaza.

En Next.js el homólogo es `<div style={{ overflow: "auto" }}>`. Si quien crece es la página entera, el navegador ya desplaza el documento y ese `div` sobra.

## Rutas en `src/app`

Crear una página es crear un archivo en `src/app/`. El nombre del archivo es la URL. El archivo exporta un componente por defecto: esa es la pantalla.

| Archivo | Ruta |
| --- | --- |
| `src/app/index.tsx` | `/` |
| `src/app/meals.tsx` | `/meals` |
| `src/app/_layout.tsx` | no es una página |

`index.tsx` es la ruta por defecto de la carpeta donde está. No suma un tramo a la URL.

`src/app/index.tsx` es la raíz de la app: `/`, la pantalla que aparece al abrirla. En una carpeta anidada, el `index` es la raíz de esa carpeta. `src/app/meals/index.tsx` sería `/meals`, la pantalla inicial de comidas.

Cualquier otro nombre suma el suyo: `meals.tsx` es `/meals`. Un archivo fuera de `src/app` (un componente, un estilo) no tiene ruta.

`_layout.tsx` se pinta antes de la página y dice cómo se relacionan. Aquí es un `Stack`.

```tsx
<Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="index" />
  <Stack.Screen name="meals" />
</Stack>
```

`name` es el archivo sin extensión. Esos `Stack.Screen` no crean `/` ni `/meals`: los archivos ya lo hicieron. Sirven para configurar esa pantalla. `screenOptions` aplica a todas; en este layout esconde la cabecera.

Al abrir `/meals`, esa pantalla queda encima de `/`. En Android entra desde arriba; en iOS, desde la derecha. Atrás vuelve a `/`.

### Una ruta anidada: `/meals/chicken`

`/meals/chicken` es el archivo `src/app/meals/chicken.tsx`. Un archivo y una carpeta no pueden llamarse `meals` a la vez, así que `src/app/meals.tsx` pasa a ser el `index` de esa carpeta.

```text
src/app/
  _layout.tsx
  index.tsx                 → /
  meals/
    index.tsx               → /meals
    chicken.tsx             → /meals/chicken
```

`chicken.tsx` exporta un componente por defecto. El nombre del archivo es el último tramo de la URL.

En el `Stack` raíz, `name="meals"` deja de coincidir. El `name` pasa a ser la ruta del archivo dentro de `src/app`, sin extensión:

```tsx
<Stack.Screen name="index" />
<Stack.Screen name="meals/index" />
<Stack.Screen name="meals/chicken" />
```

Esos `Stack.Screen` siguen sin crear la ruta. Si no hay opciones por pantalla, se pueden quitar: los archivos ya entran en el `Stack`.

En Next.js la página es un `page.tsx` dentro de una carpeta: `app/page.tsx` es `/`, `app/meals/page.tsx` es `/meals` y `app/meals/chicken/page.tsx` es `/meals/chicken`. El layout es `app/layout.tsx` y pinta `{children}`. Aquí el archivo es la página, así que no hace falta una carpeta `chicken` con un `page.tsx` dentro. No hay `Stack.Screen`.

### Una ruta dinámica: `/meals/chicken`, `/meals/beef`, …

Los corchetes en el nombre del archivo marcan el tramo que cambia. `src/app/meals/[meal].tsx` responde a `/meals/chicken`, `/meals/beef` y cualquier otro valor. Sigue valiendo la regla anterior: `meals.tsx` pasa a `meals/index.tsx`.

```text
src/app/
  _layout.tsx
  index.tsx                 → /
  meals/
    index.tsx               → /meals
    [meal].tsx              → /meals/chicken, /meals/beef, …
```

El nombre dentro de los corchetes es el parámetro. Se lee con `useLocalSearchParams` de `expo-router`:

```tsx
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function MealScreen() {
  const { meal } = useLocalSearchParams<{ meal: string }>();

  return <Text>{meal}</Text>;
}
```

En `/meals/chicken`, `meal` vale `"chicken"`.

En el `Stack` raíz el `name` lleva los corchetes:

```tsx
<Stack.Screen name="meals/[meal]" />
```

En Next.js el equivalente es `app/meals/[meal]/page.tsx`, y el valor llega en `params.meal`. Aquí `[meal].tsx` ya es la página.

### Un grupo de rutas: `(tabs)`

Una carpeta con el nombre entre paréntesis es un grupo de rutas. No es una página y no suma un tramo a la URL. Sirve para agrupar rutas y darles un `_layout.tsx` propio.

```text
src/app/
  _layout.tsx               layout raíz (Stack)
  (tabs)/
    _layout.tsx             layout del grupo (Tabs)
    index.tsx               → /
    meals.tsx               → /meals
    add-meals.tsx           → /add-meals
```

`(tabs)/meals.tsx` es `/meals`, no `/tabs/meals`. Y `(tabs)/index.tsx` es `/`: el `index` del grupo pasa a ser la pantalla inicial de la app.

El nombre `(tabs)` es una convención. Los paréntesis lo hacen grupo. La barra de pestañas sale de `(tabs)/_layout.tsx`, que devuelve un `Tabs` (ver la sección [Tabs](#tabs)).

Sin ese archivo, el grupo no tiene navegador propio y sus rutas caen en el layout del padre.

#### El layout raíz solo declara `(tabs)`

Cada navegador gestiona solo las rutas de su carpeta, un nivel hacia abajo. Un grupo con `_layout.tsx` cuenta como una única ruta para el navegador del padre. Por eso el `Stack` de `src/app/_layout.tsx` no ve `index`, `meals` ni `add-meals`. Ve una sola pantalla, `(tabs)`, y dentro de ella está el `Tabs`.

```text
Stack                       src/app/_layout.tsx
└─ (tabs)                   una pantalla del Stack
   └─ Tabs                  src/app/(tabs)/_layout.tsx
      ├─ index              /
      ├─ add-meals          /add-meals
      └─ meals              /meals
```

El layout raíz queda así:

```tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
```

`name="(tabs)"` lleva los paréntesis: es el nombre de la carpeta. `headerShown: false` quita la cabecera del `Stack` encima de las pestañas. Sin esa opción se verían dos barras: la del `Stack` arriba, con el título `(tabs)`, y la de cada pestaña.

Antes de mover los archivos al grupo, el `Stack` raíz tenía un `Stack.Screen` por pantalla:

```tsx
<Stack.Screen name="index" options={{ headerShown: false, title: "Home" }} />
<Stack.Screen name="meals" options={{ title: "Meals" }} />
<Stack.Screen name="add-meals" options={{ title: "Add Meals" }} />
```

Con las pantallas dentro de `(tabs)`, esos nombres ya no son hijos del `Stack`. Ese `Stack.Screen` no encuentra su ruta, no configura nada y Expo Router avisa en desarrollo de que esa ruta no existe. La configuración de cada pantalla pasa a `Tabs.Screen`, en `src/app/(tabs)/_layout.tsx`: allí van `title`, el icono y el resto de opciones de cada pestaña.

El reparto queda así:

| Layout | Declara | Configura |
| --- | --- | --- |
| `src/app/_layout.tsx` (`Stack`) | `(tabs)` y las rutas de `src/app/` que estén fuera del grupo | Si hay cabecera encima de las pestañas y cómo se apila lo que va por encima |
| `src/app/(tabs)/_layout.tsx` (`Tabs`) | `index`, `add-meals`, `meals` | La barra, el título y el icono de cada pestaña |

El `Stack` raíz no sobra aunque tenga una sola pantalla. Una ruta fuera del grupo, como un futuro `src/app/meal-detail.tsx`, se declara en ese `Stack` junto a `(tabs)`. Al abrirla, se apila encima de las pestañas y las tapa hasta volver atrás.

Dos archivos no pueden dar la misma URL. `src/app/index.tsx` y `src/app/(tabs)/index.tsx` responden los dos a `/`. Al pasar las pantallas a un grupo, el archivo de fuera se borra.

En Next.js es lo mismo: `app/(tabs)/meals/page.tsx` es `/meals`, y `app/(tabs)/layout.tsx` envuelve solo las páginas del grupo. Next.js no trae una barra de pestañas: ese layout pintaría la navegación a mano. En Expo Router la pone el navegador `Tabs`.

