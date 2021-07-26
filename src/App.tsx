import { Route, BrowserRouter } from 'react-router-dom'

import { Home } from './pages/Home'
import { NewRoom } from './pages/NewRoom'

import { AuthContextProvider } from './contexts/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>

        {/* Home route */}
        <Route path="/" exact component={Home} />
        {/* NewRoom route */}
        <Route path="/rooms/new" component={NewRoom} />

      </AuthContextProvider>
    </BrowserRouter>
  )
}

// yarn add react-router-dom -> instalando router para navegação no react
// yarn add @types/react-router-dom -D -> como estamos utilizando o typescript e o react-router-dom não foi construído com typescript, precisamos adicionar um pacote de terceiros para resolver.
export default App