# Teslo Shop

## Init Devel Design

### Material UI - MUI
  -- Instalacion de MUI
    - Deps:     `pnpm add @mui/material @emotion/react @emotion/styled`
      - Icons:
        - Le decimos a Next q solo vamos a usar ese Icon, eso favorece al treeshaking ya q SOLO ese Icon va a formar parte del Bundle final de la app, NO todos.
        - Para eso debemos importalo by naming: 
            import { Delete } from '@mui/icons-material';
                 `pnpm add @mui/icons-material`

  -- Config
    - Necesitamos crear el Theme y proveerlo
    - En next lo hacemos en el      `_app.ts`




## Devel
  -- Navbar
    - El Link de Next navega SIN refrescar la pantalla: <Link/>
      - Hace el  prefetch  de la page
    - Para renderizar la Navigaton segun Desktop o MObile
      - Se puede hacer con los breackpoint de MUI y el display en none/block
      - Pero, Mejor usar el    useMediaQuery()   para saber si es mobile
        - Asi condicionamos el Renderizado, y optenemos mayor performance ya q no tenemos Contenido q solo se oculta con css, sino q de hecho NO se renderiza, no existe.

      - Breackpoints de MUI en pixeles
          https://mui.com/material-ui/customization/breakpoints/



### 404
  -- Simplemente creamos el       `404.tsx`     en el root de  /pages
    - Esta sobrescribira a la 404 q trae x default Next.js
    - Responsive con el 
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}



## Continua initial design
  -- Home temporal
    - Para q parezca q se puede hacer click en el card (como el los pokemons)
          <CardActionArea>

    - Imagenes (Temporal, luego cambia)
      - Para hacer referencia a   /publics   de next solo hacemos esto:
          image={`products/${product.images[0]}`}


  -- SideMenu o Sidebar
    - Con MUI se utiliza el    <Drawer></Drawer>
    


  -- Slider - Carousel
    - Usar Librerias q NO estan escritas en TS y q TAMPOCO tiene DT o archivos de definicion
      - Ejer SIN [DT]
        - Debemos crear el archivo de definicion en el root del proyect

    - La Nueva Version de   `react-slideshow-image`   YA esta escrita en TS
      - Super ligera y es Responsive
      - Necesitamos importar los  Styles
`          import 'react-slideshow-image/dist/styles.css'`

        - url: 
            https://www.npmjs.com/package/react-slideshow-image



  -- Pagina del Carrito de Compras
    - Con Grids es mas facil W




  -- Formulario de direccion
    - El Form lo vamos a W con    `react-hook-form`
    

      https://react-hook-form.com/





  -- Purchase history
    - Usara la `Table` de MUI    data-grid
      - Deps   `pnpm add @mui/x-data-grid`
            https://mui.com/x/react-data-grid/
            https://mui.com/x/react-data-grid/getting-started/#main-content



    - Codigo fuente - Fin Seccion 12
        https://github.com/Klerith/next-teslo/tree/fin-seccion-12













