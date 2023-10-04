import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';

import './styles.css';

import logo from '../../assets/logo.svg';

// array ou objeto: manualmente informar o tipo da variavel

interface Profile {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

const Signup = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    api.get('/profiles').then(response => {
      setProfiles(response.data);
    });
  }, []);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  function handleSelectProfile(id: number) {
    const alreadySelected = selectedProfiles.findIndex(profile => profile === id);

    if (alreadySelected >= 0) {
      const filteredProfiles = selectedProfiles.filter(profile => profile !== id);

      setSelectedProfiles(filteredProfiles);
    } else {
      setSelectedProfiles([ id ]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const profiles = selectedProfiles;

    // const data = new FormData();

    // data.append('name', name);
    // data.append('email', email);
    // data.append('whatsapp', whatsapp);
    // data.append('profile', profiles.join(''));

    const data = {
      name,
      email,
      whatsapp,
      profile: profiles.join(''),
    }

    // await api.post('user', data);
    console.log(data)
    alert('Ponto de coleta criado!');

    // navigate('/');
  }

  return (
    <div id="page-signup">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>

        <fieldset>
          <header role="legend">
            <h2>Seus Dados</h2>
          </header>

          <div className="field">
            <label htmlFor="name">Nome</label>
            <input 
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input 
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input 
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <header role="legend">
            <h2>Perfil</h2>
            <span>Selecione seu perfil de jogador abaixo</span>
          </header>

          <ul className="profiles-grid">
            {profiles.map(profile => (
              <li 
                key={profile.id} 
                onClick={() => handleSelectProfile(profile.id)}
                className={selectedProfiles.includes(profile.id) ? 'selected' : ''}
              >
                <img src={profile.image_url} alt={profile.name} />
                <span>{profile.name}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">
          Iniciar jornada
        </button>
      </form>
    </div>
  );
};

export default Signup;