// O switch nunca vai deixar duas ou mais rotas serem acessadas ao mesmo tempo
import { Route, BrowserRouter, Switch } from 'react-router-dom'

import { Home } from './pages/Home'
import { NewRoom } from './pages/NewRoom'
import { Room } from './pages/Room'

import { AuthContextProvider } from './contexts/AuthContext'
import { AdminRoom } from './pages/AdminRoom'

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        {/* Switch -> Se uma rota foi satisfeita, ele vai parar de procurar por outra. */}
        <Switch>

          {/* Home route */}
          <Route path="/" exact component={Home} />
          {/* NewRoom route */}
          <Route path="/rooms/new" component={NewRoom} />

          {/* :id porque vai receber o id da sala que está sendo acessada */}
          <Route path="/rooms/:id" component={Room} />

          <Route path="/admin/rooms/:id" component={AdminRoom} />

        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

// yarn add react-router-dom -> instalando router para navegação no react
// yarn add @types/react-router-dom -D -> como estamos utilizando o typescript e o react-router-dom não foi construído com typescript, precisamos adicionar um pacote de terceiros para resolver.
// yarn add react-hot-toast -> lib com notificações legais
export default App