/* ================================================================
# S13: DB and Restfull API
  -- Intro
    - W la DB y la API con el SEED
    - Usaremos SSG para la creacion de las pages de c/product
      - Con React (ISR) hacemos fetch de la data q si cambia frecuentemente como el Price, Stock y Size
        - Asi tenemos SSG con revalidaciones diarias (ISR) para tener lo mejor de los 2 mundos
    - La API esta construida en Next.js





## Devel - init Back
  -- Seed
    - Creamos la coneccton a DB
    - Creamos el SEED endpoint

  
  -- REST: getAllProducts
    - El filtrar x Genero es mas optimo ya que SOLO vamos a permitir filtrar x generos validos, para q las queries sean eficientes y solo busquen lo q existe.
      - Asi, si envian un genero croto como  'a'  lo q significaria 1 query tocha, pues en ese caso, como NO esta permitido/includes, NO hacemos el filter y de una devolvemos todos los productos
      - // TODO: Paginado y filtrado del lado del Servidor como EdRoh in ECOMVISION

 
    -- Los enpoints en el     /page    SIEMPRE debe ser Exportados x   Default   para q Next.js los reconozca, sino da error





  -- Search
    - Para mejorar el Performance de la Consulta usamos los Index de Mongo
      - Como es un   Search   pues usamos el    index type Text    en el    Schema
`         ProductSchema.index({ title: 'text', tags: 'text' });`
      - Luedo, en el endpoint lo busamos con   `$text: $search{q}`
        - $text   <-   tipo del index (como lo definimos en el Schema)
        - $seach  <-   haga el find a ese index x el termino de busqueda  `q` 


    - Post explica los Index para mejorar el performance de los Search in MongoDB
      https://www.digitalocean.com/community/tutorials/how-to-perform-full-text-search-in-mongodb



    - Codigo fuente S13
        https://github.com/Klerith/next-teslo/tree/fin-seccion-13














/* ================================================================
# S14: SWR - React Hooks for Data Fetching
  -- Intro
    - SWR creado x los creadores de Next.js q nos ayuda al Fetch de data
    - ISR: Tener paginas de productos Estaticas, pero si entra 1 req de un producto q no tiene su page generada de manera estatica, pues entre la req y genere esa pagina y la tenga en filesystem. Asi, con cada producto nuevo q vaya a ser creado
      - De esta manera, tenmos el recurso estatico q hara mucho mas eficiente/rapido nuestra app
        - Cabe recalcar, q al inicio tendremos un # de productos estaticos generados en `Build time`, pero con ISR a medida q entren las req q nuecos productos, estos seran generados en runtime, pero SI se almacenaran en FileSystem
          - Con lo cual, si luego llegan 1 millon de req a ese producto, ya esta estatico en nuestra app y ese mismo se va a servir.
    




  -- SWR - React Hooks for Data Fetching
    - Usaremos el hook    `useSWR()`    para hacer el fetching de la data. Esto tb se puede usar en una SPA de React.

    - SWR:              https://swr.vercel.app/
    - SWR with Next:    https://nextjs.org/docs/basic-features/data-fetching/client-side#client-side-data-fetching-with-swr



    -- Custom hooks y config Global SWR
      - Global Config en el        `_app.ts`       con el Provider
        - Aqui es donde usamos el    fetcher   
        - Ya tenemos las ventajas del SWR como el cached
          - Retorna 1 304 (mucho mas optimizado en bytes) al hacer fetch a un endpoint donde el back no ha cambiado
        - NO almacena esta info en ningun    Global State
      - useSWR tiene internamente 1 useEffect q hace la limpieza de todo cuando se destruye el component
      - Creamos el      useProducts     q se encarga de hacer el fetch de la data


  -- Loader
    - Simple loader de MUI
      - Que lo mostramos condicionalmente con el     `isLoading`   de   `SWR`



  -- Mostrar textos cuando la imagen está cargada
    - Usamos 1 useState y lo manejamos con el      `onLoad`   del card media
        `onLoad={() => setIsImageLoaded(true)}`
    

  -- Debemos basarnos en Que tanto cambia la data para saber si aplicar SSG, ISR o SSR

  -- Active Link
    - Con el    `asPath`    del    `useRouter()`



  -- UI Context Provider
    - Los creamos con los  `snippets`  de vscode q cree y es mas rapido y facil







### Product page
  - Para pagians de productos, en donde SI Importa el   `SEO`, debemos tener Static Content
    - Si hago     `fetch`    de la data en la pagina del producto, `Pierdo SEO` ya q cuando los bots de google entren, lo Unico q van a ver es el      Loader     q toda SPA requiere para hacer fetch de la data



  -- `getServerSideProps` - Producto
    - Esto hace q la Page q la este utilizando SEA de Inmediato Generada por SSR.
    - Gano SEO, pero esta page se genera en    Request Time




  -- `GetStaticPaths` y `GetStaticProps`
    - Con esto W con SSG y unicamente haciendo fetch de la data q cambia constantemente, pero ya NO de toda la page. Asi NO pierdo SEO.

    - Aqui W con SSG y ISR para q se genere la pagina de producto de manera estatica y si se hace 1 req a un Product q NO fue generado en BuildTime, pues este consulta al Server y mira si existe, SI este existe lo genera en ReqTime Y lo Almacena en FileSystem
      - Asi, si alguien pide esa misma pagina, YA la tenemos en FileSystem y se sirve ese contenido estatico
      - Tenemos ISR q revalida c/24h la pagina y la actualiza, Manteniendo esa actualizacion en FileSystem y asi seguir sirviendo contenido estatico actualizado c/x time

      - FALTA eso de Udemy q en ReqTime haga el fetch de unicamente la data q cambia (price, etc.)
        - Creo q solo necesitamos hacer Fetch con Axios al endpoint de esa data e Hidratarla con React





### Search Page
  -- Debe ser generada x   `SSR`   xq yo NO puedo adelantarme a lo q va a buscar la persona
    - En Udemy/Amazon, esta pagia de busqueda es generada x SSR
      - Ademas, en ReqTime, si no tengo lo q busca la persona, puedo Leer sus Cookies y en base a ese recomendar productos.
        - No encontre este term de busqueda, But Tengo estos articulos q te pueden interesar
          - Los leo de la cookie

    -- NOTA: SSR NO necesita Loders
      - Las SPA SI necesita Loaders xq hacen fetch de la data en Runtime/Reqtime
      - Aqui usamos SWR, q SI hace fetch de la data, asi q SI necesita 1 Loader 




  -- Realizar la Busqueda/Search mediante     `SSR`
    - Se la hace pro SSR ya q yo NO puedo adelantarme a lo q el cliente va a buscar, no se q puede buscar, por eso se genera con SSR
    



    - Codigo fuente Seccion 14
        https://github.com/Klerith/next-teslo/tree/fin-seccion-14

















/* ================================================================
# S15: Carrito de Compras
  -- Intro
    - Enfocado puramente en el manejo del Carrito de Compras
    

  -- Cart Context
    - Podemos crear /interface dentro del context
    - Simplemente usamos los   snippets  q creamos para crear todo mucho mas rapido


  -- Producto No Disponible
    - Deberia ser manejado con el Back con 1 filtro: (inStock > 0)
    - El Back es quien debe verificar si todabia tiene Stock


  -- Validar q seleccione 1 talla
    - Hicimos q el hijo envie info al padre  (Ver curso de React PRO)



  -- Contador de Productos
    -- En la Vida Real debemos manejar 1 Inventario X Talla
      - Se envia el tempCart al  <ItemCounter />
    
    - El hijo envia al padre el valor actualizado









### Agregar al Carrito,  Almacenar Carrito en las Cookies, Delete    <--  CartProvider.tsx
  -- `Agregar al Carrito`
    - Esto necesita Mucha logica de programacion
      - Si se selecciona la misma talla, este debe incrementar el contador del producto q ya esta en el carrito, pero si es otra talla (mismo producto), pues se agrega al array.
        - OJO: Al enviar x       referencia       el tempProduct en  `ProductScene.tsx`  y seleccionar en != ocacioens el mismo producto con misma talla (sin modificar nada), se modifica el tempCart.quantity, y lo va incrementado en 1,2,4,8,16...
        - Para EVITAR esto:
          - Eliminamos la referencia:  `addProductToCart({ ...tempCartProduct });`
          - O, podriamos crear otra property para el counter inicial q NO cambie

    - Esta funcionalidad la hace enviando directamente 1 nuvo Arr de Productos, y no solo 1 product al Reducer






  -- `Almacenar el carrito en COOKIES`    <===   `isMounted`  <- 'StrictMode'
    - Ante TODA peticion al Backend, las Cookies Viajan en Req. Time en Automatico
    - Para el Client usamos `js-cookie`, para el Back Next.js YA procesa facilmente las cookies.
        `pnpm add js-cookie`    `pnpm add -D @types/js-cookie`
   
  - Esto es un poco complejo con React 18 y el   'StrictMode'  xq al ejecutarse 2 veces, la primera setea el carrito, pero la 2da lo empty
    - Asi que para `SOLVENTAR`  esto se requiere un      useState      para saber cuando se ha Mondato el FC.
      - Asi,     `isMounted`    asegura  que el State NO se va a actualizar si la Inicializacion aun NO se ha ejecutado. Con lo cual, al reiniciar como no isMounted, pues NO borra el las el carrito en las cookies
        - "isMounted" ensures that the status will not be updated if the initialization has not yet been executed.
        

        - Respuesta de   Martin
          https://www.udemy.com/course/nextjs-fh/learn/lecture/30916398#questions/17344890


    -- NO vamos a confiar en los precios q envie el Front
      - Vamos a validar el ID q nos envia el Front para q con eso, consultemos el Actual Price in DB, esto es mas seguro.






  -- UPDATE la Quantity DESDE la PAGE del Cart
    - Usa el   .map()    en el Reducer
      - Ya le llega el Producto entero MODIFICADO






  -- DELETE/REMOVE producto del carrito
    - Usar la logica en el Reducer    `.filter()`

    - El cambio del    `Quantity`    en el   Carrito   se almacena en las `Cookies` xq Altera directamente al `cart` del Context (state), y tenemos 1   `useEffect` , q ante cualquier cambio del carrito, lo almacena en las Cookies (solo si esta montado el FC  <-- guard - React 18, StrictMode)      <----    CartProvider.tsx



  -- Calcular montos a pagar
    - Lo hacemos con 1    `useEffect`  y estamos escuchando el    state.cart
      - Cada vez q este cambie recalculamos los Montos a Pagar
      - `dispatch`  de la accion q Actualiza el State del   `orderSumary`
        - Para consumirlo en todo lado q se requiera

    - NOOOO vamos a usar los datos del Front, siempre los del back q consulta a DB xq en el front los pueden cambiar.
    

  -- Colocar montos en pantalla
    - Usamos el State del   `orderSummary`   q se carga en el Provider con el useState ya q este llama al    dispatch()
    



    - Intl  <--   currency
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl





    - Url codigo fuente | fin seccion 15
        https://github.com/Klerith/next-teslo/tree/fin-seccion-15











### S16: Authentication PERSONALIZADA mediante JWT    <--   NO es la final (NextAuth)
  -- Nos enfocaremos en 1 `authentication Personalizada`, para luego mejorarla con NextAuth y agregar login con Redes Sociales.
    - NO es el codigo final, la auth final va a ser con   NEXT-AUTH

    

  -- Uder Model
    - Interface en el Front va a tener info q SOLO va a existir en la parte del back y NO en el Front
    - Creamos la interface, q en este caso, lo del front va a ser != a lo del back


  -- Login endpoint + JWT
    - Instalamos la dep para el back:     `pnpm add jsonwebtoken`  
                                          `pnpm add -D @types/jsonwebtoken`


  -- Authenticacion - Validate JWT
    - Lo vamos a enviar x las   Cookies
      - De ahi lo leemos y lo validamos
    

  

  -- Formularios con   React Hook Form      https://react-hook-form.com
    - Deps:     `pnpm add react-hook-form`  `pnpm add @hookform/resolvers yup`
                
      - Uso      YUP     para crear Schemas de Validacion del Form, y lo llevo a otro archivo para q sea mas limpia la implementacion.


  -- Auth Context
    - Creamos los 3 archivos claves para el context provider como siempre
      - Contex, Provider, Reducer, Custom Hook
        - El Provider en lo mas alto del    _app.tsx   xq es lo mas global de la app
    
    -- Dispatch del Login & Register
      - Esta Auth es Custom y NOOOOO se va a quedar, xq al final se va a utilizar el   AuthNext
      - Almacenar el Token en las Cookies


    -- Mantener el Auth del User
      - Recuperar la cookie de la Cookies :v

      - Axios ENVIA las Cookies AUTOMATICAMENTE, no requiere config extra



  -- El Login y Register VAN a ser Mediante     `SSR`     para tener mayor control y ejecutar validaciones del lado del server.
    - Ya sabemos si el User esta AUTHENTICATED o No por a las `Cookies`
    


    - Codigo fuente - fin secion 16
        https://github.com/Klerith/next-teslo













### S17: Estilos Condicionales Admin-Client
  -- La Pagina del     Checkout Summary    va a ser generada del lado del Backend x  `SSR`  para validar q haya hecho Login, sino NO se va a generar
    

  -- Redireccion a la ultima pagina vista despues de hacer   LogIn
    - Podemos guardar este    last path   en 1 Cookie y asi saber a navegar

    - O como aqui, almacenarla en 1    `QueryParam`    en el url del Login, asi ya lo tengo, luego lo recupero y lo redirecciono alla.
      - LO Almacenamos en el query param en el          SideMenu.tsx
      - Asi lo leemos en del queryparam en el           login.tsx
      - Lo mismo hacemos para el register               register.tsx

  ```ts
    // login.tsx
    const destination = router.query?.p?.toString() || '/';
    router.replace(destination);
  ```



  -- Mostrar Empty Cart Page
    - Solo si tiene items en el carrito
      - Nos ayudamos del     `isMounted`   q generamos en el   `CartProvider`
        - Asi, solo si se ha montado el component y se ha cargado el carrito se muestra 1 u otra
          - Es medio raro, xq con eso ya deberia tener el carrito cargado o no, pero aun asi, hace falta el   isMounted   en otros components q quiera condicionar su renderizacion en base al cart como el   emptycart/cart.tsx




  

  -- Verificar la Auth desde el Server  (Server Side)
    - SIN Middlewares necesitamos crear la logica del SSR para cada page q la necesite
      - `getServerSideProps`
    

  -- Con `Middlewares` Next.js +V13   <-- Solo se ejecuta en Server-Side
    - Necesitamos crear el      `middleware.ts`    a la altura de    /pages
    - Middlewares en Next 13 da problemas al W con jsenwebtoken, asi q se debe Instalar   `jose`
          `pnpm add jose`

    - Implementamos el Middleware de tal manera q:
      - Con    `jose`    se verifique si es valido el Token q traemos desde las Cookies
        - jose xq jsonwebtoken da errores en los Middlewares de Next
          - NO es mayor problema xq esta validacion luego va a ser Reemplazada con   NextAuth
        - Obtenemos el token de las cookies
          - El Middleware de Next v13 los maneja como key-value, asi q tomamos el value
      - Si el token es Valido un     next()    para q cargue continue y envie/renderize la pagina (STATIC xq NO estamos usando SSR para esa pagina, sino q usamos el middleware para validarla)
      - Si NO es valido, redirect al    login    manteniendo el PrevPath para q despues del Login/Register aterice en la PrevPage

    
      https://nextjs.org/docs/advanced-features/middleware


  
  -- Address 
    - Almacenaremos la info del address en las cookies
      - Las Countries deberian enstar en DB para no tener q hacer el build al cambiar algo
      - Podemos tener un   `billing`  separado (facturacino)

  -- Shipping Address
    - Es la Misma Info del  `Address`  que almacenamos en cookies
      - Al hacer submit de ese form, se almacena en Cookies la info del Address
      - Aqui, la tomamos de las cookies y las colocamos en el   Context    en el     CartProvider.ts
    - En el Porvider
      - Con un       useEffect     cargamos la info de las cookies, si esta existe
      - Con el     updateShippingAddress     manetemos el state actualizado
        - La info del      `checkoutAddress`     q guardamos en el Address.tsx Page
          - Esta pasa a ser         `shippingAddress`        en el    Cart Context 
          - Y esa es la q consumiremos para las demas paginas

    -- Se arreglo el Select, erro MUI uncontrolled change
      - Con    key={}
      - El Error del 500 dismatch client/server   <-  <NoSsr></NoSsr>
        - De MUI mismo














### S18: Next Auth      <--      [...nextauth].ts
  -- Intro
    - Implementaremos   NextAuth
      - Vamos a reemplazar toda la validacion custmo q tenemos a una Trabajada x NextAuth
      - Tendremos nuestra DB para decirle a NextAuth q es nuestro user
      - Nos ayuda a implementar login con RRSS

      - /pages/api/auth/[...nextauth].js
        - [...nextauth]   <-  TODAS las Reqs van a entrar x aqui
          - Unico enpoint x el q pasa todo
          - el email d la doc NO es el login q hemos utilizado
            - Es para enviar otra cosa
            


  

  -- NextAuth.js        <--     https://next-auth.js.org      <-    https://authjs.dev/
    - Deps:     `pnpm add next-auth`
    - Utiliza q Provider de Session, con el q tendremos acceso a hooks q nos indicaran el Session Status en donde queramos
      - Al hacerlo con RRSS, debemos configurar la adaptacion a nuestras necesidades
        - Tener roles, nuestro propio ID de mongo, etc
      - Credentials  <-   para nuestro sistema de auth, si ya lo implementamos


  -- Implementacion NextAuth
    - Podemos implementarla en nuestro diseno de Login ya creado
    - Creamos el archivo en el path especifico:       `pages/api/auth/[...nextauth].ts`
      - [...nextauth].ts
        - ... Le dice a Next q Cualquier path del /dir q conteiene ese archivo va a caer ahi dentro de ese fichero
          - Cualquier request pasa para alla
    - Podemos implementar tantos    `Providers`   para c/RRSS q necesitemos
      - Obviamente necesitamos el      `Provider Global`     para q esto funcione
        - Es decir, exiter el Main Provider y Providers para c/sistema de sign in q seleccionemos
          - Para 1 ya implementado es el     'Credentials Provider'
          

  -- Implementar el  `Provider de GitHub`
        https://next-auth.js.org/providers/github


  -- Config en   `GitHub`   vamos a generar las `API Key` para el   `OAuth`
    - Settings > Developer Settings > OAuth App
    - Register new OAuth App
      - Llenamos la info (homepageURL & Ath callback are the same URL)
    - Generamos el Client Secret
    - Podemos subir el Logo de la APp
    - Update App

  -- Uso
    - SOLO con esto ya podemos ingresar a  x default      `/api/auth/signin`
      - Con esto se nos Agregan algunas cosas en las Cookies
        - Nos provee el   CSRF Token
      - Con esto ya nos auth con github
    
  -- Config en el  Client App
    - Debemos proveer el   <SessionProvider></SessionProvider>
      - Podemos ver el Session Status en cualquier parte de la App con  `useSession()`
        - Esto va a tener != Status: 'loading', 'authenticated', 'unauthenticated', ...
      - Esta data la verifica de las  `Cookies`

    -- User Authenticated de GitHub
      - Como nos envia la info GitHub es asi:
        - Esta tb suele ser la resp de otros servicios como el de Google OAuth, etc.

    ```json
    {
      "user": {
        "name": "Daniela Borja",
        "email": "sarhaaluiza04@gmail.com",
        "image": "https://avatars.githubusercontent.com/u/118997977?v=4"
      },
      "expires": "2023-04-18T13:47:25.130Z"
    }
    ```

      - Debemos Crearlo en Nuesta DB
      - A esta Response DEBEMOS agregarle TODO lo q Neceistamos o Tenemos Establecido en nuestra Logica
        - ID, Roles, etc.

      

  -- `Credentials Provider`
    - Next.js lo tiene liminado x default ya q considera q user user/pass conllega complejidad extra y riesgos de seguridad

    - Usaremos la Propia Auth q ya Habiamos Implementado con JWT
      - Debemos configurarlo en el      [...nextauth].ts 
      - Callbacks


    -- Corregir tipado y Access Token
      - Tipado:         NextAuthOptions
      - Access Token:   Crear      `next-auth.d.ts`     &  as any

        - Corregir problema de tipado:      `NextAuthOptions`
        - Corregir problema del Access Token
          https://next-auth.js.org/getting-started/typescript
          https://www.udemy.com/course/nextjs-fh/learn/lecture/30960964#questions/18451878


    -- Config
      - Delegaremos la Creacion del JWT a NextAuth
        - Este creara el JWT y lo almacenara en las Cookies
      - Verificamos q el user exista een DB
        - Si no existe o algun error, retornamos NULL para q NO haga el Login NextAuth
          - IMPORTANTE: lo q se retorne debe cumplir con la firma q espera NextAuth
            - id: _id

              https://next-auth.js.org/providers/credentials



    -- Log Out  con NextAuth
      - NextAuth ya tiene preparado   `signOut`    q nos deauthenticate de la app a la q nos Auth con NextAuth
      - En el       AuthProvider      llamamos a esa fn y podemos agregar el resto de funcionalidad propia q consideremos necesaria
      

    
  -- `Sign In/Up con GitHub`
    - Por como tenemos la Logica, Todos los q se auth mediante RRSS van a ser USERS, y NO Admins
      - Creamos la fn       `oAuthToDBUser`       q nos permitira
        - Registrar el user con GitHub
          - Almacenarlo en nuestra DB
        - Login si ya esta registrado

    - Implementar GOOGLE:
      https://www.udemy.com/course/nextjs-fh/learn/lecture/30961228#questions/19327282





  -- NextAuth - Login Personalizado
    - En el      [...nextauth].ts      establecemos cuales van a ser las urls de las paginas personalizadas
      - El `Login` se lo DELEGAMOS COMPLETAMENTE al NextAuth, es el quien generara el JWT y lo almacenara en las Cookies
        - NOOOO requiere ningun Endpoints
      - El `Regiter` SIIII requiere el Endpoint de register
        - 1ro llamamos al endpoint
          - Este almacena el user en DB
          - Solo se Toma lo q se Necesita de esa Response
        - 2do se hace el Proceso del Login con NextAuth
          - Tal cual el Login normal, q no requiere endpoint
            - Y crea el token y lo almacena en las cookies con NextAuth




  -- `SOLUTION`:  Error [next-auth][error][CLIENT_FETCH_ERROR]      <--   Prod
    - Seguir la documentation y Usar   `getServerSession`
      - due to AVOIDING an extra fetch to an API Route 
        - FH usa    getSession    q NO evita el retch
          https://next-auth.js.org/configuration/nextjs#getserversession
          https://next-auth.js.org/configuration/nextjs#in-getserversideprops
          https://next-auth.js.org/getting-started/example#backend---api-route

    - Error: [next-auth][error][CLIENT_FETCH_ERROR]     <--    SOlucionado
      - Es muy reciente el error, de hecho los Issues en Github estan de hace 5 dias a fecha 19/03/2023
        - Recomiendan usar esta ENV con la url base. Esto SI hace la redireccion en prod, pero con errores en la url.
`             NEXTAUTH_URL`

          https://next-auth.js.org/warnings#nextauth_url

















### S19: Manejo y Creacion de   ORDERNES
  -- Intro
    - Se W con las Ordenes
      - Almancenas en DB con precios y desc de como esta el producto en el momento de la generacion de orden


  -- Modelo e Interface de Ordenes
    - TODO: Mejorar el Schema a como si si hiciera con SQL
      - Y consultas con   Aggregate Functions de Mongo



  -- Rest
    - Devemos validar q el monto q envia el Front sea el Mismo q se calcula ese DIA en el Back
      - Si no hace match, significa q alguien esta manipulando el Front, asi q deberiamos bloquearlo de inmediato.
        - Esto DA Error de Logica: Asi los Prices NOOO deberian cambiar
          - Front: Almacena el Price en Cookies el dia q se lo agrega al Cart
            - Si quiere hacer el Confirm Order otro dia en el q el precio CAMBIO, nuestro back va a dar error x como lo hemos implementado
              - Deberiamos tener una tabla con historial de precios x dias
                - Asi comparamos el   `Summary`  con los precios de ese dia, con los precios de ESE DIA en el `Back` basado en la TABLA de Historial de Precios
                  - Ahi si, si en base a esas FECHAS NO coincide, pues ya q de el error
            - O, Actualizar el precio en las Cookies c/dia
              - Esto actualizaria el Price del OrderSummary, pero no se, xq si ya lo tiene en el carrito se deberia quedar? o NO xq deberia cambiar como en Udemy
          - Back: NO tiene un historial de precios
            - FIJARSE en COMO lo hace `Udemy` con el carrito
              - Esos prrs cambian el precio todos los dias

    ---> Udemy ACTUALIZA los Precios de los Cursos en el Carrito
          - Asi q Mejor NO tener la tabla de History y validar con fechas
            - Solo Actualizamos los Precios del Carrito c/d
              - Como los toma del State Context, pues crear 1 fn q revalide el precio y lo almacenen en las Cookies
                - `ISR` ????
                  - Revalidar c/d como udemy
                    - Ellos sirven el precio del carrito como Static Content
                      - Pero c/d lo revalidan con ISR para tener el precio actual del curso y asi actualizar el Total Amount a pagar
                
              





  -- Creamos el endpoint para generar la Orden
    - FRONT:
      - Usamos el    `IOrder`    tanto en front como en Back
        - Asi la refactorizacion va a ser mas facil
      - El State del `CartProvider` es el IOrder q Nuestro Back espera
        - Asi, solo cumplimos con la interfaz    IORder    y ya tenemos todo listo, tanto para el Front como para el Back
    - BACK:
      - Validar el price de c/producto q viene desde el front. NUUUUUNCA confiar en lo q viene del front para este tipo de apps
        - Validamos el precio q viene con el de DB
        - Validamos el Total Amount en el back
        - Si algo falla, al mas minimo centavo de diferencia tiramos una excepcion y NO permitimos esa orden





  -- Confirmar Orden    <--    `sumary.tsx`
    - Como tenemos 1    `useEffect()`    q ante todo cambio en el Cart lo almacena en la Cookie, para limpiar el Cart despues de Confirmar la orden BASTA con Cambiar el State del Cart
    - Debemos hacer el     dispatch     q al ser satisfactoria limpia el Cart en el State, con lo cual, el useEffect lo persiste en la Cookie
      - Bloqueamos el boton para q solo haga click 1 vez y no duplique las ordenes
      - Lo redireccionamos a la Pagina de la Orden con el ID de la orden q traemos del Backend
        - Aqui retorna el ID de la orden como message, y asi lo usa en   `summary.tsx`
          - Mejorarlo con: Messages en el Context UI para mensajes
    - YA valida q si da error en el back, en el Summary se muestre ese y NO se haga mas, ni en el front ni en el back, logico.









  -- `Orders`   <--   Info viene de DB
    - Usaremos     `SSR`     para las    `Validaciones`     de esta Pagina
      - Validaciones: Match User Auth con ID de la Orden | Existe o NO el ID de la Order
      
    -- Cuando se usa  `SSR`  NOOO usar API Endpoints, es Mejor llamar directamente a DB desde fn
      - Validamos con SSR para q si NO cumple, NI SIQUIERA se genera la Page
      

  -- Modificaciones al     `CartList`     y        `OrdenSummary`
    - Para q W condicionalmente con la data
      - La toman del     CartContext      o  de DB
        - Context:  Carrito y OrderSummary
        - DB:       OrderPageByID
    - `PROTIP`
      - Desestructuracion Condicional / conditional destructuring
        - NUNCA hacer un Hook Condicional
        - si existe orderData, hace el destructuring de ese, sino del otro

  ```ts
    const cartState = useCart();
    const {
      orderSummary: { numberOfItems, subTotal, tax, total },
    } = orderData || cartState;
  ```


  -- Order History
    - La protegemos con SSR
    - Traemos las Orders de DB
      - Las comparamos x user, pero ese User es un ID, NO la relacion con otro Doc
      - Order.find({user: userId})
    - Tanto la validacion de la Session como la obtencion del userID, como se la hace por SSR se utiliza    `getServerSession`

      https://next-auth.js.org/configuration/nextjs#in-getserversideprops
    
    
  - La `orden` en DB NO tiene Relaciones con Products xq quiere q la data persista, ya q con el tiempo, el producto al q haga referencia puede q ya NO exista o q se haya actualizado el Name, size, etc.


    
    - Codigo Fuente: Fin Seccion 19
      https://github.com/Klerith/next-teslo/tree/fin-seccion-19


















### S20: Pagos con PayPal y tarjeta de credito
  -- Intro
    - Usar mecanismos de Pago
      - NUNCA confiar en lo q envie el Front
    - Flujo
      - Generar 1 Order q NO se puede cambair (Stored in DB)
      - Se le Envia al Gestor de Pagos la cantidad, moneda, etc
        - Genera un ID/Token de pago
      - Ese ID de pago q envia el Gestor lo recibimos en nuestro Back
        - Lo verificamos de nuevo con el Gestor de Pagos
    - Es el Backend junto con el Gestor de Pagos quienes tiene la ultima palabra de q se pago o no la orden y de q se pago lo q se debe y NO manipularon nada
      - Si manipulan en el Front, en el back lo validamos y lanzamos un error para NO proseguir 
      
    - Se implementara
      - Botones de cobre con PayPal y Tarjetas de Credito
        - Validar pago contra PayPal




  -- Modificaciones adicionales al Order para Pasarelas de Pago
    - Debemos Mantener alguna Relacion entre la Orden en DB con el Gestor de Pagos de turno
      - Esa relacion la mantenemos con   `transactionId`
    - Las pasarelas de pago se van a quejar si tenemos muchos decimales al momento de hacer la compra.
      - Asi q debemos moldear la data q se va a enviar a la pasarela de pago.
        - La redondeamos a 2 decimales para q PayPal NO se Queje




  -- `PayPal Developer`
    - Creamos 1 cuenta
      - Nos vamos a `App & Credentials`
        - Create App
          - Dar nombre y Seleccionar correo, yo ya lo tengo. Ver como se Genera???
            - La podemos crear accediendo a   'Sandbox Accounts'
              - Creamo una nueva cuenta
                - Personal
                https://developer.paypal.com/dashboard/accounts
          - Create App Btn
        - Nos lleva a la pagina de al App creada con datos importantes:
          - Client ID:  
            - Este SI es Publico, NO hay problema con q las personas lo sepan
          - Secret:     
            - NADIE lo debe Saber, es PRIVADO, podrian hacer pagos y demas.
        



  -- Botones de PayPal
    - Usaremos la libreria oficial de PayPal: Facilita enormemente el W, maneja loadings, peticiones, etc.
      - Install Deps:   `pnpm add @paypal/react-paypal-js`

  -- Setup   <--   Provider
    - En el       _app.ts      establecemos el    
            <PayPalScriptProvider></PayPalScriptProvider>
      - Q requiere como Opt el  PayPal `Client ID`
    - Implementamos el Button
      - Configuramos
        - Ya con el Provider de PayPal solo colocamos el Component
          - Esto con la config del     createOrder y onApprove
            <PayPalButtons></PayPalButtons>
      - Sandbox: Login con la cuenta sandbox q creamos en el panel de Developers
      - Nos interesa el   ID   q viene en el   `onApprove`
        - Ese ID es el q usaremos en el Back para validar el pago de la Orden
        - NO confiamos en el Front, x eso verificamos desde el back

        https://www.npmjs.com/package/@paypal/react-paypal-js









#### Verificar el Pago desde el Backend
  -- Verificar el Pago desde el Backend
    - Para solicitar info a PayPal requerimo un Token de Acceso
      - Ese token lo enviamos en las Headers al `Link` q nos genera el  `onApprove`  junto con el ID del pago
        - Fuente de donde sale q se encesita estod 2 enlaces:
          - La parte del OAuth: https://developer.paypal.com/api/rest/authentication/
          - Y la parte del checkout: https://developer.paypal.com/docs/api/orders/v2/
              https://gist.github.com/Klerith/a9db311a7378492149738cd48f041d17





  -- PayPal OAuth Token
    - Proteccion Extra: Podemos crear 1 intento de pago, luego buscarlo en paypal y realizar el pago
      - Asi no tendriamos problemas con q se hace el pago, cayo internet o el back, y no se comprueba
      - Aqui las validaciones q tenemos es q si NO existe la Orden in DB, NO se carga crea la pagina x `SSR`




  -- Crear el `OAuth Token` de Paypal
    - Debemos enviar el ClientID y el Secret a la URL     `PAYPAL_OAUTH_URL`     para q se valide
      - Requiere ademas el GrandType  en el Body como 1         'x-www-form-urlencoded'
        - Esto nos generara 1    access_token    q es q Bearer token q usaremos para llamar al ENPOINT/URL      `PAYPAL_ORDERS_URL`
            - key: `grant_type`     |     value:  `client_credentials`
      - Es como hacer lo mismo del front, pero con nuestro back
    - Toda la logica de la obtencion del bearer token la creamos en `getPayPalBeaderToken()`
      - Toda esa fumada es MUY Comun para intercambiar info en ese formato
        - Debemos ver en q formano nos pide la info la pasarela de pago y en el back moldearla para enviarsela

        https://developer.paypal.com/api/rest/authentication/




  -- Confirmar orden pagada mediante PayPal
    - Ya con el AccessToken de PayPal debemos llamar al endpoint, enviandole   `tansactionID & orderId`   todo esto lo recibo en el Body, en formato     ''x-www-form-urlencoded''
      - TransactionID:  El q genera PayPal y nos evnai en el   `onApprove`   del Front
      - OrderID:        MongoID de la Orden almacenada en DB
    - En los Headers:
      - Bearer Token:   AccessToken de PayPal 
    - Esta parte MUST HAVE A LOT OF VALIDATIONS
      - Validar sessions, orderId, paypalid, token, order belongs to user




  -- Actualizar pantalla de pagos
    - Desde aqui se llama con React a nuestro Endpoint  `payOrder()`
      - Y ya en el back tenemos toda la logica antes implementada, validaciones y demas.
    - Aqui en el CLient SOLO se llama al endpoint con Axios


  -- Proteger los botones de pago
    - Crear un    useState    q sirva de lading mientras se genera el pago en Paypal
      - En base a eso se oculta los botones de pago y se muestra un Spinner/Loader/CircularProgress



  - PayPal `Sandbox`:
    - Email Buyer/Personal:  sb-i5h5i25329405@personal.example.com
    - Password:              123123123 




  -- COdigo fuente: S20 Pagos con paypal
    https://github.com/Klerith/next-teslo/tree/fin-seccion-20



















### S21: Panel de Administracion
  -- Intro
    - Iniciamos con el Admin Dashboard
      - Proteccion de endpointd con Middlewares
      - Some statistics 



  -- Admin Dashboard
    - Creamos el Layout
      - La Scene
        - El Card
      - Los Endpoints
    - Las consultas con el   Promise.all()  para q se ejcuten en paralelo



  -- Middleware para Proteget la Pagina y para el API
    - Todo lo validamos con este Middleware

    - Middleware y Roles:      [Jean Carlo · Lecture 353]
      https://www.udemy.com/course/nextjs-fh/learn/lecture/30992558#questions/19408782



  -- Order Admin Page
    - Como esta dentro de /admin, con el middleware queda protegida
      - NO requiere validar session ni nada en el    `getServerSideProps`   xq esto YA lo hace el Middleware.
      - Pero en las otras pages q NO son validadas x el middleware SI se requiere esa verificacion con  `getServerSession`   del    NextAuth


    - Opts for tables:
        - AG Grid: https://www.ag-grid.com/react-data-grid/



    - Codigo Fuente fin de seccion 21
        https://github.com/Klerith/next-teslo/tree/fin-seccion-21




















### S22: Mantenimiento de Productos
  -- Intro
    - El mantenimiento de productos requiere mucha logica



  -- Probar Endpoints de Next.js  protegidos con   NextAtuh  en Postman 
    - Creamos la Cookie q guarda el Token de Authentication
      - `next-auth.session-token=`
        - El Value es el Token q genera NextAuth al hacer login


-- Products Form
  - Si se usa  ReactHookForm  usar   Controller
  - Si no, https://www.udemy.com/course/nextjs-fh/learn/lecture/31053862#questions
    - Aunq creo q eso tb es de ReactHookForm


  -- RadioButtons / Checkbox
    - Se hacen con     `<Controller/>`     del RHF   y el controller de su   useForm()
      - Esto para que sea mas facil manejar los radio/select/checbox/etx de MUI y otros




  -- Sugerir un     `SLUG`    automático
    - Esto esta basado en el mismo React Hook Form (RHF)
      - Usamos el    `watch`   del mismo RHF, y podemos estar `suscritos`/escuchando los cambios de 1 input o todo el Form
        - Esta tecnica usa el      useEffect      y su return para limpiar el subscriber q genera el    watch
    - Pero tb podemos hacerlo sin eso y solo con el  onchange y onkeydown


  -- REST - Actualizar Producto
    - Creamos el Endpoint


  -- Client - Products create/update
    - [slug].tsx    <-   nos vasamos en si tiene ID y mas importante en esta logica, si tiene /new como slug
      - Esto lo verificamos x  SSR
    
    -- Subida de Images SIN paquetes de 3ros
      - Creamos 1 Input Hidden para disparar el selector de images
        - Creamos la ref con    `useRef`    y le hacemos click en el onclick del btn de MUI q queremos q se vea para cargar la img
      - Creamos el    `onImgsSelected`


  -- Imagenes Back
    - Usamo una dep

`   pnpm add formidable   &&  pnpm add -D @types/formidable `




  -- Images
    - NOOO subir al FileSystem, subir a Cloudinary u otro bocked para eso como AWS S3/Azure/DigialOcean, etc.
      - 
          
          https://nextjs.org/docs/basic-features/static-file-serving


    - Todo se maneja con el    `setValue/getValues`    del  useForm()
      - Para el cambiod el state y re-render del fc












### S23: Fin - Despedida
  -- Fin
    - 








<!-- TODO: -->
  -- Improve Navbar code <- refactor
  -- fix reload search page [query].ts, texts don't appear when it is reloaded
  -- Refactor   ProductScene.tsx
    - Mucho code
  -- Improve Size Selected to buy a product (improve styles, add toaster / Snackbar MUI)
    - Como no redirecciono, debo notificar q se agrego el producto al carrito
  -- logout wit reload en otras fn del  `AuthProvider`
    - SOLO si NO se usa  NextAuth
    - Al llamar al logout()  se haceun bucle de redirecciones y refresh
  --- Address
    - Country en DB
      - Fetch Cities desde 1 API based on Selected Country
    - Grabar esta infor en DB, en el User mismo
      - Como en SQL, User hereda de Person
        - Person tiene todo esto de address y demas
        - User es para el Auth
      - Grabar en DB xq esta info SOLO se queda en las cookies del equipo, pierde la info si cambia de equipo
    - Crear Pagina de Profile, en donde Configure Todo esto
      - Y en esta de checoutAddress, verificar si tiene esa info, si la tiene la cargamos, sino en vacio y al llenar, a DB de 1
  --- Summary
    - Mejorar la carga del  `shippingAddress`
      - Usar el  isMounted del CartProvider, y quitar el  return <></>
    - NO cargar si NO hay Productos NI cuando NO se tenga el shippingAddress
  -- Manejar Error Messages desde el `Context UI`
  -- Manejo de ADMIN con ContextAPI
    - Al seleccionar 1 Product q se cree el    SelectedProduct
      - Asi editar/create el product
  -- [slug].tsx  del admin/products
    - Mucho codigo y logica. Implementar 1 Custom Hook 
  



  -- Back
    - Otra tabla para ROLES
    - express-validator in Next     <-- `Solo si NO usa NextAuth`
      - Validar Endpoints de Login/Register 
    - Al eliminar el user en DB, SIGUE estando Auth en NextAuth, resolver
      - Pero esto creo q es del Front
        - Xq ya NO estamos usando el    `revalidate-token`    con cada Refresh (useEffect) xq estamos usando NextAuth con funciones del    `dbUser`     en lugar de nuestros endpoints
          - Es decir verificamos la session con el     useSession()     de NextAuth
              `const { data, status } = useSession();`
          
    - Implementar Middleware para los Endpoints q requieren Auth
      - Como el Auth esta siendo manejado con NextAuth
        - Validamos con la Session   <-       `getServerSession`
            https://next-auth.js.org/configuration/nextjs#getserversession

    - Update User
      - Verificar si esta activo o no

    - Usar   Express-Validator    con Next.js
      - Usar Middleware para validaciones comunes como el  MongoID


  -- Importante IMAGES
    - SUbir todas a Cloudinary
      - Coreregir los urls/href de cada img del Client









##### Enviar codigo para prueba tecnica

    dorganizacional@mobilvendor.com
    ctecnologia@mobilvendor.com











