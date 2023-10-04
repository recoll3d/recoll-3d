import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import './styles.css';

import logo from '../../assets/logo.svg';

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Recoll3D" />
        </header>

        <main>
          <h1>Seu ponto de partida para a reciclagem!</h1>
          <p>Facilitando a busca por pontos de coleta para transformar resíduos em brindes sustentáveis.</p>

          <Link to="/signup">
            <span>
              <FiLogIn />
            </span>
            <strong>Entrar</strong>
          </Link>

          <Link to="/sigin">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastre-se agora</strong>
          </Link>
        </main>
      </div>
    </div>
  )
}

export default Home;